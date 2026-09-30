// KI-Schicht ohne Netz: simulierter Client prüft Anfrageform und Antwortverarbeitung.
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProperty } from '../src/model/schema.js';
import { AnthropicProvider, OfflineProvider, ProviderError, createProvider } from '../server/ai/providers.js';
import { SYSTEM_PROMPT, userMessage } from '../server/ai/prompt.js';
import { factBase } from '../src/model/facts.js';
import { example, exampleTexts } from './helpers.js';

const p = normalizeProperty(example({ images: false }));

function stubClient(response) {
  const calls = [];
  return { calls, beta: { messages: { create: async (req) => { calls.push(req); return response; } } } };
}

test('Anfrage enthält Systemprompt, Fakten, fehlende Angaben und ein Schema mit erlaubten Faktenfeldern', async () => {
  const ex = exampleTexts();
  const client = stubClient({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ title: ex.title, overview: ex.overview, arguments: ex.arguments }) }] });
  const texts = await new AnthropicProvider({ client }).generate(p);
  const req = client.calls[0];
  assert.equal(req.model, 'claude-opus-5-5');
  assert.equal(req.system, SYSTEM_PROMPT);
  assert.equal(req.output_config.format.type, 'json_schema');
  const basisEnum = req.output_config.format.schema.properties.arguments.items.properties.basis.items.enum;
  assert.ok(basisEnum.includes('grundstuecksflaeche'));
  assert.ok(!basisEnum.includes('baujahr'), 'nicht erfasste Felder sind als Grundlage nicht wählbar');
  assert.match(req.messages[0].content, /FEHLT \(nicht erwähnen\): .*baujahr/);
  assert.equal(texts.provider, 'anthropic');
  assert.equal(texts.arguments.length, 4);
});

test('Verdichten übergibt die bisherige Fassung und kleinere Budgets', async () => {
  const msg = userMessage(factBase(p), { factor: 0.8, previous: { title: 'X' } });
  assert.match(msg, /VERDICHTEN/);
  assert.match(msg, /overview.ausgangslage: höchstens 264 Zeichen/);
});

test('Ablehnung, abgeschnittene und ungültige Antworten werden sauber gemeldet', async () => {
  await assert.rejects(new AnthropicProvider({ client: stubClient({ stop_reason: 'refusal', content: [] }) }).generate(p), ProviderError);
  await assert.rejects(new AnthropicProvider({ client: stubClient({ stop_reason: 'max_tokens', content: [] }) }).generate(p), /unvollständig/);
  await assert.rejects(new AnthropicProvider({ client: stubClient({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'kein json' }] }) }).generate(p), /kein gültiges JSON/);
});

test('Ohne API-Schlüssel wird der regelbasierte Provider verwendet', async () => {
  const prov = createProvider({});
  assert.ok(prov instanceof OfflineProvider);
  assert.equal((await prov.generate(p)).provider, 'offline');
  assert.ok(createProvider({ ANTHROPIC_API_KEY: 'test' }) instanceof AnthropicProvider);
});

// Austauschbare KI-Schnittstelle.
//
// Jeder Provider implementiert: async generate(property, { factor, previous }) -> texts
// Neue Anbieter werden hier registriert; der Rest der Anwendung kennt nur die Schnittstelle.
import Anthropic from '@anthropic-ai/sdk';
import { factBase } from '../../src/model/facts.js';
import { offlineTexts, normalizeTexts } from '../../src/content/texts.js';
import { SYSTEM_PROMPT, userMessage, responseSchema } from './prompt.js';

export class OfflineProvider {
  name = 'offline';
  label = 'Regelbasiert (ohne KI)';
  async generate(p) {
    return offlineTexts(p);
  }
}

export class AnthropicProvider {
  name = 'anthropic';
  label = 'Claude';
  constructor({ apiKey, model, effort, client } = {}) {
    this.model = model || 'claude-opus-5-5';
    this.effort = effort || 'medium';
    this.client = client || new Anthropic(apiKey ? { apiKey } : {});
  }

  async generate(p, { factor = 1, previous = null } = {}) {
    const fb = factBase(p);
    const response = await this.client.beta.messages.create({
      model: this.model,
      max_tokens: 16000,
      // Lehnt ein Sicherheitsfilter die Anfrage ab, beantwortet ein Ersatzmodell sie serverseitig.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      output_config: {
        effort: this.effort,
        format: { type: 'json_schema', schema: responseSchema(Object.keys(fb.facts)) },
      },
      messages: [{ role: 'user', content: userMessage(fb, { factor, previous }) }],
    });
    if (response.stop_reason === 'refusal') throw new ProviderError('Die KI hat die Anfrage abgelehnt. Bitte Eingaben prüfen oder regelbasierte Texte verwenden.');
    if (response.stop_reason === 'max_tokens') throw new ProviderError('Die KI-Antwort war unvollständig. Bitte erneut versuchen.');
    const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    let data;
    try { data = JSON.parse(text); } catch { throw new ProviderError('Die KI-Antwort war kein gültiges JSON.'); }
    const texts = normalizeTexts(data);
    texts.provider = 'anthropic';
    texts.generatedAt = new Date().toISOString();
    return texts;
  }
}

export class ProviderError extends Error {}

export function createProvider(env = process.env) {
  const wanted = (env.AI_PROVIDER || (env.ANTHROPIC_API_KEY ? 'anthropic' : 'offline')).toLowerCase();
  if (wanted === 'anthropic') {
    return new AnthropicProvider({ apiKey: env.ANTHROPIC_API_KEY, model: env.AI_MODEL, effort: env.AI_EFFORT });
  }
  return new OfflineProvider();
}

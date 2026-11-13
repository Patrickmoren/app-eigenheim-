// Standardvorlage «Geheimhaltungsverpflichtung».
//
// WICHTIG: Der Wortlaut ist eine feste Vorlage und wird NICHT von der KI erzeugt oder verändert.
// Eingesetzt werden nur die variablen Felder in {{…}}.
//
// Die bestehende Schaeppi-Geheimhaltungsverpflichtung lag bei der Entwicklung nicht als Datei vor.
// Diese Fassung deckt die dort geregelten Punkte ab (Definition, Ausnahmen, Geheimhaltungspflicht,
// Verwendung, Weitergabe an Mitarbeitende und Berater, Rückgabe/Vernichtung, Abbruch der
// Gespräche, Laufzeit, Schweizer Recht, Gerichtsstand Basel). Vor dem produktiven Einsatz den
// Wortlaut der Klauseln 1:1 durch die freigegebene Schaeppi-Vorlage ersetzen – nur diese Datei.
//
// Platzhalter: {{objekt}} {{adresse}} {{unternehmen}} {{unternehmenAdresse}} {{vertreter}}
//              {{ort}} {{datum}} {{laufzeit}} {{firma}} {{firmaAdresse}} {{gerichtsstand}}

export const NDA_TEMPLATE = {
  version: '2026-09',
  title: 'Geheimhaltungsverpflichtung',
  parties: {
    intro: 'zwischen',
    recipient: ['{{unternehmen}}', '{{unternehmenAdresse}}', 'vertreten durch {{vertreter}}', '(nachfolgend «Interessent»)'],
    and: 'und',
    discloser: ['{{firma}}', '{{firmaAdresse}}', 'handelnd im Auftrag der Eigentümerschaft', '(nachfolgend «Schaeppi»)'],
    subject: 'betreffend das Verkaufsobjekt',
    object: ['{{objekt}}', '{{adresse}}', '(nachfolgend «Verkaufsobjekt»)'],
  },
  clauses: [
    {
      title: 'Gegenstand',
      text: [
        'Der Interessent prüft den möglichen Erwerb des Verkaufsobjekts (nachfolgend «Transaktion»). Schaeppi stellt dem Interessenten zu diesem Zweck Informationen zur Verfügung. Die Zurverfügungstellung erfolgt ausschliesslich unter der Bedingung, dass der Interessent die nachstehenden Verpflichtungen einhält.',
      ],
    },
    {
      title: 'Vertrauliche Informationen',
      text: [
        'Als vertrauliche Informationen gelten sämtliche Informationen über das Verkaufsobjekt, die Eigentümerschaft und die Transaktion, die dem Interessenten vor oder nach Unterzeichnung dieser Verpflichtung in irgendeiner Form – schriftlich, mündlich, elektronisch, in einem Datenraum oder anlässlich von Besichtigungen – zugänglich gemacht werden, einschliesslich aller daraus erstellten Analysen, Auszüge und Kopien. Vertraulich sind auch die Tatsache, dass Gespräche über die Transaktion geführt werden, sowie deren Inhalt.',
      ],
    },
    {
      title: 'Ausnahmen',
      text: [
        'Nicht als vertraulich gelten Informationen, die (a) im Zeitpunkt der Bekanntgabe bereits öffentlich zugänglich sind oder später ohne Verletzung dieser Verpflichtung öffentlich zugänglich werden, (b) dem Interessenten nachweislich bereits vor der Bekanntgabe rechtmässig bekannt waren, (c) dem Interessenten von einem Dritten rechtmässig und ohne Geheimhaltungspflicht zugänglich gemacht werden oder (d) aufgrund einer gesetzlichen Pflicht oder einer behördlichen oder gerichtlichen Anordnung offengelegt werden müssen. Im Fall (d) informiert der Interessent Schaeppi, soweit rechtlich zulässig, vorgängig und beschränkt die Offenlegung auf das erforderliche Mass.',
      ],
    },
    {
      title: 'Geheimhaltung',
      text: [
        'Der Interessent verpflichtet sich, die vertraulichen Informationen streng vertraulich zu behandeln, sie mit mindestens derselben Sorgfalt zu schützen wie eigene vertrauliche Informationen und sie Dritten weder ganz noch teilweise zugänglich zu machen, soweit diese Verpflichtung nichts anderes vorsieht.',
      ],
    },
    {
      title: 'Verwendung',
      text: [
        'Die vertraulichen Informationen dürfen ausschliesslich zur Prüfung und allfälligen Durchführung der Transaktion verwendet werden. Jede andere Verwendung, insbesondere zu eigenen oder fremden Wettbewerbszwecken, ist untersagt.',
      ],
    },
    {
      title: 'Weitergabe an Mitarbeitende',
      text: [
        'Der Interessent darf vertrauliche Informationen seinen Organen und Mitarbeitenden nur zugänglich machen, soweit diese sie für die Prüfung der Transaktion benötigen. Er informiert diese Personen über die Vertraulichkeit und verpflichtet sie zur Einhaltung dieser Verpflichtung. Der Interessent steht für deren Verhalten ein.',
      ],
    },
    {
      title: 'Weitergabe an Dritte und Berater',
      text: [
        'Eine Weitergabe an beigezogene Berater (insbesondere Rechtsanwälte, Treuhänder, Bewertungsexperten und finanzierende Banken) ist zulässig, soweit diese die Informationen für die Transaktion benötigen und einer gesetzlichen oder mindestens gleichwertigen vertraglichen Geheimhaltungspflicht unterstehen. Eine Weitergabe an weitere Dritte bedarf der vorgängigen schriftlichen Zustimmung von Schaeppi. Der Interessent steht für die Einhaltung dieser Verpflichtung durch die Empfänger ein.',
      ],
    },
    {
      title: 'Rückgabe und Vernichtung',
      text: [
        'Auf erstes Verlangen von Schaeppi oder beim Abbruch der Gespräche gibt der Interessent sämtliche vertraulichen Informationen unverzüglich zurück oder vernichtet bzw. löscht sie einschliesslich aller Kopien, Auszüge und Analysen und bestätigt dies auf Verlangen schriftlich. Vorbehalten bleiben gesetzliche Aufbewahrungspflichten und automatisch erstellte Datensicherungen; diese unterliegen weiterhin dieser Verpflichtung.',
      ],
    },
    {
      title: 'Beendigung der Gespräche',
      text: [
        'Jede Partei kann die Gespräche über die Transaktion jederzeit und ohne Angabe von Gründen beenden. Aus dieser Verpflichtung und aus der Zurverfügungstellung von Informationen entsteht kein Anspruch auf Abschluss eines Vertrags. Schaeppi und die Eigentümerschaft übernehmen keine Gewähr für die Richtigkeit und Vollständigkeit der Informationen. Kosten trägt jede Partei selbst. Die Geheimhaltungspflichten bleiben auch nach Beendigung der Gespräche bestehen.',
      ],
    },
    {
      title: 'Laufzeit',
      text: [
        'Diese Verpflichtung tritt mit der Unterzeichnung in Kraft und gilt für die Dauer von {{laufzeit}} ab Unterzeichnung.',
      ],
    },
    {
      title: 'Anwendbares Recht und Gerichtsstand',
      text: [
        'Diese Verpflichtung untersteht schweizerischem Recht. Ausschliesslicher Gerichtsstand ist {{gerichtsstand}}.',
      ],
    },
  ],
  signature: {
    placeDate: '{{ort}}, {{datum}}',
    label: 'Der Interessent',
    lines: ['Unterschrift', 'Name, Funktion'],
    count: 2,
  },
};

// Leere Felder bleiben als Ausfülllinie stehen – die NDA ist ein Formular zur Unterzeichnung.
export const BLANK = '____________________';

export function fillPlaceholders(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = values[k];
    return v === undefined || v === null || String(v).trim() === '' ? BLANK : String(v).trim();
  });
}

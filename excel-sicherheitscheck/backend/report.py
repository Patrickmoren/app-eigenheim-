# -*- coding: utf-8 -*-
"""Erstellt aus einem Bericht (analyzer.Bericht) ein PDF im Stil eines
verständlichen Geschäftsberichts – keine technische Fehlerliste, sondern
Befund, Risiko fürs Geschäft, Empfehlung. Deutsch, Schweizer Kontext."""
from __future__ import annotations

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_LEFT

FARBE = {
    "kritisch": colors.HexColor("#b3261e"),
    "hoch": colors.HexColor("#c56a00"),
    "mittel": colors.HexColor("#8a6d00"),
    "hinweis": colors.HexColor("#4a5568"),
}
LABEL = {
    "kritisch": "KRITISCH",
    "hoch": "HOCH",
    "mittel": "MITTEL",
    "hinweis": "HINWEIS",
}
ERKLAERUNG = {
    "kritisch": "akuter Handlungsbedarf – Daten oder Ergebnisse sind bereits falsch oder gehen verloren",
    "hoch": "sollte zeitnah behoben werden – reales Fehlerrisiko bei normaler Nutzung",
    "mittel": "sollte eingeplant werden – erhöhtes Risiko oder spürbare Nachteile",
    "hinweis": "keine akute Gefahr, aber wartungs- oder leistungsrelevant",
}


def _styles():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle("Titel", parent=ss["Title"], fontSize=22, spaceAfter=4,
                           textColor=colors.HexColor("#1a1a2e")))
    ss.add(ParagraphStyle("Untertitel", parent=ss["Normal"], fontSize=11,
                           textColor=colors.HexColor("#555555"), spaceAfter=14))
    ss.add(ParagraphStyle("Abschnitt", parent=ss["Heading2"], fontSize=14, spaceBefore=18,
                           spaceAfter=8, textColor=colors.HexColor("#1a1a2e")))
    ss.add(ParagraphStyle("BefundTitel", parent=ss["Heading3"], fontSize=11.5, spaceBefore=12,
                           spaceAfter=2, textColor=colors.HexColor("#1a1a2e")))
    ss.add(ParagraphStyle("Fliesstext", parent=ss["Normal"], fontSize=9.7, leading=13.5))
    ss.add(ParagraphStyle("Label", parent=ss["Normal"], fontSize=8.3, leading=12,
                           textColor=colors.HexColor("#555555")))
    return ss


def erstelle_pdf(bericht, ausgabe_pfad, kunde_name="", kunde_dateiname=""):
    ss = _styles()
    doc = SimpleDocTemplate(ausgabe_pfad, pagesize=A4,
                             leftMargin=20 * mm, rightMargin=20 * mm,
                             topMargin=18 * mm, bottomMargin=18 * mm,
                             title="Excel-Sicherheits-Check")
    story = []

    # --- Deckblatt / Kopf ---
    story.append(Paragraph("Excel-Sicherheits-Check", ss["Titel"]))
    story.append(Paragraph("Automatisierte Risikoprüfung Ihrer Arbeitsmappe", ss["Untertitel"]))
    meta = [
        ["Geprüfte Datei:", kunde_dateiname or bericht.dateiname],
        ["Erstellt für:", kunde_name or "—"],
        ["Datum der Prüfung:", bericht.erstellt.strftime("%d.%m.%Y, %H:%M Uhr")],
        ["Arbeitsblätter:", str(bericht.anzahl_blaetter)],
        ["Formeln geprüft:", f"{bericht.anzahl_formeln:,}".replace(",", "'")],
    ]
    t = Table(meta, colWidths=[42 * mm, 120 * mm])
    t.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#555555")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", color=colors.HexColor("#dddddd")))
    story.append(Spacer(1, 10))

    # --- Zusammenfassung ---
    anzahl = {g: len(bericht.nach_schweregrad(g)) for g in ("kritisch", "hoch", "mittel", "hinweis")}
    story.append(Paragraph("Zusammenfassung", ss["Abschnitt"]))
    if not bericht.findings:
        story.append(Paragraph(
            "Bei der Prüfung wurden keine der bekannten Risikomuster gefunden. Das ist ein gutes "
            "Zeichen, ersetzt aber keine inhaltliche Kontrolle der Zahlen selbst – dieser Check "
            "prüft die technische Konstruktion der Arbeitsmappe, nicht die fachliche Richtigkeit "
            "der eingegebenen Werte.", ss["Fliesstext"]))
    else:
        zeilen = [["Schweregrad", "Anzahl", "Bedeutung"]]
        for g in ("kritisch", "hoch", "mittel", "hinweis"):
            if anzahl[g]:
                zeilen.append([LABEL[g], str(anzahl[g]), ERKLAERUNG[g]])
        tab = Table(zeilen, colWidths=[26 * mm, 18 * mm, 118 * mm])
        stil = [
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0f0f3")),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("LINEBELOW", (0, 0), (-1, 0), 0.5, colors.HexColor("#cccccc")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]
        for i, g in enumerate([g for g in ("kritisch", "hoch", "mittel", "hinweis") if anzahl[g]], start=1):
            stil.append(("TEXTCOLOR", (0, i), (1, i), FARBE[g]))
            stil.append(("FONTNAME", (0, i), (0, i), "Helvetica-Bold"))
        tab.setStyle(TableStyle(stil))
        story.append(tab)
        story.append(Spacer(1, 8))
        kritisch_hoch = anzahl["kritisch"] + anzahl["hoch"]
        if kritisch_hoch:
            story.append(Paragraph(
                f"<b>{kritisch_hoch} von {len(bericht.findings)} Befunden</b> betreffen Risiken, "
                "die im laufenden Betrieb bereits zu falschen Zahlen oder stillem Datenverlust "
                "führen können. Details und Empfehlung je Befund ab der nächsten Seite.",
                ss["Fliesstext"]))
        else:
            story.append(Paragraph(
                "Keine kritischen oder hohen Risiken gefunden. Die verbleibenden Punkte betreffen "
                "Wartbarkeit und Leistung, keine akute Fehlergefahr.", ss["Fliesstext"]))

    story.append(PageBreak())

    # --- Einzelbefunde ---
    if bericht.findings:
        story.append(Paragraph("Befunde im Einzelnen", ss["Abschnitt"]))
        for i, f in enumerate(bericht.sortiert(), start=1):
            titel = f'<font color="{FARBE[f.schweregrad].hexval()}"><b>{LABEL[f.schweregrad]}</b></font>' \
                    f'  ·  {i}. {f.kategorie}'
            story.append(Paragraph(titel, ss["BefundTitel"]))
            story.append(Paragraph(f"<b>Fundort:</b> {f.fundort}", ss["Label"]))
            story.append(Paragraph(f"<b>Befund:</b> {f.befund}", ss["Fliesstext"]))
            story.append(Paragraph(f"<b>Risiko fürs Geschäft:</b> {f.risiko}", ss["Fliesstext"]))
            story.append(Paragraph(f"<b>Empfehlung:</b> {f.empfehlung}", ss["Fliesstext"]))
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", color=colors.HexColor("#eeeeee")))

    story.append(Spacer(1, 14))
    story.append(Paragraph("Über diesen Check", ss["Abschnitt"]))
    story.append(Paragraph(
        "Dieser Bericht prüft ausschliesslich die technische Konstruktion der Excel-Datei "
        "(Formelbezüge, Bereichsgrenzen, Dateneingabeprüfung, Schutzeinstellungen, Formatierung "
        "von Datumswerten und ähnliche, wiederkehrende Fehlerquellen aus der Praxis). Er ersetzt "
        "weder eine fachliche Prüfung der Inhalte noch eine Rechts- oder Steuerberatung. "
        "Grundlage der Prüfregeln sind bekannte, dokumentierte Fehlerquellen aus dem produktiven "
        "Einsatz von Excel-Arbeitsmappen.", ss["Fliesstext"]))

    doc.build(story)
    return ausgabe_pfad


if __name__ == "__main__":
    import sys
    sys.path.insert(0, ".")
    from analyzer import analysiere_datei
    if len(sys.argv) < 2:
        print("Aufruf: python3 report.py Datei.xlsx [Kundenname]")
        sys.exit(1)
    pfad = sys.argv[1]
    kunde = sys.argv[2] if len(sys.argv) > 2 else ""
    bericht = analysiere_datei(pfad)
    ausgabe = "Bericht_" + pfad.rsplit("/", 1)[-1].replace(".xlsx", "") + ".pdf"
    erstelle_pdf(bericht, ausgabe, kunde_name=kunde, kunde_dateiname=pfad)
    print(f"PDF erstellt: {ausgabe} ({len(bericht.findings)} Befund(e))")

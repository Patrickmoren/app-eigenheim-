# Einrichtung des Schaeppi Verkaufsunterlagens unter Windows
#  - prueft Node.js und installiert die Komponenten
#  - legt die Desktop-Verknuepfung "Verkaufsunterlagen" an
#  - optional: Start mit Windows (ohne Browserfenster) und KI-Schluessel
$ErrorActionPreference = 'Stop'
$App = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$Starter = Join-Path $PSScriptRoot 'Verkaufsunterlagen.cmd'

Write-Host ''
Write-Host 'Schaeppi Verkaufsunterlagen - Einrichtung' -ForegroundColor Cyan
Write-Host "Programmordner: $App"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host ''
  Write-Host 'Node.js fehlt.' -ForegroundColor Yellow
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    $a = Read-Host 'Node.js LTS jetzt mit winget installieren? (j/n)'
    if ($a -eq 'j') {
      winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
      $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
    }
  }
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Bitte Node.js LTS von https://nodejs.org installieren und diese Einrichtung erneut starten.' -ForegroundColor Red
    exit 1
  }
}
Write-Host ("Node.js " + (node --version))

Push-Location $App
try { npm install --omit=dev --no-audit --no-fund } finally { Pop-Location }

$Shell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')

$lnk = $Shell.CreateShortcut((Join-Path $Desktop 'Verkaufsunterlagen.lnk'))
$lnk.TargetPath = $Starter
$lnk.WorkingDirectory = $App
$lnk.Description = 'Schaeppi Verkaufsunterlagen starten'
$lnk.Save()
Write-Host 'Desktop-Verknuepfung "Verkaufsunterlagen" angelegt.' -ForegroundColor Green

$a = Read-Host 'Mit Windows automatisch starten, damit der Eingangsordner immer verarbeitet wird? (j/n)'
if ($a -eq 'j') {
  $Startup = [Environment]::GetFolderPath('Startup')
  $auto = $Shell.CreateShortcut((Join-Path $Startup 'Verkaufsunterlagen.lnk'))
  $auto.TargetPath = $Starter
  $auto.Arguments = '--kein-browser'
  $auto.WorkingDirectory = $App
  $auto.WindowStyle = 7
  $auto.Save()
  Write-Host 'Autostart eingerichtet (startet minimiert).' -ForegroundColor Green
}

$key = Read-Host 'KI-Schluessel (Anthropic API) fuer KI-Texte - leer lassen fuer regelbasierte Texte' -AsSecureString
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($key))
if ($plain) {
  [Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', $plain, 'User')
  Write-Host 'KI-Schluessel fuer dieses Benutzerkonto gespeichert.' -ForegroundColor Green
}

$soffice = 'C:\Program Files\LibreOffice\program\soffice.exe'
if (-not (Test-Path $soffice)) {
  Write-Host ''
  Write-Host 'Hinweis: LibreOffice ist nicht installiert. Die 2-Seiten-Pruefung erfolgt dann rechnerisch.' -ForegroundColor Yellow
  Write-Host 'Fuer die zusaetzliche Gegenpruefung LibreOffice installieren (winget install TheDocumentFoundation.LibreOffice).'
}

Write-Host ''
Write-Host 'Fertig. Doppelklick auf "Verkaufsunterlagen" auf dem Desktop startet das Programm.' -ForegroundColor Cyan
Write-Host 'Der Arbeitsordner "Verkaufsunterlagen" (Eingang/Ausgang/Archiv) erscheint beim ersten Start auf dem Desktop.'

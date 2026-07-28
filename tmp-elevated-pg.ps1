$ErrorActionPreference = "Stop"
$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$HBA = Join-Path $PG_DATA "pg_hba.conf"
$BAK = Join-Path $PG_DATA "pg_hba.conf.bak-cursor"
$log = "D:\Nukta\Print\tmp-elevated-pg.log"
function Log($m){ Add-Content $log $m }

try {
  Set-Content $log "START $(Get-Date)"
  if (-not (Test-Path $BAK)) { Copy-Item $HBA $BAK -Force }
  $hba = Get-Content $HBA -Raw
  $hba2 = $hba -replace '(host\s+all\s+all\s+127\.0\.0\.1/32\s+)scram-sha-256','$1trust'
  $hba2 = $hba2 -replace '(host\s+all\s+all\s+::1/128\s+)scram-sha-256','$1trust'
  Set-Content -Path $HBA -Value $hba2 -NoNewline
  Log "hba patched"
  & "$PG_BIN\pg_ctl.exe" reload -D $PG_DATA
  Log "reload exit $LASTEXITCODE"
  Set-Content "D:\Nukta\Print\tmp-elevated-ready.txt" "READY"
  Log "DONE"
} catch {
  Log "ERR $($_.Exception.Message)"
  Set-Content "D:\Nukta\Print\tmp-elevated-ready.txt" "FAIL"
}

<#
  Visually-lossless media prep for Cloudflare R2.

  Re-encodes every .mp4 under public/media with H.264 CRF 18 (imperceptible
  quality loss — safe to A/B) + web-fast-start, and copies posters/filmstrips/
  testimonials as-is. Output mirrors the folder layout into ./media-r2, which is
  what you upload to R2. Originals in public/media are never touched.

  Run:  pwsh scripts/compress-media.ps1
  Needs: ffmpeg on PATH (ffmpeg -version to check).
#>

$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot '..\public\media'
$out = Join-Path $PSScriptRoot '..\media-r2'

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Error 'ffmpeg not found on PATH.'; exit 1
}
if (-not (Test-Path $src)) { Write-Error "No media at $src"; exit 1 }

$files = Get-ChildItem -Path $src -Recurse -File
$totalIn = 0; $totalOut = 0

foreach ($f in $files) {
  $rel = $f.FullName.Substring((Resolve-Path $src).Path.Length).TrimStart('\','/')
  $dest = Join-Path $out $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null

  if (Test-Path $dest) { Write-Host "skip  $rel (exists)"; continue }

  if ($f.Extension -ieq '.mp4') {
    Write-Host "encode $rel"
    & ffmpeg -hide_banner -loglevel error -i $f.FullName `
      -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p `
      -c:a aac -b:a 160k -movflags +faststart $dest
    $totalIn  += $f.Length
    $totalOut += (Get-Item $dest).Length
  } else {
    Copy-Item $f.FullName $dest
  }
}

if ($totalIn -gt 0) {
  $inMB  = [math]::Round($totalIn / 1MB)
  $outMB = [math]::Round($totalOut / 1MB)
  $pct   = [math]::Round(100 - ($totalOut / $totalIn * 100))
  Write-Host ""
  Write-Host "Video: $inMB MB -> $outMB MB  ($pct% smaller). Output: $out"
}
Write-Host "Done. Upload the media-r2 folder to R2 (see DEPLOY.md step 3)."

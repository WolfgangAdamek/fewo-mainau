$ErrorActionPreference = 'Stop'
$ffmpeg = 'C:\Program Files (x86)\MiniTool uTube Downloader\ffmpeg.exe'
$ffprobe = 'C:\Program Files (x86)\MiniTool uTube Downloader\ffprobe.exe'
$sourceDir = 'E:\FEWO\video\bilder'
$workDir = Join-Path $PSScriptRoot '_render'
$outputFile = Join-Path $PSScriptRoot 'Ferienwohnung-Mainau-60s-4x3.mp4'
New-Item -ItemType Directory -Path $workDir -Force -ErrorAction Stop | Out-Null

$photos = @(
  'P1200879.JPG',
  'P1150473.JPG',
  'fewo-mainau-eingang-balkon.jpg',
  'EZ1.jpg',
  'KUE.jpg',
  'WZ-4.jpg',
  'SZ-1.jpg',
  'bad-2.jpg',
  'loggia-2026-final.jpg',
  'Fahr2.jpg',
  'fahrrad.jpg',
  'Vespa-Faehre-chat.jpg'
)
$preparedPhotos = @()
for ($i = 0; $i -lt $photos.Count; $i++) {
  $source = Join-Path $sourceDir $photos[$i]
  if (-not (Test-Path -LiteralPath $source)) { throw "Bild fehlt: $source" }
  $target = Join-Path $workDir ('photo-{0:D2}.png' -f $i)
  $size = & $ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $source
  if ($LASTEXITCODE -ne 0 -or $size -notmatch '^([0-9]+)x([0-9]+)$') { throw "Bildgröße nicht lesbar: $source" }
  $width = [int]$Matches[1]
  $height = [int]$Matches[2]
  if ($width / $height -ge 1.1) {
    $filter = 'scale=1440:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1440:1080,setsar=1,format=rgb24'
    & $ffmpeg -hide_banner -loglevel error -y -i $source -vf $filter -frames:v 1 $target
  } else {
    $filter = '[0:v]split=2[back][front];[back]scale=1440:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1440:1080,boxblur=24:1,eq=brightness=-0.08:saturation=0.85[blur];[front]scale=1440:1080:force_original_aspect_ratio=decrease:flags=lanczos[fit];[blur][fit]overlay=(W-w)/2:(H-h)/2,setsar=1,format=rgb24[out]'
    & $ffmpeg -hide_banner -loglevel error -y -i $source -filter_complex $filter -map '[out]' -frames:v 1 $target
  }
  if ($LASTEXITCODE -ne 0) { throw "Bildvorbereitung fehlgeschlagen: $source" }
  $preparedPhotos += $target
  Write-Host ('Bild {0}/{1}: {2}' -f ($i + 1), $photos.Count, $photos[$i])
}
$logo = Join-Path $sourceDir 'logo-neu-rgb.png'
$logoCard = Join-Path $workDir 'logo-card.png'
if (-not (Test-Path -LiteralPath $logo)) { throw "Logo fehlt: $logo" }
$logoFilter = '[1:v]scale=1360:-1:flags=lanczos[logo];[0:v][logo]overlay=(W-w)/2:(H-h)/2,format=rgb24[out]'
& $ffmpeg -hide_banner -loglevel error -y -f lavfi -i 'color=c=white:s=1440x1080:r=25' -i $logo -filter_complex $logoFilter -map '[out]' -frames:v 1 $logoCard
if ($LASTEXITCODE -ne 0) { throw 'Logokarte konnte nicht erzeugt werden.' }

$scenes = @($logoCard) + $preparedPhotos + @($logoCard)
$durations = @(3.0) + @(1..12 | ForEach-Object { 5.0 }) + @(4.8)
$ffArgs = @('-hide_banner', '-loglevel', 'warning', '-stats', '-y')
for ($i = 0; $i -lt $scenes.Count; $i++) {
  $durationText = $durations[$i].ToString('0.0', [System.Globalization.CultureInfo]::InvariantCulture)
  $ffArgs += @('-loop', '1', '-framerate', '25', '-t', $durationText, '-i', $scenes[$i])
}
$filters = @()
for ($i = 0; $i -lt $scenes.Count; $i++) {
  if ($i -eq 0 -or $i -eq $scenes.Count - 1) {
    $filters += ('[{0}:v]scale=1280:960:flags=lanczos,format=yuv420p,setsar=1,setpts=PTS-STARTPTS[v{0}]' -f $i)
  } else {
    $filters += ('[{0}:v]zoompan=z=''min(zoom+0.0002,1.025)'':x=''iw/2-(iw/zoom/2)'':y=''ih/2-(ih/zoom/2)'':d=1:s=1280x960:fps=25,format=yuv420p,setsar=1,setpts=PTS-STARTPTS[v{0}]' -f $i)
  }
}
$elapsed = $durations[0]
for ($i = 1; $i -lt $scenes.Count; $i++) {
  $offset = ($elapsed - 0.6).ToString('0.0', [System.Globalization.CultureInfo]::InvariantCulture)
  $first = if ($i -eq 1) { '[v0]' } else { '[x{0}]' -f ($i - 1) }
  $filters += ('{0}[v{1}]xfade=transition=fade:duration=0.6:offset={2}[x{1}]' -f $first, $i, $offset)
  $elapsed += $durations[$i] - 0.6
}
$ffArgs += @('-filter_complex', ($filters -join ';'), '-map', ('[x{0}]' -f ($scenes.Count - 1)), '-frames:v', '1500', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '25', '-movflags', '+faststart', $outputFile)
Write-Host "Rendere $outputFile"
& $ffmpeg @ffArgs
if ($LASTEXITCODE -ne 0) { throw 'Videoexport fehlgeschlagen.' }
Write-Host "Fertig: $outputFile"

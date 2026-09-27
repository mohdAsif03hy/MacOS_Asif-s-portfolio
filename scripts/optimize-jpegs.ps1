Add-Type -AssemblyName System.Drawing

function Optimize-Jpeg {
    param([string]$path, [int]$maxDimension = 1000, [long]$quality = 85)
    if (!(Test-Path $path)) { return }
    
    $bytesBefore = (Get-Item $path).Length
    $stream = [System.IO.File]::OpenRead($path)
    $orig = [System.Drawing.Image]::FromStream($stream)
    $origW = $orig.Width
    $origH = $orig.Height
    
    $newW = $origW
    $newH = $origH
    if ($origW -gt $maxDimension -or $origH -gt $maxDimension) {
        if ($origW -gt $origH) {
            $newW = $maxDimension
            $newH = [int](($origH * $maxDimension) / $origW)
        } else {
            $newH = $maxDimension
            $newW = [int](($origW * $maxDimension) / $origH)
        }
    }

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($orig, 0, 0, $newW, $newH)
    $stream.Close()
    $stream.Dispose()
    $orig.Dispose()
    $g.Dispose()

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

    $tempPath = $path + '.opt.jpg'
    $bmp.Save($tempPath, $encoder, $encoderParams)
    $bmp.Dispose()

    Move-Item -Path $tempPath -Destination $path -Force
    $bytesAfter = (Get-Item $path).Length
    $kbBefore = [math]::Round($bytesBefore / 1024, 1)
    $kbAfter = [math]::Round($bytesAfter / 1024, 1)
    Write-Host "Optimized JPEG $path : ${kbBefore}KB -> ${kbAfter}KB (${newW}x${newH})"
}

$jpegs = @(
    'd:\mac os\public\images\adrian.jpeg',
    'd:\mac os\public\images\adrian-2.jpeg',
    'd:\mac os\public\images\adrian-3.jpeg',
    'd:\mac os\public\images\trash-1.jpeg',
    'd:\mac os\public\images\trash-2.jpeg'
)

foreach ($jpg in $jpegs) {
    Optimize-Jpeg -path $jpg -maxDimension 600 -quality 85
}

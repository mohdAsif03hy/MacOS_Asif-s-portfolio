Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param([string]$path, [int]$maxDimension = 900)
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

    $tempPath = $path + '.opt.png'
    $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Move-Item -Path $tempPath -Destination $path -Force
    $bytesAfter = (Get-Item $path).Length
    $kbBefore = [math]::Round($bytesBefore / 1024, 1)
    $kbAfter = [math]::Round($bytesAfter / 1024, 1)
    Write-Host "Optimized $path : ${kbBefore}KB -> ${kbAfter}KB (${newW}x${newH})"
}

$images = @(
    'd:\mac os\public\images\project-3.png',
    'd:\mac os\public\images\project-1.png',
    'd:\mac os\public\images\project-2.png',
    'd:\mac os\public\images\gal1.png',
    'd:\mac os\public\images\gal2.png',
    'd:\mac os\public\images\gal3.png',
    'd:\mac os\public\images\gal4.png',
    'd:\mac os\public\images\blog3.png',
    'd:\mac os\public\images\trash.png'
)

foreach ($img in $images) {
    Optimize-Image -path $img -maxDimension 900
}

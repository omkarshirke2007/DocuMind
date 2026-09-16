param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath
)

[Windows.Media.Ocr.OcrEngine, Windows.Foundation.Diagnostics, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.Diagnostics, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation.Diagnostics, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$resolvedPath = (Resolve-Path $ImagePath).Path
$file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($resolvedPath).GetAwaiter().GetResult()
$stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
$decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
$bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if (-not $engine) {
    $lang = [Windows.Globalization.Language]::new("en-US")
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
}

$result = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
$words = @()
foreach ($line in $result.Lines) {
    foreach ($word in $line.Words) {
        $words += [PSCustomObject]@{
            text = $word.Text
            x = [int]$word.BoundingRect.X
            y = [int]$word.BoundingRect.Y
            width = [int]$word.BoundingRect.Width
            height = [int]$word.BoundingRect.Height
        }
    }
}

[PSCustomObject]@{
    text = $result.Text
    imageWidth = $bitmap.PixelWidth
    imageHeight = $bitmap.PixelHeight
    words = $words
} | ConvertTo-Json -Depth 5 -Compress

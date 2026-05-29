# Download third-party assets for local hosting (run after clone or when updating vendor versions)
$root = Join-Path $PSScriptRoot "..\public\assets"
@("vendor\bootstrap", "vendor\owlcarousel", "vendor\jquery", "fonts\vazirmatn") | ForEach-Object {
  New-Item -ItemType Directory -Force -Path (Join-Path $root $_) | Out-Null
}

$files = [ordered]@{
  "vendor\bootstrap\bootstrap.rtl.min.css" = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.rtl.min.css"
  "vendor\bootstrap\bootstrap.bundle.min.js" = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
  "vendor\owlcarousel\owl.carousel.min.css" = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/assets/owl.carousel.min.css"
  "vendor\owlcarousel\owl.theme.default.min.css" = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/assets/owl.theme.default.min.css"
  "vendor\owlcarousel\owl.carousel.min.js" = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/owl.carousel.min.js"
  "vendor\jquery\jquery.min.js" = "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
  "fonts\vazirmatn\vazirmatn-arabic-400-normal.woff2" = "https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@5.0.8/arabic-400-normal.woff2"
  "fonts\vazirmatn\vazirmatn-arabic-700-normal.woff2" = "https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@5.0.8/arabic-700-normal.woff2"
}

foreach ($entry in $files.GetEnumerator()) {
  $dest = Join-Path $root $entry.Key
  Write-Host "Downloading $($entry.Key)..."
  Invoke-WebRequest -Uri $entry.Value -OutFile $dest -UseBasicParsing
}

Write-Host "Done. vazirmatn-local.css is checked into git separately."

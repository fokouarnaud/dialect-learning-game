# Script pour corriger les imports button -> Button
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '@/components/ui/button'") {
        Write-Host "Fixing imports in: $($file.FullName)"
        $newContent = $content -replace "from '@/components/ui/button'", "from '@/components/ui/Button'"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}

Write-Host "Import fixes completed!"
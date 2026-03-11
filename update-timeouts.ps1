# PowerShell script to update all waitForTimeout values to 2000ms (2 seconds)
# This ensures consistent 2-second waits between all steps as requested

$filePath = "c:\Users\61081244\Gillette Germany\tests\homepage.spec.js"
$content = Get-Content -Path $filePath -Raw

Write-Host "Original file size: $($content.Length) characters"

# Replace various timeout values with 2000ms
# Keep 6000ms as it's for auto-scroll testing (intentionally longer)
$replacements = @{
    'waitForTimeout(200)'  = 'waitForTimeout(2000)'
    'waitForTimeout(300)'  = 'waitForTimeout(2000)'
    'waitForTimeout(500)'  = 'waitForTimeout(2000)'
    'waitForTimeout(800)'  = 'waitForTimeout(2000)'
    'waitForTimeout(1000)' = 'waitForTimeout(2000)'
    'waitForTimeout(1500)' = 'waitForTimeout(2000)'
}

$changeCount = 0
foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $beforeCount = ([regex]::Matches($content, [regex]::Escape($old))).Count
    $content = $content -replace [regex]::Escape($old), $new
    $afterCount = ([regex]::Matches($content, [regex]::Escape($new))).Count - ([regex]::Matches($replacements[$old], [regex]::Escape($new))).Count
    
    if ($beforeCount -gt 0) {
        Write-Host "Replaced $beforeCount instances of '$old' with '$new'"
        $changeCount += $beforeCount
    }
}

# Save the updated content
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "`nTotal changes made: $changeCount"
Write-Host "Updated file size: $($content.Length) characters"
Write-Host "`nAll timeout values updated to 2000ms (2 seconds) except auto-scroll test (6000ms)"
Write-Host "File updated: $filePath"

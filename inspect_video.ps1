$sh = New-Object -ComObject Shell.Application
$folder = $sh.Namespace('D:\track\ebook_landingpage')
$file = $folder.ParseName('Create_a_premium_cinematic_D.mp4')
Write-Host "Duration:" $folder.GetDetailsOf($file, 27)
Write-Host "Dimensions:" $folder.GetDetailsOf($file, 28)
Write-Host "Frame Width:" $folder.GetDetailsOf($file, 194)
Write-Host "Frame Height:" $folder.GetDetailsOf($file, 195)
Write-Host "Bit Rate:" $folder.GetDetailsOf($file, 21)
Write-Host "Frame Rate:" $folder.GetDetailsOf($file, 292)
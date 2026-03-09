[CmdletBinding()]
param(
  [string]$RepositoryRoot
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

if (-not $RepositoryRoot) {
  $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
  $RepositoryRoot = (Resolve-Path (Join-Path $scriptRoot "..\..")).Path
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

$releaseDir = Join-Path $RepositoryRoot "release-artifacts"
if (-not (Test-Path $releaseDir)) {
  throw "release-artifacts directory not found."
}

$certificateName = "AION Project Signing"
$cert = Get-ChildItem Cert:\CurrentUser\My |
  Where-Object { $_.FriendlyName -eq $certificateName } |
  Sort-Object NotAfter -Descending |
  Select-Object -First 1

if (-not $cert) {
  throw "Signing certificate '$certificateName' not found. Refresh the project signature first."
}

$manifestPath = Join-Path $releaseDir "AION-RELEASE-SIGNATURE-MANIFEST-0.1.1.json"
$signaturePath = Join-Path $releaseDir "AION-RELEASE-SIGNATURE-0.1.1.p7s"

$trackedFiles = @(
  "AION.Setup.0.1.1.exe",
  "AION.0.1.1.exe",
  "AION-android-debug.apk",
  "AION-ios-xcode-project.zip",
  "AION-Setup-0.1.1.exe.blockmap",
  "latest.yml",
  "SHA256SUMS-0.1.1.txt",
  "FREE-USE-NOTICE.txt",
  "LICENSE",
  "COPYRIGHT.md",
  "REFERENCE.md",
  "FAIR-COMMERCE.md",
  "README.md"
)

$signedFiles = foreach ($relativePath in $trackedFiles) {
  $absolutePath = Join-Path $releaseDir $relativePath
  if (-not (Test-Path $absolutePath)) {
    throw "Release artifact not found: $relativePath"
  }

  [ordered]@{
    path = "release-artifacts/$relativePath"
    sizeBytes = (Get-Item $absolutePath).Length
    sha256 = (Get-FileHash -Path $absolutePath -Algorithm SHA256).Hash
  }
}

$manifest = [ordered]@{
  project = "AION"
  releaseVersion = "0.1.1"
  signaturePurpose = "Release artifact integrity and origin verification"
  owner = [ordered]@{
    name = "Patrick Wirth"
    email = "patrickwirth_93@icloud.com"
  }
  generatedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
  signatureFormat = "PKCS7-detached"
  digestAlgorithm = "SHA256"
  certificate = [ordered]@{
    subject = $cert.Subject
    thumbprint = $cert.Thumbprint
    notBefore = $cert.NotBefore.ToUniversalTime().ToString("o")
    notAfter = $cert.NotAfter.ToUniversalTime().ToString("o")
    publicCertificateCer = "signatures/AION-SIGNING-CERT.cer"
    publicCertificatePem = "signatures/AION-SIGNING-CERT.pem"
  }
  note = "This verifies release origin and file integrity. It is not a public Authenticode trust signature for Windows installers."
  signedFiles = $signedFiles
}

$manifestJson = $manifest | ConvertTo-Json -Depth 8
Write-Utf8NoBom -Path $manifestPath -Content ($manifestJson + "`n")

$contentBytes = [System.IO.File]::ReadAllBytes($manifestPath)
$contentInfo = New-Object System.Security.Cryptography.Pkcs.ContentInfo -ArgumentList (, $contentBytes)
$signedCms = New-Object System.Security.Cryptography.Pkcs.SignedCms -ArgumentList $contentInfo, $true
$cmsSigner = New-Object System.Security.Cryptography.Pkcs.CmsSigner -ArgumentList $cert
$cmsSigner.IncludeOption = [System.Security.Cryptography.X509Certificates.X509IncludeOption]::EndCertOnly
$signedCms.ComputeSignature($cmsSigner)
[System.IO.File]::WriteAllBytes($signaturePath, $signedCms.Encode())

Write-Host "AION release signature refreshed."
Write-Host "Manifest : $manifestPath"
Write-Host "Signature: $signaturePath"

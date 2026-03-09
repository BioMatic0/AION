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

$signaturesDir = Join-Path $RepositoryRoot "signatures"
if (-not (Test-Path $signaturesDir)) {
  New-Item -ItemType Directory -Path $signaturesDir | Out-Null
}

$certificateName = "AION Project Signing"
$cert = Get-ChildItem Cert:\CurrentUser\My |
  Where-Object { $_.FriendlyName -eq $certificateName } |
  Sort-Object NotAfter -Descending |
  Select-Object -First 1

if (-not $cert) {
  $cert = New-SelfSignedCertificate `
    -Subject "CN=Patrick Wirth, O=AION Project, E=patrickwirth_93@icloud.com" `
    -FriendlyName $certificateName `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -KeyAlgorithm RSA `
    -KeyLength 4096 `
    -HashAlgorithm SHA256 `
    -KeyExportPolicy Exportable `
    -KeyUsage DigitalSignature `
    -KeySpec Signature `
    -NotAfter (Get-Date).AddYears(10)
}

$certificateCerPath = Join-Path $signaturesDir "AION-SIGNING-CERT.cer"
$certificatePemPath = Join-Path $signaturesDir "AION-SIGNING-CERT.pem"
$manifestPath = Join-Path $signaturesDir "AION-SIGNATURE-MANIFEST.json"
$signaturePath = Join-Path $signaturesDir "AION-SIGNATURE.p7s"

Export-Certificate -Cert $cert -FilePath $certificateCerPath -Force | Out-Null
$certificateBytes = [System.IO.File]::ReadAllBytes($certificateCerPath)
$certificatePem = "-----BEGIN CERTIFICATE-----`n" +
  ([System.Convert]::ToBase64String($certificateBytes, [System.Base64FormattingOptions]::InsertLineBreaks)) +
  "`n-----END CERTIFICATE-----`n"
Write-Utf8NoBom -Path $certificatePemPath -Content $certificatePem

$trackedFiles = @(
  "README.md",
  "LICENSE",
  "COPYRIGHT.md",
  "REFERENCE.md",
  "FAIR-COMMERCE.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "docs\product\ethical-pillars-review-2026-03-09.md",
  "release-artifacts\SHA256SUMS-0.1.1.txt"
)

$signedFiles = foreach ($relativePath in $trackedFiles) {
  $absolutePath = Join-Path $RepositoryRoot $relativePath
  if (-not (Test-Path $absolutePath)) {
    throw "Signed file not found: $relativePath"
  }

  [ordered]@{
    path = ($relativePath -replace "\\", "/")
    sha256 = (Get-FileHash -Path $absolutePath -Algorithm SHA256).Hash
  }
}

$manifest = [ordered]@{
  project = "AION"
  signaturePurpose = "Project integrity and origin verification"
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
    privateKeyLocation = "Windows CurrentUser certificate store (not stored in repository)"
  }
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

Write-Host "AION project signature refreshed."
Write-Host "Manifest : $manifestPath"
Write-Host "Signature: $signaturePath"
Write-Host "Cert     : $certificateCerPath"

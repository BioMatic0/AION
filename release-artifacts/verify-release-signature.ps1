[CmdletBinding()]
param(
  [string]$RepositoryRoot
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

if (-not $RepositoryRoot) {
  $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
  $RepositoryRoot = (Resolve-Path (Join-Path $scriptRoot "..")).Path
}

$manifestPath = Join-Path $RepositoryRoot "release-artifacts\AION-RELEASE-SIGNATURE-MANIFEST-0.1.1.json"
$signaturePath = Join-Path $RepositoryRoot "release-artifacts\AION-RELEASE-SIGNATURE-0.1.1.p7s"
$certificatePath = Join-Path $RepositoryRoot "signatures\AION-SIGNING-CERT.cer"

foreach ($requiredPath in @($manifestPath, $signaturePath, $certificatePath)) {
  if (-not (Test-Path $requiredPath)) {
    throw "Required release-signature file not found: $requiredPath"
  }
}

$manifestBytes = [System.IO.File]::ReadAllBytes($manifestPath)
$signatureBytes = [System.IO.File]::ReadAllBytes($signaturePath)
$contentInfo = New-Object System.Security.Cryptography.Pkcs.ContentInfo -ArgumentList (, $manifestBytes)
$signedCms = New-Object System.Security.Cryptography.Pkcs.SignedCms -ArgumentList $contentInfo, $true
$signedCms.Decode($signatureBytes)
$signedCms.CheckSignature($true)

$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certificatePath)
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$signerCertificate = $signedCms.SignerInfos[0].Certificate

if ($null -eq $signerCertificate) {
  throw "No signer certificate present in detached release signature."
}

if ($signerCertificate.Thumbprint -ne $certificate.Thumbprint) {
  throw "Release signature thumbprint does not match the exported public certificate."
}

$mismatches = @()
foreach ($fileEntry in $manifest.signedFiles) {
  $absolutePath = Join-Path $RepositoryRoot ($fileEntry.path -replace "/", "\")

  if (-not (Test-Path $absolutePath)) {
    $mismatches += "Missing file: $($fileEntry.path)"
    continue
  }

  $actualHash = (Get-FileHash -Path $absolutePath -Algorithm SHA256).Hash
  if ($actualHash -ne $fileEntry.sha256) {
    $mismatches += "Hash mismatch: $($fileEntry.path)"
  }
}

if ($mismatches.Count -gt 0) {
  $mismatches | ForEach-Object { Write-Error $_ }
  throw "Release signature verification failed."
}

Write-Host "AION release signature verified successfully."
Write-Host "Signer thumbprint: $($certificate.Thumbprint)"
Write-Host "Signed release files: $($manifest.signedFiles.Count)"

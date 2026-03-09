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

$manifestPath = Join-Path $RepositoryRoot "signatures\AION-SIGNATURE-MANIFEST.json"
$signaturePath = Join-Path $RepositoryRoot "signatures\AION-SIGNATURE.p7s"
$certificatePath = Join-Path $RepositoryRoot "signatures\AION-SIGNING-CERT.cer"

foreach ($requiredPath in @($manifestPath, $signaturePath, $certificatePath)) {
  if (-not (Test-Path $requiredPath)) {
    throw "Required signature file not found: $requiredPath"
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

if ($signedCms.SignerInfos.Count -lt 1) {
  throw "No signer information present in detached signature."
}

$signerCertificate = $signedCms.SignerInfos[0].Certificate
if ($null -eq $signerCertificate) {
  throw "No signer certificate present in detached signature."
}

if ($signerCertificate.Thumbprint -ne $certificate.Thumbprint) {
  throw "Signer thumbprint does not match the exported public certificate."
}

$mismatches = @()
foreach ($fileEntry in $manifest.signedFiles) {
  $relativePath = $fileEntry.path
  $absolutePath = Join-Path $RepositoryRoot ($relativePath -replace "/", "\")

  if (-not (Test-Path $absolutePath)) {
    $mismatches += "Missing file: $relativePath"
    continue
  }

  $actualHash = (Get-FileHash -Path $absolutePath -Algorithm SHA256).Hash
  if ($actualHash -ne $fileEntry.sha256) {
    $mismatches += "Hash mismatch: $relativePath"
  }
}

if ($mismatches.Count -gt 0) {
  $mismatches | ForEach-Object { Write-Error $_ }
  throw "Project signature verification failed."
}

Write-Host "AION project signature verified successfully."
Write-Host "Signer thumbprint: $($certificate.Thumbprint)"
Write-Host "Signed files: $($manifest.signedFiles.Count)"

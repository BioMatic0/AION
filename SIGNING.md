# AION Digital Signature

AION includes a repository-level digital signature for project integrity and
origin verification.

## What is signed

The detached signature currently covers the manifest in:

- `signatures/AION-SIGNATURE-MANIFEST.json`

That manifest records SHA256 hashes for the core project identity and release
files listed inside it, including legal and reference documents and the current
release checksum file.

## Public signature material

These files are stored in the repository:

- `signatures/AION-SIGNATURE-MANIFEST.json`
- `signatures/AION-SIGNATURE.p7s`
- `signatures/AION-SIGNING-CERT.cer`
- `signatures/AION-SIGNING-CERT.pem`
- `signatures/verify-signature.ps1`

## Private signing key

The private signing key is not stored in the repository.

It is held in the Windows certificate store of the signing user and is used to
generate the detached PKCS#7 signature. That means the repository contains
verification material, not the private key itself.

## Verification

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\signatures\verify-signature.ps1
```

## Refreshing the signature

To regenerate the manifest and signature:

```powershell
powershell -ExecutionPolicy Bypass -File .\infrastructure\scripts\refresh-project-signature.ps1
```

## Important scope note

This is a project-level cryptographic signature.

It is not the same thing as a publicly trusted Windows code-signing certificate
for installers and executables. A trusted Authenticode signature for Windows
distribution would still require a dedicated code-signing certificate and
separate signing of the shipped binaries.

# Public Code Publishing Guide

This project is prepared for public release and mirrored publishing.

## Recommended primary hosts

- GitHub
- GitLab
- Codeberg

## Additional mirrors

- SourceHut
- Bitbucket
- SourceForge

## Suggested order

1. Publish the canonical repo on GitHub or GitLab.
2. Mirror to Codeberg.
3. Mirror to additional platforms if needed.

## Required files already prepared

- `LICENSE`
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `.github/workflows/ci.yml`

## Local repository setup

Initialize:

```powershell
"C:\Program Files\Git\bin\git.exe" init -b main
"C:\Program Files\Git\bin\git.exe" config user.name "Patrick Wirth"
"C:\Program Files\Git\bin\git.exe" config user.email "patrickwirth_93@icloud.com"
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Initial public release"
```

## GitHub

```powershell
"C:\Program Files\Git\bin\git.exe" remote add origin <github-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u origin main
```

## GitLab

```powershell
"C:\Program Files\Git\bin\git.exe" remote add gitlab <gitlab-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u gitlab main
```

## Codeberg

```powershell
"C:\Program Files\Git\bin\git.exe" remote add codeberg <codeberg-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u codeberg main
```

## SourceHut

```powershell
"C:\Program Files\Git\bin\git.exe" remote add sourcehut <sourcehut-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u sourcehut main
```

## Bitbucket

```powershell
"C:\Program Files\Git\bin\git.exe" remote add bitbucket <bitbucket-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u bitbucket main
```

## SourceForge

```powershell
"C:\Program Files\Git\bin\git.exe" remote add sourceforge <sourceforge-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u sourceforge main
```

## Important limitation

Creating accounts, completing email verification and accepting platform terms
must be done through the owner of those accounts.

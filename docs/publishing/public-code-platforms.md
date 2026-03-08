# Public Code Publishing Guide

This project is prepared for public release and mirrored publishing.

## Current canonical source

- GitHub repository: `https://github.com/BioMatic0/AION`
- Latest release: `https://github.com/BioMatic0/AION/releases/latest`

## Recommended primary hosts

- GitHub
- GitLab
- Codeberg

## Additional mirrors

- SourceHut
- Bitbucket
- SourceForge

## Suggested order

1. Keep GitHub as the canonical public source.
2. Mirror to GitLab and Codeberg.
3. Mirror to additional platforms when the repository URLs and access tokens exist.

## Required files already prepared

- `LICENSE`
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `.github/workflows/ci.yml`

## Fastest local mirror workflow

Use the prepared PowerShell helper:

```powershell
.\infrastructure\scripts\publish-mirrors.ps1 `
  -GitLabUrl "<gitlab-repo-url>" `
  -CodebergUrl "<codeberg-repo-url>" `
  -PushAll
```

The script can also register SourceHut, Bitbucket and SourceForge remotes.

## Manual mirror setup

### GitHub

```powershell
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/BioMatic0/AION.git
"C:\Program Files\Git\bin\git.exe" push -u origin main
```

### GitLab

```powershell
"C:\Program Files\Git\bin\git.exe" remote add gitlab <gitlab-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u gitlab main
```

### Codeberg

```powershell
"C:\Program Files\Git\bin\git.exe" remote add codeberg <codeberg-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u codeberg main
```

### SourceHut

```powershell
"C:\Program Files\Git\bin\git.exe" remote add sourcehut <sourcehut-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u sourcehut main
```

### Bitbucket

```powershell
"C:\Program Files\Git\bin\git.exe" remote add bitbucket <bitbucket-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u bitbucket main
```

### SourceForge

```powershell
"C:\Program Files\Git\bin\git.exe" remote add sourceforge <sourceforge-repo-url>
"C:\Program Files\Git\bin\git.exe" push -u sourceforge main
```

## Important limitation

Creating accounts, completing email verification, accepting platform terms and
granting access tokens must be done through the owner of those accounts.

param(
  [string]$GitLabUrl,
  [string]$CodebergUrl,
  [string]$SourceHutUrl,
  [string]$BitbucketUrl,
  [string]$SourceForgeUrl,
  [switch]$PushAll
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$git = "C:\Program Files\Git\bin\git.exe"

if (-not (Test-Path $git)) {
  throw "Git was not found at $git"
}

$remoteMap = [ordered]@{
  gitlab = $GitLabUrl
  codeberg = $CodebergUrl
  sourcehut = $SourceHutUrl
  bitbucket = $BitbucketUrl
  sourceforge = $SourceForgeUrl
}

function Set-Remote {
  param(
    [string]$Name,
    [string]$Url
  )

  if ([string]::IsNullOrWhiteSpace($Url)) {
    return
  }

  $existing = & $git -C $repoRoot remote
  if ($existing -contains $Name) {
    & $git -C $repoRoot remote set-url $Name $Url
  } else {
    & $git -C $repoRoot remote add $Name $Url
  }
}

function Push-Remote {
  param(
    [string]$Name
  )

  Write-Host "Pushing main to $Name..." -ForegroundColor Cyan
  & $git -C $repoRoot push -u $Name main
}

Write-Host "Canonical GitHub repository: https://github.com/BioMatic0/AION" -ForegroundColor Green
Write-Host "Latest release: https://github.com/BioMatic0/AION/releases/latest" -ForegroundColor Green

foreach ($entry in $remoteMap.GetEnumerator()) {
  Set-Remote -Name $entry.Key -Url $entry.Value
}

Write-Host ""
Write-Host "Configured remotes:" -ForegroundColor Yellow
& $git -C $repoRoot remote -v

if ($PushAll) {
  foreach ($entry in $remoteMap.GetEnumerator()) {
    if (-not [string]::IsNullOrWhiteSpace($entry.Value)) {
      Push-Remote -Name $entry.Key
    }
  }
} else {
  Write-Host ""
  Write-Host "No mirror push executed. Use -PushAll after the remote URLs are set and authenticated." -ForegroundColor Yellow
}

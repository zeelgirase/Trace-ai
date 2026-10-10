$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Test-Path 'package.json')) { throw 'package.json not found. Run this script from the frontend folder.' }
if (-not (Test-Path 'node_modules')) { npm install }
npm run dev

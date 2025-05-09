@echo off
cd /d %~dp0

echo Menambahkan perubahan...
git add .

echo Membuat commit...
git commit -m "New Update Cache"

echo Menarik update dari GitHub...
git pull origin main

echo Mendorong perubahan ke GitHub...
git push origin main

pause

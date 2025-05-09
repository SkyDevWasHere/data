@echo off
:menu
cls
echo ================================
echo        GIT TOOLS by SkyDev
echo ================================
echo [1] Push ke GitHub
echo [2] Keluar
echo ================================
set /p pilihan=Masukkan pilihanmu [1/2]:

if "%pilihan%"=="1" goto push
if "%pilihan%"=="2" exit
goto menu

:push
cls
echo Menambahkan semua perubahan...
git add .

echo Membuat commit otomatis...
git commit -m "New Update Cache"

echo Menarik perubahan dari GitHub...
git pull origin main

echo Mendorong ke GitHub...
git push origin main

echo.
echo ✅ Push selesai! Tekan ENTER untuk kembali ke menu.
pause > nul
goto menu

@echo off
chcp 65001 >nul
cd /d "%~dp0"
:menu
cls
echo ============== AGENT KORE ==============
echo  1. Audit (lecture seule)
echo  2. Review produits (simulation)
echo  3. Review SEO (simulation)
echo  4. Review pages (simulation)
echo  5. Review collections (simulation)
echo  6. Analyser le theme (plan, lecture seule)
echo  ---------------------------------------
echo  7. APPLIQUER review produits
echo  8. APPLIQUER review SEO
echo  0. Quitter
echo =======================================
set /p choix="Ton choix (un chiffre) puis Entree : "
if "%choix%"=="1" node index.js audit
if "%choix%"=="2" node index.js review-products
if "%choix%"=="3" node index.js review-seo
if "%choix%"=="4" node index.js review-pages
if "%choix%"=="5" node index.js review-collections
if "%choix%"=="6" node index.js analyze-theme
if "%choix%"=="7" node index.js review-products --apply
if "%choix%"=="8" node index.js review-seo --apply
if "%choix%"=="0" exit
echo.
pause
goto menu

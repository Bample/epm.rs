@echo off
echo.
:: 别喷文件布局了，随便搞的。
cd /d "%~dp0"
if "%1"=="install" goto :install
if "%1"=="check" goto :eslint_check
if "%1"=="build" goto :build
if "%1"=="test" goto :test
exit /b

:install
cd /d .\src
CHOICE /C ycn /N /M "使用yarn请按y，使用cnpm请按c，使用npm请按n: "
set uChoice1=%errorlevel%
echo %uChoice1%
if "%uChoice1%"=="1" call yarn 
if "%uChoice1%"=="2" call cnpm install
if "%uChoice1%"=="3" call npm install
CHOICE /C YN /N /M "是否全局安装eslint: "
set uChoice2=%errorlevel%
if %uChoice2%=="2" cd .. && exit /b
CHOICE /C cn /N /M "使用cnpm请按c，使用npm请按n: "
set uChoice3=%errorlevel%
if "%uChoice3%"=="1" call cnpm i -g eslint
if "%uChoice3%"=="2" call npm i -g eslint
cd ..
exit /b 0

:eslint_check

cd /d .\src
call eslint .
cd ..
exit /b

:build
::set buildPath=%~dp0src\
exit /b

:test
::call :build
::call node %buildPath%
exit /b
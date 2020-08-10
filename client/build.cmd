@echo off
echo.
:: �����ļ������ˣ�����ġ�
cd /d "%~dp0"
if "%1"=="install" goto :install
if "%1"=="check" goto :eslint_check
if "%1"=="build" goto :build
if "%1"=="test" goto :test
exit /b

:install
cd /d .\src
CHOICE /C ycn /N /M "ʹ��yarn�밴y��ʹ��cnpm�밴c��ʹ��npm�밴n: "
set uChoice1=%errorlevel%
echo %uChoice1%
if "%uChoice1%"=="1" call yarn 
if "%uChoice1%"=="2" call cnpm install
if "%uChoice1%"=="3" call npm install
CHOICE /C YN /N /M "�Ƿ�ȫ�ְ�װeslint: "
set uChoice2=%errorlevel%
if %uChoice2%=="2" cd .. && exit /b
CHOICE /C cn /N /M "ʹ��cnpm�밴c��ʹ��npm�밴n: "
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
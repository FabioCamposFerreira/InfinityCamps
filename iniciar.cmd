@echo off
setlocal
cd /d "%~dp0"

rem Prepara o banco local e inicia a API (http://localhost:8787) e o site (http://localhost:3000).

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node.js 20 ou superior e tente novamente.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando as dependencias da raiz...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar as dependencias da raiz.
    pause
    exit /b 1
  )
)

if not exist "workers\node_modules" (
  echo Instalando as dependencias do Worker...
  call npm install --prefix workers
  if errorlevel 1 (
    echo Falha ao instalar as dependencias do Worker.
    pause
    exit /b 1
  )
)

if not exist "workers\.dev.vars" (
  echo Criando workers\.dev.vars a partir do exemplo...
  copy /y "workers\.dev.vars.example" "workers\.dev.vars" >nul
  if errorlevel 1 (
    echo Falha ao criar workers\.dev.vars.
    pause
    exit /b 1
  )
  echo Revise os valores em workers\.dev.vars antes de usar contas reais.
)

call npm run dev
set "exit_code=%errorlevel%"
if not "%exit_code%"=="0" (
  echo.
  echo O InfinityCamps encerrou com erro ^(codigo %exit_code%^).
  pause
)

endlocal & exit /b %exit_code%

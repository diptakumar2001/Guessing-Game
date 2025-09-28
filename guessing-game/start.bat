@echo off
echo  Checking for Python + pip...

REM Make sure pip is up to date
python -m pip install --upgrade pip

echo  Installing Python dependencies...
cd backend
python -m pip install -r requirements.txt

echo  Starting Flask server...
start cmd /k "python app.py"

cd ..\frontend
timeout /t 2 >nul
echo  Opening login screen...
start "" "login.html"
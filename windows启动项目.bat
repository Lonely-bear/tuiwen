start cmd /k "cd tuiwen-node && node websocket.js"
timeout /t 1 /nobreak >nul
start cmd /k "cd web && node web.js"
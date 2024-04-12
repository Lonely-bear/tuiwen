#!/bin/bash
node tuiwen-node/websocket.js &
sleep 1
node web/web.js &
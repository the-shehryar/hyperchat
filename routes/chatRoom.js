const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const server = http.createServer(express)
const port = 7000
const SocketServer = new WebSocket.Server({server : server,})


// SocketServer.on('connection' , (socket) => {
//     socket.on('')
// })
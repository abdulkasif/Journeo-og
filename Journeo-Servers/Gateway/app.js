const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/api/express", createProxyMiddleware({target: 'http://Express-Server:6001', changeOrigin: true}));
app.use("/api/flask" , createProxyMiddleware({target: 'http://Flask-Server:6002', changeOrigin: true}));

module.exports = app;
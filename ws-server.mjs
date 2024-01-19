import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";

const server = createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log("connection");
  ws.on("error", console.error);
  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

server.listen(3001, "0.0.0.0");

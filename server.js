const WebSocket = require("ws");

const PORT = process.env.PORT || 8080; // Usar el puerto asignado por Heroku o 8080 para pruebas locales
const server = new WebSocket.Server({ port: PORT });

server.on("connection", (ws) => {
  console.log("Nuevo cliente conectado");

  ws.on("message", (message) => {
    console.log("Mensaje recibido:", message);

    // Retransmitir el mensaje a todos los clientes conectados
    server.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);

const WebSocket = require('ws'); // Importar la librería WebSocket

// Crear el servidor WebSocket en el puerto 10000
const wss = new WebSocket.Server({ port: 10000 }, () => {
  console.log('Servidor WebSocket escuchando en el puerto 10000');
});

// Variables para guardar los clientes
let lilygoClient = null;
let webClient = null;

// Enviar "ping" a todos los clientes cada 30 segundos para evitar hibernación
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('ping');
    }
  });
}, 30000);

// Manejar nuevas conexiones
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  // Manejar mensajes recibidos de los clientes
  ws.on('message', (message) => {
    const trimmedMessage = message.toString().trim();
    console.log(`Mensaje recibido: ${trimmedMessage}`);

    // Identificar el cliente al conectarse
    if (trimmedMessage === 'IDENTIFY:LILYGO') {
      lilygoClient = ws;
      console.log('Cliente identificado como LILYGO');
      ws.send('Identificación exitosa: LILYGO');
      return;
    } else if (trimmedMessage === 'IDENTIFY:WEB') {
      webClient = ws;
      console.log('Cliente identificado como Página Web');
      ws.send('Identificación exitosa: Página Web');
      return;
    }

    // Procesar comandos
    if (trimmedMessage === 'LED_ON' || trimmedMessage === 'LED_OFF') {
      console.log(`Comando recibido: ${trimmedMessage}`);
      
      // Reenviar comandos de la página web a la placa LILYGO
      if (webClient === ws && lilygoClient) {
        lilygoClient.send(trimmedMessage);
        ws.send(`Comando reenviado a LILYGO: ${trimmedMessage}`);
      }
    } else {
      console.log('Comando desconocido');
      ws.send('Comando no reconocido');
    }
  });

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    if (lilygoClient === ws) {
      console.log('LILYGO desconectado');
      lilygoClient = null;
    } else if (webClient === ws) {
      console.log('Página Web desconectada');
      webClient = null;
    } else {
      console.log('Cliente desconocido desconectado');
    }
  });
});

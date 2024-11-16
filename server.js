const WebSocket = require('ws'); // Importar la librería WebSocket

// Crear el servidor WebSocket en el puerto 10000
const wss = new WebSocket.Server({ port: 10000 }, () => {
  console.log('Servidor WebSocket escuchando en el puerto 10000');
});

// Variables para guardar los clientes
let webClient = null;
let lilygoClient = null;

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

    // Identificar clientes
    if (trimmedMessage === 'IDENTIFY:WEB') {
      webClient = ws;
      console.log('Cliente identificado como Página Web');
      ws.send('Identificación exitosa: Página Web');
      return;
    } else if (trimmedMessage === 'IDENTIFY:LILYGO') {
      lilygoClient = ws;
      console.log('Cliente identificado como LILYGO');
      ws.send('Identificación exitosa: LILYGO');
      return;
    }

    // Procesar comandos desde la página web
    if (webClient === ws) {
      if (trimmedMessage === 'LED_ON' || trimmedMessage === 'LED_OFF') {
        console.log(`Comando recibido: ${trimmedMessage}`);
        
        // Reenviar comando a LILYGO
        if (lilygoClient && lilygoClient.readyState === WebSocket.OPEN) {
          lilygoClient.send(trimmedMessage);
          ws.send(`Comando reenviado a LILYGO: ${trimmedMessage}`);
        } else {
          ws.send('Error: LILYGO no está conectado');
        }
      } else {
        ws.send('Comando no reconocido por la Página Web');
      }
    }
  });

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    if (webClient === ws) {
      console.log('Página Web desconectada');
      webClient = null;
    } else if (lilygoClient === ws) {
      console.log('LILYGO desconectado');
      lilygoClient = null;
    } else {
      console.log('Cliente desconocido desconectado');
    }
  });
});

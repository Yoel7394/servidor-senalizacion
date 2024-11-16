const WebSocket = require('ws'); // Importar la librería WebSocket

// Crear el servidor WebSocket en el puerto 10000
const wss = new WebSocket.Server({ port: 10000 }, () => {
  console.log('Servidor WebSocket escuchando en el puerto 10000');
});

// Manejar nuevas conexiones
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  // Manejar mensajes recibidos de los clientes
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);

    // Procesar el mensaje y realizar acciones
    if (message === 'LED_ON') {
      console.log('Comando recibido: Encender LED');
      // Aquí puedes realizar otras acciones si es necesario

      // Responder al cliente
      ws.send('LED está encendido');
    } else if (message === 'LED_OFF') {
      console.log('Comando recibido: Apagar LED');
      // Aquí puedes realizar otras acciones si es necesario

      // Responder al cliente
      ws.send('LED está apagado');
    } else {
      console.log('Comando desconocido');
      ws.send('Comando no reconocido');
    }
  });

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});


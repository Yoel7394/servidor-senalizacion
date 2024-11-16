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
    const trimmedMessage = message.trim(); // Elimina espacios o caracteres adicionales
    console.log(`Mensaje recibido: ${trimmedMessage}`);

    // Procesar el mensaje y realizar acciones
    if (trimmedMessage === 'LED_ON') {
      console.log('Comando recibido: Encender LED');
      ws.send('LED está encendido');
    } else if (trimmedMessage === 'LED_OFF') {
      console.log('Comando recibido: Apagar LED');
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

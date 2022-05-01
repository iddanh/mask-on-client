let socket;

const connect = (callback) => {
  socket = new WebSocket('ws://localhost:8080');

  // Listen for messages
  socket.addEventListener('message', (event) => {
    event.data.text().then(callback);
  });
}

const send = (data) => {
  socket.send(data);
}

export default {
  connect,
  send
};

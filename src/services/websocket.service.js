let socket;

const connect = (callback) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  socket = new WebSocket(params.server || 'ws://localhost:8080');

  // Listen for messages
  socket.addEventListener('message', (event) => {
    event.data.text().then(callback);
  });
}

const send = (data) => {
  socket.send(data);
}

const exports = {
  connect,
  send
};

export default exports;

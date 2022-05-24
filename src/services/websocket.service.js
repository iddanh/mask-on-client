let socket;

const connect = (connectCallback, receiveCallback) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  socket = new WebSocket(params.server || 'wss://maskon.cs.colman.ac.il:10151/');

  // Listen for connection
  socket.addEventListener('open', () => {
    if (socket.readyState === 1) {
      connectCallback()
    }
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    receiveCallback(event.data);
  });
}

const send = (data) => {
  try {
    socket.send(data);
  } catch (error) {
    console.log('Error sending message', error);
  }
}

const exports = {
  connect,
  send
};

export default exports;

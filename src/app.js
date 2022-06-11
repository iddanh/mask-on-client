import React from 'react';
import socketService from './services/websocket.service';
import canvasService from './services/canvas.service';
import Loader from './components/loader/loader.component';
import Table from './components/table/table.component';
import title from './title.png';

import './app.scss';

function App() {
  const videoRef = React.useRef();
  const captureCanvasRef = React.useRef();
  const receiveCanvasRef = React.useRef();
  const [active, setActive] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [videoHeight, setVideoHeight] = React.useState(null);
  const [meta, setMeta] = React.useState([0, 0, 0]);
  const [thresh, setThresh] = React.useState(50);
  const [ratio, setRatio] = React.useState(null);

  const sendFrameToServer = React.useCallback(() => {
    if (!videoHeight) {
      setVideoHeight(videoRef.current.videoHeight / (videoRef.current.videoWidth / canvasService.VIDEO_WIDTH))
    }

    const frame = canvasService.takePicture(videoRef, captureCanvasRef);
    if (frame.length > 6) {
      socketService.send(frame);
    } else {
      setTimeout(sendFrameToServer, 10);
    }
  }, [videoHeight]);

  React.useEffect(() => {
    if (!active) {
      return;
    }

    socketService.connect(sendFrameToServer, (data) => {
      setIsConnecting(false);

      const splitted = data.split('|');
      const frame = splitted[0].substring(2, splitted[0].length - 1);
      setMeta(JSON.parse(splitted[1]));

      canvasService.drawFrame(videoRef, receiveCanvasRef, frame);
      sendFrameToServer();
    });

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", frameRate: { ideal: 15 } }, audio: false })
      .then(function (stream) {
        const video = videoRef.current;

        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("Error connecting to camera stream: " + err);
      });
  }, [active]);

  const connect = () => {
    setActive(true);
    setIsConnecting(true);
  };

  return (
    <div className={'main-container' + ((ratio !== null && ratio < thresh) ? ' alert' : '')}>
      <div className="header">
        <img src={title} alt="MaskON" />
        <Table meta={meta} onRatioChange={setRatio} />
      </div>

      <div className="camera-container">
        <canvas
          className="camera"
          ref={receiveCanvasRef}
          width={canvasService.VIDEO_WIDTH}
          height={videoHeight}
        >
        </canvas>
        {!active && <button onClick={connect}>Connect</button>}
        {isConnecting && <Loader />}
      </div>

      <div style={{ display: 'none' }}>
        <video ref={videoRef} style={{ width: canvasService.VIDEO_WIDTH }}>Video stream not available.</video>
        <canvas ref={captureCanvasRef} />
      </div>

      <div className="footer">
        <div>Alert threshold: {thresh}%</div>
        <input type="range" value={thresh} onChange={(event) => setThresh(event.target.value)} />
        <div className="labels">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

export default App;

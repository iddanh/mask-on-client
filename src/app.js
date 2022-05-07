import React from 'react';
import socketService from './services/websocket.service';
import canvasService from './services/canvas.service';

import './app.css';

function App() {
  const videoRef = React.useRef();
  const captureCanvasRef = React.useRef();
  const receiveCanvasRef = React.useRef();
  const [videoHeight, setVideoHeight] = React.useState(null);

  const sendFrameToServer = React.useCallback(() => {
    if (!videoHeight) {
      setVideoHeight(videoRef.current.videoHeight / (videoRef.current.videoWidth / canvasService.VIDEO_WIDTH))
    }

    socketService.send(canvasService.takePicture(videoRef, captureCanvasRef));
  }, [videoHeight]);

  React.useEffect(() => {
    socketService.connect(sendFrameToServer, (frame) => {
      canvasService.drawFrame(videoRef, receiveCanvasRef, frame);
      sendFrameToServer();
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        const video = videoRef.current;

        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("Error connecting to camera stream: " + err);
      });
  }, []);

  return (
    <div className="main-container">
      <div className="header">
        <h1>MaskOn</h1>
        <table>
          <tbody>
          <tr>
            <td>Detected faces:</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Correctly masked:</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Incorrectly masked:</td>
            <td>0</td>
          </tr>
          <tr>
            <td>No Mask:</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ratio:</td>
            <td>0%</td>
          </tr>
          </tbody>
        </table>
      </div>

      <canvas
        className="camera"
        ref={receiveCanvasRef}
        width={canvasService.VIDEO_WIDTH}
        height={videoHeight}
      />

      <div style={{ display: 'none' }}>
        <video ref={videoRef} style={{ width: canvasService.VIDEO_WIDTH }}>Video stream not available.</video>
        <canvas ref={captureCanvasRef} />
      </div>

      <div className="footer">
        <div>Alert threshold:</div>
        <input type="range" />
        <div className="labels">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import './app.css';
import socketService from './websocket.service';

const VIDEO_WIDTH = 480;

function App() {
  const videoRef = React.useRef();
  const captureCanvasRef = React.useRef();
  const receiveCanvasRef = React.useRef();
  const [videoHeight, setVideoHeight] = React.useState(null);

  const sendFrameToServer = () => {
    socketService.send(takePicture());
    videoRef.current.requestVideoFrameCallback(sendFrameToServer);
  }

  React.useEffect(() => {
    socketService.connect((frame) => {
      const canvas = receiveCanvasRef.current;
      const video = videoRef.current;

      const width = VIDEO_WIDTH;
      const height = video.videoHeight / (video.videoWidth / width);
      const context = canvas.getContext('2d')

      const img = new Image;
      img.onload = function () {
        context.drawImage(img, 0, 0, width, height);
      };
      img.src = frame;
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        videoRef.current.requestVideoFrameCallback(sendFrameToServer);
      })
      .catch(function (err) {
        console.log("Error connecting to camera stream: " + err);
      });
  }, []);

  function takePicture() {
    const canvas = captureCanvasRef.current;
    const video = videoRef.current;

    const width = VIDEO_WIDTH;
    const height = video.videoHeight / (video.videoWidth / width);
    if (!videoHeight) {
      setVideoHeight(height);
    }

    const context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);

    return canvas.toDataURL('image/png');
  }

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
        width={VIDEO_WIDTH}
        height={videoHeight}
      />

      <div style={{ display: 'none' }}>
        <video ref={videoRef} style={{ width: VIDEO_WIDTH }}>Video stream not available.</video>
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

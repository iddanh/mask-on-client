import React from 'react';
import './app.css';

const VIDEO_WIDTH = 480;

function App() {
  const videoRef = React.useRef();
  const canvasRef = React.useRef();
  const imgRef = React.useRef();
  const [imgData, setImgData] = React.useState(null);

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(function (err) {
        console.log("Error connecting to camera stream: " + err);
      });
  });

  function takePicture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const width = VIDEO_WIDTH;
    const height = video.videoHeight / (video.videoWidth / width);

    const context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);

    setImgData(canvas.toDataURL('image/png'));
  }

  return (
    <div className="main-container">
      <div className="header">
        <h1>MaskOn</h1>
        <table>
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
        </table>
      </div>

      <div className="camera">
        <video ref={videoRef} style={{ width: VIDEO_WIDTH }}>Video stream not available.</video>
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

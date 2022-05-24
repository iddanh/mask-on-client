const VIDEO_WIDTH = 480;

const takePicture = (videoRef, captureCanvasRef) => {
  const video = videoRef.current;
  const canvas = captureCanvasRef.current;

  const width = VIDEO_WIDTH;
  const height = video.videoHeight / (video.videoWidth / width);

  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  context.drawImage(videoRef.current, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg');
}

const drawFrame = (videoRef, receiveCanvasRef, frame) => {
  const canvas = receiveCanvasRef.current;
  const video = videoRef.current;

  const width = VIDEO_WIDTH;
  const height = video.videoHeight / (video.videoWidth / width);
  const context = canvas.getContext('2d')

  const img = new Image();
  img.onload = function () {
    context.drawImage(img, 0, 0, width, height);
  };
  img.src = `data:image/jpeg;base64,${frame}`;
}

const exports = {
  VIDEO_WIDTH,
  takePicture,
  drawFrame
};

export default exports;

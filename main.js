const video = document.querySelector('video');
const resultValue = document.querySelector('.result-value');

const button = document.querySelector('button');
button.addEventListener('click', async () => {
  await runStream();
  video.play();
});

async function runStream() {
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  video.addEventListener('loadeddata', async () => {
    const model = await window.cocoSsd.load();
    detect(model);
  });
}

async function detect(model) {
  window.requestAnimationFrame(() => detect(model));

  const predictions = await model.detect(video);
  const bestPrediction = predictions
    .filter(i => i.score && i.class)
    .reduce((acc, cur) => (acc?.score > cur.score ? acc : cur), null);

  if (!bestPrediction || bestPrediction.score < 0.66) {
    resultValue.textContent = 'N/A';
  }

  resultValue.textContent = bestPrediction.class;
}

const clamp = require('clamp')

export function freq2index (freq, sampleRate, fftSize) {
  return clamp(Math.floor(freq / (sampleRate / fftSize)), 0, fftSize / 2)
}

function getAverageFrom (freqs, minHz, maxHz, sampleRate, fftSize) {
  let start = freq2index(minHz, sampleRate, fftSize)
  let end = freq2index(maxHz, sampleRate, fftSize)
  const count = end - start
  let sum = 0
  for (; start < end; start++) {
    sum += freqs[start] / 255
  }
  return count === 0 ? 0 : (sum / count)
}

export function frequencyAverages (sampleRate, fftSize) {
  return function getAverage (freqs, minHz, maxHz) {
    return getAverageFrom(freqs, minHz, maxHz, sampleRate, fftSize)
  }
}

# audio-frequency-to-index

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Convert a Hz frequency to an index for WebAudio frequency analysis. Also see [audio-index-to-frequency](https://www.npmjs.com/package/audio-index-to-frequency).

The value is clamped between `[ 0 .. frequencyBinCount ]`. The `frequencyBinCount` is the same as `ananlyserNode.fftSize / 2`. 

```js
const freq2index = require('audio-frequency-to-index')
const sampleRate = audioContext.sampleRate // 44100
const length = analyserNode.frequencyBinCount // 1024

const index = freq2index(400, sampleRate, length)
//=> 19
```

## Usage

[![NPM](https://nodei.co/npm/audio-frequency-to-index.png)](https://www.npmjs.com/package/audio-frequency-to-index)

#### `index = frequencyToIndex(frequency, sampleRate, frequencyBinCount)`

Converts `frequency` (in Hz) to an `index` integer using the `audioContext.sampleRate` and `analyserNode.frequencyBinCount` from the Web Audio API.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/audio-frequency-to-index/blob/master/LICENSE.md) for details.

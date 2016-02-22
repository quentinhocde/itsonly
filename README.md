# It's Only
A little wegbl(threejs) experiment with audio. 

With the 2.0 version, you can add a soundcloud URL to launch your own sounds, or just play the demo "it's only"

I decided to use 4 averages of frequencies range :

- Bass/Drum : 40 to 200Hz
- MidBass : 200 to 600Hz
- Voices : 600 to 2000Hz
- Cymbals : 2000 to 16000Hz

### Demo

https://itsonly.herokuapp.com/

### Installation

```
$ npm i 
```

### Start
```
$ gulp
```
And go to : localhost:3000 

### Packages useds

- soundbloud-badge by hughsk (https://github.com/hughsk/soundcloud-badge) 
- web-audio-analyser by hughsk (https://www.npmjs.com/package/web-audio-analyser)
- analyser-frequency-average by jam3 (https://github.com/Jam3/analyser-frequency-average)

### Version
2.0.0

export function initAudio(audio_element:any) : any{
  // @ts-ignore -- not going to hand hold typescript right now
  var audioCtx:any = new (window.AudioContext || window.webkitAudioContext)();
  var source = audioCtx.createMediaElementSource(audio_element);
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  // Create a gain node
  var gainNode = audioCtx.createGain();
  gainNode.gain.value = 1.0;

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.connect(analyser);
  return { audioCtx: audioCtx, analyser: analyser };
}

export function assessBandVolumes(frequency_profile: Uint8Array) {
  const DIVISIONS = 114;
  var len = frequency_profile.length; // add in a manual frequency cuttoff since certain ranges are empty
  var max_bands = Math.ceil(len / DIVISIONS);
  var bands = new Array(max_bands).fill(0);
  var empty_point = 0;
  for (var fq = 0; fq < len; fq++) {
    bands[Math.floor(fq / DIVISIONS)] += frequency_profile[fq];
  }
  for (var band_no = 0; band_no < max_bands; band_no++) {
    // average of each band then normalized
    bands[band_no] = bands[band_no] / DIVISIONS / 256;
  }
  document.getElementById("message-container").innerHTML = `
  0 - ${bands[0]}<br/>
  1 - ${bands[1]}<br/>
  2 - ${bands[2]}<br/>
  3 - ${bands[3]}<br/>
  4 - ${bands[4]}<br/>
  5 - ${bands[5]}<br/>
  6 - ${bands[6]}<br/>
  7 - ${bands[7]}<br/>
  8 - ${bands[8]}<br/>
  ${bands.reduce(function(a, b){ return a+b })}<br/>
  `;
  return bands;
}
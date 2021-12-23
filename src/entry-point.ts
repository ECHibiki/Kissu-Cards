import shaderVert from './glsl/test.glsl'

export function helloWorld(){
  console.log("-_active_-");
}

export function clearScreen(gl:WebGL2RenderingContext){
  gl.clearColor(0.75, 0.75, 0.75, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// very simple construction function. Around only because all the current cards are identical in function and customizable with a few variables
export function buildCard(image_src:string, particle_src:string, width:number, height:number , audio_band:number){

}
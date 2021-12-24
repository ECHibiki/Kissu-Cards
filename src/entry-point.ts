import ImmobileVShader from './glsl/ImmobileVShader.vs'
import ParticleVShader from './glsl/ParticleVShader.vs'
import BloomFShader from './glsl/BloomFShader.fs'
import PostBloomFShader from './glsl/PostBloomFShader.fs'
import TextureFShader from './glsl/TextureFShader.fs'

import * as glm from "gl-matrix"
import * as shaders from "./shaders"
import * as buffers from "./buffers"
import * as textures from "./textures"
import * as emitters from "./particle-emitters"
import * as audio from "./audio-analysis"
import * as text from "./text-processor"
import * as cardbuilder from "./card-builder"

var gl:WebGL2RenderingContext;

export var immobile_v_shader = ImmobileVShader;
export var bloom_f_shader = BloomFShader;
export var post_bloom_f_shader = PostBloomFShader;
export var particle_v_shader = ParticleVShader;
export var texture_f_shader = TextureFShader;

export function helloWorld(){
  console.log("-_active_-");
}

export function buildTagFromParams(container:any, search_obj:URLSearchParams ){
  text.buildTagFromSearchField(container , search_obj);
}

export function setGLInstance(_gl:WebGL2RenderingContext){
  gl = _gl;
}

export function clearScreen(){
  gl.clearColor(0.75, 0.75, 0.75, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
export function createShaderProgram(vshader:string , fshader:string, error_name:string) : WebGLProgram{
  return shaders.createShaderProgram(gl , vshader, fshader, error_name);
}
export function initSquareBuffers(){
  return buffers.createSquareBuffer(gl);
}
export function initFrameBuffer(height:number, width:number){
  return buffers.createFrameBuffer(gl , height, width);
}
export function loadTexture(image_src:string){
  return textures.loadTexture(gl, image_src)
}
export function createParticleEmitter(settings:emitters.ParticleSettings){
  return emitters.createEmitter(settings);
}
export function moveParticles(particle_properties:emitters.ParticleObject[] , settings:emitters.AdditionalSettings){
  return emitters.moveParticles(particle_properties , settings);
}
export function setGravity(g:number){
  emitters.setGravity(g);
}
export function assessBandVolumes(frequency_profile: Uint8Array){
  return audio.assessBandVolumes(frequency_profile);
}
export function initAudio(audio_element:any) : any{
  return audio.initAudio(audio_element);
}
// very simple construction function. Around only because all the current cards are identical in function and customizable with a few variables
export function buildCard(...args:any){
  cardbuilder.init.apply(false, args);
}
export function buildTag(...args:any){
  cardbuilder.buildTag.apply(false, args);
}
import * as cards from "./entry-point";
import * as glm from "gl-matrix"

import { ParticleObject } from "./particle-emitters"

export function init(image_src:string, particle_src:string, width:number, height:number , bloom_audio_band:number , particle_threshold:number){
  let audio_element = document.getElementById("audio");
  let canvas_element = document.getElementById("canvas");

  const gl = (canvas_element as HTMLCanvasElement).getContext("webgl2");
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  cards.setGLInstance(gl);

  //background
  const background_framebuffer_program = cards.createShaderProgram(cards.immobile_v_shader , cards.bloom_f_shader, "bloomFB");
  const background_final_program = cards.createShaderProgram(cards.immobile_v_shader , cards.post_bloom_f_shader, "bloomFin");
  const background_buffers = cards.initSquareBuffers();
  const background_framebuffer_lr = cards.initFrameBuffer(height, width);
  const background_framebuffer_ud = cards.initFrameBuffer(height, width);
  const background_texture = cards.loadTexture(image_src);
  // particles
  const particle_program = cards.createShaderProgram( cards.particle_v_shader , cards.texture_f_shader , "particles");
  const particle_buffers = cards.initSquareBuffers();
  const particle_texture = cards.loadTexture( particle_src);
  const flat_emitter = cards.createParticleEmitter( { angle: 0.0 , rotation:0.0, position: glm.vec4.fromValues( 0.0 , 1.04, 0.0 , 0.0 )  , length: 2.0 , inverse_normal:true }  );
  const circle_emitter = cards.createParticleEmitter({ angle: 360.0 , rotation:0.0, position: glm.vec4.fromValues( 0.0 , 0.0, 0.0 , 0.0 )  , length: 0.5 , inverse_normal:true } );

  const programs = {
    backgroundBloomFrameBuffer: background_framebuffer_program,
    backgroundBloomCombination: background_final_program,
    particle: particle_program
  }
  const buffers = {
    background: background_buffers,
    backgroundFramebufferLR: background_framebuffer_lr,
    backgroundFramebufferUD: background_framebuffer_ud,
    particle: particle_buffers
  };
  const textures = {
    background: background_texture,
    particle: particle_texture
  };
  const emmitters = {
    flat: flat_emitter,
    circle: circle_emitter
  }
  const programInfo = {
    programs : programs,
    buffers : buffers,
    textures: textures,
    emmitters: emmitters
  }

  var particle_properties:ParticleObject[] = [];

  canvas_element.onmousedown = function (e: MouseEvent) {
     const rect = canvas_element.getBoundingClientRect()
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     particle_properties = particle_properties.concat( emmitters.circle.createParticles(50 ,
       {
         additional_position: glm.vec4.fromValues(  x / (width / 2) - 1  , 1 - y / (height / 2), 0.0 , 0.0 ) ,
       }
       )
     );
   };
   var focused_for_chrome = false;
   var audio_obj = new Object();
   var readyProgramForChrome = function(){
     if(!focused_for_chrome){
       focused_for_chrome = true;
       audio_obj = cards.initAudio(audio_element);
     }
   }
   audio_element.onplay = readyProgramForChrome;
   document.body.onclick = readyProgramForChrome;

   setInterval(function () {
      var audio_bands = new Array(5);
      if(focused_for_chrome){
        audio_bands = audiovisualFX(audio_obj);
        // from audio bands create particles
        {
            if(audio_bands[0] + audio_bands[1] + audio_bands[2] + audio_bands[3] + audio_bands[4] + audio_bands[5] > particle_threshold){
              particle_properties = particle_properties.concat(emmitters.flat.createParticles( 2 , {
                expiration : 10000,
                velocity_mod: 0,
                } )
              );
            }
          }
      }
      // limit active particles to infinity , trim oldest
      cards.moveParticles(particle_properties);
      draw(gl,programInfo , audio_bands , particle_properties , bloom_audio_band);
    }, 16);
}
function audiovisualFX(audio_obj:any) {
  var frequency_profile = new Uint8Array(audio_obj.analyser.frequencyBinCount);
  audio_obj.analyser.getByteFrequencyData(frequency_profile);
  var bands = cards.assessBandVolumes(frequency_profile);
  return bands;
}

function draw(gl:WebGL2RenderingContext, programInfo:any, audio_bands:number[] , particle_properties:ParticleObject[] , bloom_audio_band:number){
  cards.clearScreen();
  drawBackground(gl, programInfo, audio_bands[bloom_audio_band]);
  drawParticles(gl, programInfo , particle_properties);
}

// fill with bloom properties
function drawBackground(gl:WebGL2RenderingContext, programInfo:any, bloom_band_volume:number){
  programInfo.programs.backgroundBloomFrameBuffer.use();

  programInfo.buffers.background.enable(programInfo.programs.backgroundBloomFrameBuffer , "in_vertex_position" , "in_texture_coord")


  // bloom settings
  programInfo.programs.backgroundBloomFrameBuffer.uniform(gl.uniform1i , "image" , 0);
  programInfo.textures.background.set(0);

  var initial = true;
  var loops = 2;
  //blur the base image
  for(var bloom_loop = 0 ; bloom_loop < loops * 2 ; bloom_loop++){
      programInfo.programs.backgroundBloomFrameBuffer.uniform(gl.uniform1i , "lr_blur" , bloom_loop % 2 == 0);

      //bind framebuffer
      bloom_loop % 2 == 0 ?
        programInfo.buffers.backgroundFramebufferLR.enable() :
        programInfo.buffers.backgroundFramebufferUD.enable() ;
     //now render the scene to the texture
      {
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    // switch to the blurred image
    bloom_loop % 2 == 0 ?
      programInfo.buffers.backgroundFramebufferLR.texture.set(0) :
      programInfo.buffers.backgroundFramebufferUD.texture.set(0) ;
  }

  //unbind the framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // final procedure
  programInfo.programs.backgroundBloomCombination.use();
  programInfo.buffers.background.enable(programInfo.programs.backgroundBloomCombination, "in_vertex_position" , "in_texture_coord");


  // bloom settings
  programInfo.programs.backgroundBloomCombination.uniform( gl.uniform1i , "base_image" , 0 );
  programInfo.programs.backgroundBloomCombination.uniform( gl.uniform1i , "processed_image" , 1 );
  programInfo.programs.backgroundBloomCombination.uniform( gl.uniform1f , "bloom_strength" , bloom_band_volume);

  programInfo.buffers.backgroundFramebufferUD.texture.set(0)
  programInfo.textures.background.set(1);

  {
    const vertexCount = 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function drawParticles(gl:WebGL2RenderingContext, programInfo:any, object_physics:ParticleObject[]){
  // Tell WebGL to use our program when drawing
  programInfo.programs.particle.use();
  programInfo.buffers.particles.enable(programInfo.programs.particle, "in_vertex_position" , "in_texture_coord")
  programInfo.textures.particles.set(0);
  programInfo.programs.particle.uniform(gl.uniform1i , "image" , 0);

  // position the instances
  object_physics.forEach(function(particle_object:ParticleObject , index:number) {
    programInfo.programs.particle.uniform(gl.uniform1f , "vertex_scaling" , [particle_object.scaling] );
    programInfo.programs.particle.uniform(gl.uniform4fv , "vertex_translation" , [particle_object.location] );
    // rotation
    const rotationMatrix = glm.mat4.create();
    glm.mat4.rotate(rotationMatrix, rotationMatrix, particle_object.rotation,  [0, 0, 1]);
    programInfo.programs.particle.uniform(gl.uniformMatrix4fv , "vertex_rotation" , [false, rotationMatrix] );
    {
      const vertexCount = 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset );
    }
  });
  return;
}
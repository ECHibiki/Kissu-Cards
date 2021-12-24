import * as glm from "gl-matrix"

var gravity = -0.001

export interface ParticleObject {
  location: glm.vec4 , // where it is now
  velocity: glm.vec4 , // how fast it is moving
  expires: number, // a value showing how many miliseconds it has left to live
  rotational_velocity: number, // how it's rotating
  rotation: number, //rotational position
  scaling: number
}

export interface ParticleSettings{
  angle:number,
  rotation:number,
  position: glm.vec4,
  length:number,
  inverse_normal:boolean
}

export interface AdditionalSettings{
  velocity_mod?:number[] ;
  wind_mod?:number[] ;
  additional_position?: glm.vec4 ;
  expiration?: number ;
  scaling?:number;
  rotation?:number;
}

export function setGravity(g:number){
  gravity = g;
}

export function createEmitter(emitter_settings:ParticleSettings){
  // must be radians
    const ARC_ANGLE = emitter_settings.angle;
    const ROTATION = emitter_settings.rotation;
    const EMITTER_LEN = emitter_settings.length;
    // half way point of segment laid flat(0 angle). not a focal point
    const EMITTER_POSITION = emitter_settings.position;
    // allows for emitters to fire internally into arcs or easier reversing in general
    const INVERSE_NORMALS = emitter_settings.inverse_normal;

    var rotationMatrix = glm.mat4.create()
    glm.mat4.rotate(rotationMatrix,  // destination matrix
                rotationMatrix,  // matrix to rotate
                ROTATION,   // amount to rotate in radians
                [0, 0, 1]);

    // division by 0 impossible so use a different system
    var normal_vector_fn = function(segment?:number){ return glm.vec4.fromValues(0.0 , 0.0 , 0.0, 0.0);}
    var emission_fn = function(segment?:number){ return glm.vec4.fromValues(0.0 , 0.0 , 0.0, 0.0); }
    if (ARC_ANGLE == 0.0) {
      // normal vector of line is easy, and rotate it by rotation value
      normal_vector_fn = function(){
        var norm = glm.vec4.create();
        // @ts-ignore   -  Vec4 is applicable here
        glm.mat4.multiply( norm , rotationMatrix , glm.vec4.fromValues( 0.0 , 1.0 , 0.0 , 0.0));
        glm.vec4.scale( norm , norm , (INVERSE_NORMALS ? -1 : 1))
        return norm;
      }
      // set the position of a particle
      emission_fn = function(position_segment:number){
        // pick a position on a centered line, then rotate it
        var distance = position_segment *  EMITTER_LEN - EMITTER_LEN / 2.0;
        var position = glm.vec4.create();
        // @ts-ignore   -  Vec4 is applicable here
        glm.mat4.multiply( position , rotationMatrix , glm.vec4.fromValues( distance , 0.0 , 0.0 , 0.0 ));
        glm.vec4.add(position , position , EMITTER_POSITION)
        return position;
      }
    } else{
      // grab the center
      var radius_len = EMITTER_LEN / ARC_ANGLE;
      // polar coordinates can determine cartesian coordinates easily.
      // Normal vectors will be the circle radius vector. Distance from center determined by radius vector.
      normal_vector_fn = function(arc_segment:number){
        // arc segment is a 0.0 to 1.0 value representing the distace down the arc it is
        // theta is bound to be a ratio of the max angle permitted. Create the arc then rotate it to be centered
        var theta = arc_segment * ARC_ANGLE + Math.PI / 2.0 - ARC_ANGLE / 2.0;
        var norm = glm.vec4.create();
        // @ts-ignore   -  Vec4 is applicable here
        glm.mat4.multiply( norm , rotationMatrix , glm.vec4.fromValues( Math.cos(theta) , Math.sin(theta)  , 0.0 , 0.0));
        glm.vec4.scale( norm , norm , (INVERSE_NORMALS ? -1 : 1))
        return norm ;
      }
      emission_fn = function(arc_segment:number){
        // pick a position on a centered line, then rotate it
        var theta = arc_segment * ARC_ANGLE + Math.PI / 2.0 - ARC_ANGLE / 2.0;
        var position = glm.vec4.create();
        // @ts-ignore   -  Vec4 is applicable here
        glm.mat4.multiply( position , rotationMatrix , glm.vec4.fromValues( radius_len * Math.cos(theta) , radius_len * Math.sin(theta)  , 0.0 , 0.0));
        glm.vec4.add(position , position , EMITTER_POSITION)
        return position;
      }
    }

    return {
      createParticles: function(quanitity:number , additional_obj:AdditionalSettings) : ParticleObject[]{
        if(!additional_obj){
          additional_obj = {};
        }
        var new_particles = [  ];
        for (var p = 0 ; p < quanitity ; p++){
          var arc_rand = Math.random();
          var velocity_x = 0;
          var velocity_y = 0;

          if(additional_obj.velocity_mod){
            velocity_x = Math.random() * (additional_obj.velocity_mod[0] );
            velocity_y = Math.random() * (additional_obj.velocity_mod[1] ) ;
          }
          else{
            velocity_x = Math.random() * ((0.125) - 0.0025) + 0.0025;
            velocity_y = Math.random() * ((0.125) - 0.0025) + 0.0025;
          }
          var vel_rand = glm.vec4.fromValues(velocity_x, velocity_y , 0.0, 0.0);
          glm.vec4.multiply(vel_rand , normal_vector_fn(arc_rand)  , vel_rand );
          if(additional_obj.wind_mod){
            glm.vec4.add(vel_rand , vel_rand  , glm.vec4.fromValues(
              additional_obj.wind_mod[0] * (INVERSE_NORMALS ? -1 : 1)
             , additional_obj.wind_mod[1] * (INVERSE_NORMALS ? -1 : 1) , 0.0 , 0.0 ) );
          }

          var particle_location = glm.vec4.create();
          new_particles.push(
          {
             location: (additional_obj.additional_position ? glm.vec4.add(particle_location , emission_fn(arc_rand) , additional_obj.additional_position ) : emission_fn(arc_rand)), // where it is now
             velocity:  vel_rand, // how fast it is moving
             expires: Date.now() +  (additional_obj.expiration ? additional_obj.expiration :  5000), // a value showing how many miliseconds it has left to live
             rotational_velocity: (Math.random() * (Math.PI / 20 + Math.PI / 20 ) - Math.PI / 20 )* (additional_obj.rotation ? additional_obj.rotation : 1.0), // how it's rotating
             rotation: Math.random() * 2 * Math.PI, //rotational position
             scaling:  Math.random() * ((additional_obj.scaling != undefined ? additional_obj.scaling : 0.08) - 0.02) + 0.02
           });
        }

        return new_particles;
      }
    }
  }

  export function moveParticles(particle_properties:ParticleObject[] , additional_obj: AdditionalSettings){
    var removal_indices:number[] = [];
    var skip_count = particle_properties.length - 500000;
    particle_properties.forEach(function(particle:ParticleObject, index:number) {
      if(particle.expires < Date.now() || index < skip_count) {
        removal_indices.push(index);
        return;
      }
      particle_properties[index].rotation += particle_properties[index].rotational_velocity;
      glm.vec4.add(particle_properties[index].location , particle_properties[index].location, particle_properties[index].velocity);
      glm.vec4.add(particle_properties[index].velocity,
        particle_properties[index].velocity, glm.vec4.fromValues(
          -1 * (additional_obj.wind_mod ? additional_obj.wind_mod[0] : 0.0),
          gravity - (additional_obj.wind_mod ? additional_obj.wind_mod[1] : 0.0) , 0.0, 0.0));
    });
    removal_indices.reverse().forEach(function(indice:number){
      particle_properties.splice(indice , 1);
    });
    return particle_properties;
  }
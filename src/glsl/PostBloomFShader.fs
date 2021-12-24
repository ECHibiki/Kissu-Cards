#version 300 es
in mediump vec2 out_texture_coord;

uniform sampler2D base_image;
uniform sampler2D processed_image;

uniform mediump float bloom_strength;
out mediump vec4 output_fragment_color;

void main(){
  mediump vec3 bloom = texture(processed_image , out_texture_coord).rgb;
  // adds the bloom image to the base image and also adds a white color on top
  output_fragment_color = texture(base_image , out_texture_coord) + vec4(bloom * clamp(bloom_strength , 0.0 , 1.0)  , 1.0)
    + vec4( vec3(255.0/255.0,252.0/255.0,160.0/255.0) * clamp(bloom_strength * .1 , 0.0 , 1.0)  , 1.0);
}
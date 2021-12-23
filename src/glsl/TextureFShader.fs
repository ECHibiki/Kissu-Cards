#version 300 es
in mediump vec2 out_texture_coord;
uniform sampler2D image;

out mediump vec4 output_fragment_color;
void main(){
  output_fragment_color  = texture(texture_image , out_texture_coord);
}
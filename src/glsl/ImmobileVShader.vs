#version 300 es
in vec4 in_vertex_position;
in vec2 in_texture_coord;
out mediump vec2 out_texture_coord;
void main() {
  gl_Position = in_vertex_position;
  out_texture_coord = in_texture_coord;
}
#version 300 es
in vec4 in_vertex_position;
in vec2 in_texture_coord;


uniform mediump float vertex_scaling;
uniform vec4 vertex_translation;
uniform mat4 vertex_rotation;

out mediump vec2 out_texture_coord;

void main() {
  gl_Position = vertex_rotation * in_vertex_position * vec4(vertex_scaling , vertex_scaling , 1.0 , 1.0) + vertex_translation;
  out_texture_coord = in_texture_coord;
}
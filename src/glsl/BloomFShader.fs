#version 300 es
in mediump vec2 out_texture_coord;

uniform sampler2D image;
uniform bool lr_blur;
uniform bool isolate;

uniform mediump vec3 low_bloom_color;
uniform mediump vec3 high_bloom_color;

out mediump vec4 output_fragment_color;

mediump float blur_weights[5] = float[5](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

// DO NOT ISOLATE AFTER FIRST LOOP OF COLOR REMOVAL
lowp float usablePixel(mediump vec3 pixel_rgb){
  lowp vec3 use_low_rgb = step( -0.1 , pixel_rgb - low_bloom_color);
  lowp vec3 use_high_rgb = 1.0 - step( 0.1 , pixel_rgb - high_bloom_color);
  return step( 1.0 ,  use_high_rgb[0] * use_high_rgb[1] * use_high_rgb[2] * use_low_rgb[0] * use_low_rgb[1] * use_low_rgb[2] + float(!isolate) )  ;
}
void main(void) {
  // isolate brighter than orange shade (clamp interval)
  mediump vec3 base_pixel = texture(image, out_texture_coord).rgb ;
  lowp vec3 isolated_color = (base_pixel )  *  usablePixel(base_pixel)  ;

  // blur
  lowp vec2 tex_offset = 1.0 / vec2(textureSize(image, 0)); ; // gets size of single texel
  lowp vec3 result = isolated_color * blur_weights[0]; // current fragment's contribution
  for(int i = 1; i < 5; ++i) {
  mediump vec3 px = texture(image, out_texture_coord + vec2(tex_offset.x * float(i), 0.0)).rgb;
  mediump vec3 mx = texture(image, out_texture_coord - vec2(tex_offset.x * float(i), 0.0)).rgb;
  mediump vec3 py = texture(image, out_texture_coord + vec2(0.0, tex_offset.y * float(i))).rgb;
  mediump vec3 my = texture(image, out_texture_coord - vec2(0.0, tex_offset.y * float(i))).rgb;
     result += usablePixel(px) * px * blur_weights[i] * float(lr_blur)
          + usablePixel(py) * py * blur_weights[i] * float(!lr_blur);
          result +=  usablePixel(mx) * mx * blur_weights[i] * float(lr_blur)
          + usablePixel(my) * my * blur_weights[i] * float(!lr_blur);
    }
  output_fragment_color = vec4(result , 1.0);
}
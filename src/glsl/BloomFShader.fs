#version 300 es
in mediump vec2 in_texture_coord;

uniform sampler2D image;
uniform bool lr_blur;

uniform vec3 low_bloom_color = vec3(240.0/255.0,113.0/255.0,47.0/255.0 );
uniform vec3 high_bloom_color = vec3(255.0/255.0,252.0/255.0,160.0/255.0);

out mediump vec4 output_fragment_color;

mediump float blur_weights[5] = float[5](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

lowp float usablePixel(mediump vec3 pixel_rgb){
  lowp vec3 use_low_rgb = step( -0.1 , pixel_rgb - low_bloom_color);
  lowp vec3 use_high_rgb = 1.0 - step( 0.1 , pixel_rgb - high_bloom_color);
  return step( 1.0 ,  use_high_rgb[0] * use_high_rgb[1] * use_high_rgb[2] * use_low_rgb[0] * use_low_rgb[1] * use_low_rgb[2] )  ;
}
void main(void) {
  // isolate brighter than orange shade (clamp interval)
  mediump vec3 base_pixel = texture(image, in_texture_coord).rgb ;
  lowp vec3 isolated_color = (base_pixel )  *  usablePixel(base_pixel)  ;

  // blur
  lowp vec2 tex_offset = vec2(1.0/${WIDTH}.0, 1.0/${HEIGHT}.0) ; // gets size of single texel
  lowp vec3 result = isolated_color * blur_weights[0]; // current fragment's contribution
  for(int i = 1; i < 5; ++i) {
  mediump vec3 px = texture(image, in_texture_coord + vec2(tex_offset.x * float(i), 0.0)).rgb;
  mediump vec3 mx = texture(image, in_texture_coord - vec2(tex_offset.x * float(i), 0.0)).rgb;
  mediump vec3 py = texture(image, in_texture_coord + vec2(0.0, tex_offset.y * float(i))).rgb;
  mediump vec3 my = texture(image, in_texture_coord - vec2(0.0, tex_offset.y * float(i))).rgb;
     result += usablePixel(px) * px * blur_weights[i] * float(lr_blur)
          + usablePixel(py) * py * blur_weights[i] * float(!lr_blur);
          result +=  usablePixel(mx) * mx * blur_weights[i] * float(lr_blur)
          + usablePixel(my) * my * blur_weights[i] * float(!lr_blur);
    }
    output_fragment_color = vec4(result , 1.0);
}
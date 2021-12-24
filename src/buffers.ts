
import {ShaderObj} from "./shaders";

export function createSquareBuffer(gl:WebGL2RenderingContext){
  // Create a buffer for the square's positions.
  const position_buffer = gl.createBuffer();
  const index_buffer = gl.createBuffer();
  const texture_coord_buffer = gl.createBuffer();

  // Select the position_buffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  // Now create an array of positions for the square.
  const positions = [-1.0, 1.0,
                     1.0, 1.0,
                     -1.0, -1.0,
                     1.0, -1.0];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);



  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  const indices = [
    0,    1,    2,
    1,    2,    3 // front
  ];
  // Now send the element array to GL
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, texture_coord_buffer);
  const textureCoordinates = [
    // Front
    0.0,    0.0,
    1.0,    0.0,
    0.0,    1.0,
    1.0,    1.0
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  return {
    enable: function(program: ShaderObj, vertex_attr:string , texture_attr:string){
      // Tell WebGL to use our program when drawing
      {
        const num_components = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                  // 0 = use type and num_components above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
        gl.vertexAttribPointer(
            program.attributeLocation(vertex_attr),
            num_components,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray( program.attributeLocation(vertex_attr) );
      }
      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

      // tell webgl how to pull out the texture coordinates from buffer
      {
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, texture_coord_buffer);
      gl.vertexAttribPointer(
        program.attributeLocation(texture_attr),
        num,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray( program.attributeLocation(texture_attr) );
      }
    }
  };
}

export function createFrameBuffer(gl:WebGL2RenderingContext , height:number, width:number){
  var buffer = gl.createFramebuffer();
     //bind framebuffer to texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);

  var texture = gl.createTexture();
  //set properties for the texture
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  return {
   texture: {
     set: function(texture_num:number){
       gl.activeTexture( gl.TEXTURE0 + texture_num );
       gl.bindTexture( gl.TEXTURE_2D, texture );
     }
   },
   buffer: buffer,
   enable: function(){
     gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
   }
  };
}
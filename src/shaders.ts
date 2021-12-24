
export interface ShaderObj{
  shader_variables: any ,
  program: WebGLProgram,
  use: any,
  uniform:any,
  attributeLocation:any
}

export function createShaderProgram(gl:WebGL2RenderingContext , vshader:string , fshader:string, error_name:string) : WebGLProgram{
  const vertex_shader = loadShader(gl, gl.VERTEX_SHADER, vshader , error_name);
  const fragment_shader = loadShader(gl, gl.FRAGMENT_SHADER, fshader , error_name);

// Create the shader program
  const shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertex_shader);
  gl.attachShader(shader_program, fragment_shader);
  gl.linkProgram(shader_program);

  if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader " + error_name +
        gl.getProgramInfoLog(shader_program)
    );
    return null;
  }
  var shader_this = this;
  return {
    shader_variables: {
      uniforms: {},
      attributes: {}
     },
    program: shader_program,
    use: function(){
      gl.useProgram(this.program);
    },
    uniformSetter:function( unifomFn:( location:WebGLUniformLocation  ) => void , name:string  ) {
      var variable_reference:WebGLUniformLocation;
      if(this.shader_variables.uniforms[name]){
        variable_reference = this.shader_variables.uniforms[name];
      } else{
        variable_reference = gl.getUniformLocation(this.program , name);
        this.shader_variables.uniforms[name] = variable_reference;
      }
      return unifomFn( variable_reference );
    },
    attributeLocation:function (name:string) {
      var variable_reference:GLint;
      if(this.shader_variables.attributes[name]){
        variable_reference = this.shader_variables.attributes[name];
      } else{
        variable_reference = gl.getAttribLocation(this.program , name);
        this.shader_variables.attributes[name] = variable_reference;
      }
      return variable_reference;
    }
  }
}

function loadShader(gl:WebGL2RenderingContext , type:number , shader_code:string, error_name?:string){
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shader_code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders " + error_name +": " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
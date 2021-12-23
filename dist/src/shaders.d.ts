export interface ShaderObj {
    shader_variables: any;
    program: WebGLProgram;
    use: any;
    uniform: any;
    attributeLocation: any;
}
export declare function createShaderProgram(gl: WebGL2RenderingContext, vshader: string, fshader: string, error_name: string): WebGLProgram;

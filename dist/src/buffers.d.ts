import { ShaderObj } from "./shaders";
export declare function createSquareBuffer(gl: WebGL2RenderingContext): {
    enable: (program: ShaderObj, vertex_attr: string, texture_attr: string) => void;
};
export declare function createFrameBuffer(gl: WebGL2RenderingContext, height: number, width: number): {
    texture: WebGLTexture;
    buffer: WebGLFramebuffer;
    enable: () => void;
};

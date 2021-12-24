import * as shaders from "./shaders";
import * as emitters from "./particle-emitters";
export declare var immobile_v_shader: string;
export declare var bloom_f_shader: string;
export declare var post_bloom_f_shader: string;
export declare var particle_v_shader: string;
export declare var texture_f_shader: string;
export declare function helloWorld(): void;
export declare function buildTagFromParams(container: any, search_obj: URLSearchParams): void;
export declare function setGLInstance(_gl: WebGL2RenderingContext): void;
export declare function clearScreen(): void;
export declare function createShaderProgram(vshader: string, fshader: string, error_name: string): WebGLProgram;
export declare function initSquareBuffers(): {
    enable: (program: shaders.ShaderObj, vertex_attr: string, texture_attr: string) => void;
};
export declare function initFrameBuffer(height: number, width: number): {
    texture: {
        set: (texture_num: number) => void;
    };
    buffer: WebGLFramebuffer;
    enable: () => void;
};
export declare function loadTexture(image_src: string): {
    set: (texture_num: number) => void;
};
export declare function createParticleEmitter(settings: emitters.ParticleSettings): {
    createParticles: (quanitity: number, additional_obj: emitters.AdditionalSettings) => emitters.ParticleObject[];
};
export declare function moveParticles(particle_properties: emitters.ParticleObject[], settings: emitters.AdditionalSettings): emitters.ParticleObject[];
export declare function setGravity(g: number): void;
export declare function assessBandVolumes(frequency_profile: Uint8Array): any[];
export declare function initAudio(audio_element: any): any;
export declare function buildCard(...args: any): void;
export declare function buildTag(...args: any): void;

import * as glm from "gl-matrix";
export interface ParticleObject {
    location: glm.vec4;
    velocity: glm.vec4;
    expires: number;
    rotational_velocity: number;
    rotation: number;
    scaling: number;
}
export interface ParticleSettings {
    angle: number;
    rotation: number;
    position: glm.vec4;
    length: number;
    inverse_normal: boolean;
}
export interface AdditionalSettings {
    velocity_mod?: number[];
    wind_mod?: number[];
    additional_position?: glm.vec4;
    expiration?: number;
    scaling?: number;
    rotation?: number;
}
export declare function setGravity(g: number): void;
export declare function createEmitter(emitter_settings: ParticleSettings): {
    createParticles: (quanitity: number, additional_obj: AdditionalSettings) => ParticleObject[];
};
export declare function moveParticles(particle_properties: ParticleObject[], additional_obj: AdditionalSettings): ParticleObject[];

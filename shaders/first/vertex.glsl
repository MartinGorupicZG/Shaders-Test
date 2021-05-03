uniform float time;
uniform float direction;
uniform float progress;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;

void main(){
    vec3 pos = position;
    //pos.z = 0.1 * sin(pos.x*10.);
    float distance = length(uv-vec2(0.5));
    float maxdist = length(vec2(0.5));
    float normalizedDistance = distance / maxdist;
    float stickTo = normalizedDistance;
    float stickOut = -normalizedDistance;
    float stickEffect = mix(stickTo,stickOut,direction);
    float superProgress =min(2.*progress,2.*(1.-progress));
    float zOffset = 2.;
    float zProgress = mix(clamp(2.*progress,0.,1.),clamp(1.-2.*(1.-progress),0.,1.),direction);
    pos.z += zOffset * (stickEffect * superProgress - zProgress);
    pos.z += progress*sin(distance*10.+ 2.*time)*0.1;
   
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
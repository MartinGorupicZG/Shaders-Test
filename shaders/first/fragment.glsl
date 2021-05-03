uniform float time;
uniform float progress;
uniform float speed;
uniform vec2 mouse ;
uniform sampler2D texture1;
//uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
    float normSpeed=clamp(speed * 40.,0.,1.);
    float mouseDist = length(vUv-mouse);
    float circle = smoothstep(0.2,0.,mouseDist);
    vec2 newUv =(vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec4 color = texture2D(texture1,newUv);
    float r = texture2D(texture1,newUv + 0.1*0.5*circle * normSpeed).r;
    float g = texture2D(texture1,newUv + 0.1*0.3*circle * normSpeed).g;
    float b = texture2D(texture1,newUv + 0.1*0.1*circle * normSpeed).b;
gl_FragColor = vec4(vUv,0.0,1.);
gl_FragColor = color;
gl_FragColor= vec4(normSpeed*mouseDist,0.,0.0,1.);
gl_FragColor= vec4(r,g,b,1.);
}
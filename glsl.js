var VertexShaderCode =
    `
attribute vec3 aPos;//顶点
attribute vec3 aNor;//法线

uniform mat4 aFrustum;//透视矩阵
uniform mat4 aFrustumYY;//透视矩阵
uniform mat4 aCamera;//镜头变换矩阵
uniform mat4 aCameraYY;//镜头变换矩阵
uniform mat4 aSelf;//自身变换矩阵

uniform vec4 aColor;
varying vec3 outPos;
varying vec3 outNor;


void main(){
	gl_Position = aFrustum * aCamera * aSelf * vec4(aPos,1.0);
    outPos = aPos;
    outNor = aNor;
    
    //vec3 lightPos = vec3(0,0,1000.0);
    ////normalize
    //vec3 L = normalize(lightPos-(aSelf * vec4(aPos,1.0)).xyz);
    //vec3 N = normalize(m423(aSelf)*aNor);
    //float mfs = max(dot(L,N),0.0)*0.8;
    ////vec3 eyePos = (aCamera*vec4(0,0,0,1.0)).xyz;
    ////vec3 E = normalize(eyePos-(aSelf * vec4(aPos,1.0)).xyz);
    ////vec3 R = normalize(reflect(L,N));
    ////float gg = pow(max(dot(E,R),0.0),2.0);
    //outColor = vec4(aColor.xyz*(0.2+mfs)+vec3(1.0,1.0,1.0)*0.0,1.0);
}

`;

var FragmentShaderCode =
    `
precision highp float;

uniform mat4 aFrustum;//透视矩阵
uniform mat4 aFrustumYY;//透视矩阵
uniform mat4 aCamera;//镜头变换矩阵
uniform mat4 aCameraYY;//镜头变换矩阵
uniform mat4 aSelf;//自身变换矩阵

uniform vec4 aColor;

uniform float lSelf;//自身发光
uniform mat4 ePos;//眼睛位置
uniform int isYY;//
uniform sampler2D  YY;//
varying vec3 outPos;
varying vec3 outNor;
mat3 m423(mat4 m4){
    return mat3(m4[0].xyz,m4[1].xyz,m4[2].xyz);
}
void main(){
    //uniform 全局变量用下if 损失也不是很大
    if(isYY==1){
        gl_FragColor = aColor;
        return;
    }
    vec3 lightPos = vec3(0,30,100.0);
    vec3 L = normalize(lightPos-(aSelf * vec4(outPos,1.0)).xyz);
    vec3 N = normalize(m423(aSelf)*outNor);
    float mfs = max(dot(L,N),0.0)*0.8;
    
    vec3 eyePos = (ePos*vec4(0,0,0,1.0)).xyz;
    //vec3 eyePos = -(aCamera*vec4(0,0,0,1.0)).xyz;
    vec3 E = normalize((aSelf * vec4(outPos,1.0)).xyz-eyePos);
    vec3 R = normalize(reflect(L,N));
    float gg = pow(max(dot(E,R),0.0),100.0);

    float noShadow=1.0;
    //阴影计算了开始
    vec4 yyPos4 = aFrustumYY*aCameraYY*aSelf*vec4(outPos,1.0);
    vec3 yyPos3 = yyPos4.xyz/yyPos4.w;
    yyPos3 = vec3((yyPos3.x+1.0)/2.0,(yyPos3.y+1.0)/2.0,(yyPos3.z+1.0)/2.0);
    
    //GPU不擅长做if else 擅长浮点运算，以下的函数都是GPU优化过的
    float isInCut= (1.0-max(sign(0.0-yyPos3.x), 0.0)) * (1.0-max(sign(0.0 - yyPos3.y), 0.0)) * (1.0-max(sign(yyPos3.x - 1.0), 0.0)) * (1.0-max(sign(yyPos3.y - 1.0), 0.0));
    float curDepth = yyPos3.z-0.0000003;
    //float curDepth = yyPos3.z*0.9999995;
    
    float textureDepth = texture2D(YY,yyPos3.xy).r;

    
    //noShadow = (1.0-max(sign(curDepth - textureDepth), 0.0));
    noShadow = max((1.0-max(sign(curDepth - textureDepth), 0.0)) , 1.0 - isInCut);

    //noShadow = textureDepth;
    
    
    
	gl_FragColor = vec4(aColor.xyz*(0.2+mfs*noShadow+lSelf)+vec3(1.0,1.0,1.0)*gg*noShadow,1.0);
    //gl_FragColor = vec4(textureDepth,textureDepth,textureDepth,1.0);
}
`;
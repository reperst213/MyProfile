// ========================================
// 0. WebGL 초기화 / WebGL initialization
// ========================================

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    alert("WebGL2를 사용할 수 없습니다. / WebGL2 is not available.");
}

// HTML에서 gl-matrix-min.js를 먼저 로드해야 한다. / gl-matrix-min.js must be loaded in the HTML first.
const mat4 = glMatrix.mat4;
const toRad = glMatrix.glMatrix.toRadian;


// ========================================
// 1. Vertex (중심 0, 한 변 길이 2) / Vertex (centered at 0, edge length 2)
// HW0와 동일한 정육면체 / Same cube as HW0
// ========================================


// 이 정육면체를 modelMat으로 비균등 확대/축소하여 직육면체로 사용한다.
// This cube is non-uniformly scaled by modelMat to be used as a cuboid.
const vertices = [
    // front face
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    // right face
     1, -1,  1,   1,  1,  1,   1,  1, -1,   1, -1, -1,
    // back face
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
    // left face
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1,
    // top face
    -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1, -1,
    // bottom face
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1
];


// ========================================
// 2. Index (바깥에서 볼 때 CCW) / Index (CCW when viewed from outside)
// ========================================

// HW0와 동일하게 6개 면을 12개 삼각형으로 그린다.
// Same as HW0: 6 faces are drawn as 12 triangles.
const index = [
     0,  1,  2,   0,  2,  3,   // 앞 / front
     4,  5,  6,   4,  6,  7,   // 오른쪽 / right
     8,  9, 10,   8, 10, 11,   // 뒤 / back
    12, 13, 14,  12, 14, 15,   // 왼쪽 / left
    16, 17, 18,  16, 18, 19,   // 위 / top
    20, 21, 22,  20, 22, 23    // 아래 / bottom
];


// ========================================
// 3. Color (면별 고정 명도) / Color (fixed brightness per face)
// HW0과의 차이점은 각 면의 색상은 uColor가 결정하고 명도를 결정한다.
// Difference from HW0: uColor decides the hue, and this array only decides per-face brightness.
// ========================================


// 각 RGB 성분을 같은 값으로 지정하여 색상 대신 면별 명도 계수로 사용한다.
// Each RGB component is set to the same value so it acts as a per-face brightness factor instead of a color.
// 실제 부품 색상은 draw마다 전달되는 uColor가 결정한다.
// The actual part color is decided by uColor, passed on every draw call.
const colors = [
    1.00, 1.00, 1.00,   1.00, 1.00, 1.00,
    1.00, 1.00, 1.00,   1.00, 1.00, 1.00,   // 앞 - 100% / front - 100%

    0.75, 0.75, 0.75,   0.75, 0.75, 0.75,
    0.75, 0.75, 0.75,   0.75, 0.75, 0.75,   // 오른쪽 - 75% / right - 75%

    0.60, 0.60, 0.60,   0.60, 0.60, 0.60,
    0.60, 0.60, 0.60,   0.60, 0.60, 0.60,   // 뒤 - 60% / back - 60%

    0.70, 0.70, 0.70,   0.70, 0.70, 0.70,
    0.70, 0.70, 0.70,   0.70, 0.70, 0.70,   // 왼쪽 - 70% / left - 70%

    0.90, 0.90, 0.90,   0.90, 0.90, 0.90,
    0.90, 0.90, 0.90,   0.90, 0.90, 0.90,   // 위 - 90% / top - 90%

    0.50, 0.50, 0.50,   0.50, 0.50, 0.50,
    0.50, 0.50, 0.50,   0.50, 0.50, 0.50    // 아래 - 50% / bottom - 50%
];

//Task : 읽고 이해하기 ( modelMat 이 부위마다 적용되는 핵심 파트입니다. )
//Task: Read and understand (this is the key part where modelMat is applied per body part.)
// ========================================
// 4. Vertex Shader
//   - HW0: worldMat, viewMat, projMat
//   - HW01에는 부품별 modelMat가 추가되었습니다 / HW01 adds a per-part modelMat
// ========================================

const vertexShaderSource = `#version 300 es

uniform mat4 worldMat, viewMat, projMat;

//과제 중심 파트입니다. 상완, 하완, 손의 hierarchy 행렬
//Core part of the assignment: hierarchy matrices of the upper arm, lower arm, and hand
uniform mat4 modelMat;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 color;

out vec3 vColor;

void main() {
    // world/view/projection은 고정하고 modelMat만 draw마다 변경한다.
    // world/view/projection stay fixed; only modelMat changes per draw.
    gl_Position =
        projMat * viewMat * worldMat * modelMat
        * vec4(position, 1.0);

    // HW0의 color 전달 구조를 면별 명도 전달에 사용하는 차이점이 있습니다.
    // Difference: HW0's color-passing structure is reused to pass per-face brightness.
    vColor = color;
}
`;


// ========================================
// 5. Fragment Shader
// ========================================

const fragmentShaderSource = `#version 300 es

precision mediump float;

// 정점 색상 대신 부품별 단색을 전달할 수 있도록 색상을 사전에 정의했습니다.
// A per-part solid color is defined in advance so it can be passed instead of vertex colors.
uniform vec3 uColor;

in vec3 vColor;

out vec4 outColor;

void main() {
    // uColor는 부품의 기본색, vColor는 각 면의 고정 명도 계수이다.
    // uColor is the base color of the part; vColor is the fixed brightness factor of each face.
    outColor = vec4(uColor * vColor, 1.0);
}
`;


// ========================================
// 6. Shader 컴파일 / Shader compilation
// ========================================

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader Compile Error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader =
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader =
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);


// ========================================
// 7. Program 생성 / 링크 / Program creation / linking
// ========================================

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program Link Error:", gl.getProgramInfoLog(program));
}

gl.useProgram(program);


// ========================================
// 8. Attribute 설정 / Attribute setup
// ========================================

const POSITION_LOC = 0;   // layout(location = 0)
const COLOR_LOC = 1;      // layout(location = 1)

// --- Position VBO ---
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
);
gl.enableVertexAttribArray(POSITION_LOC);
gl.vertexAttribPointer(POSITION_LOC, 3, gl.FLOAT, false, 0, 0);

// --- Color VBO ---
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW
);
gl.enableVertexAttribArray(COLOR_LOC);
gl.vertexAttribPointer(COLOR_LOC, 3, gl.FLOAT, false, 0, 0);

// --- Index EBO ---
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(index),
    gl.STATIC_DRAW
);


// ========================================
// 9. 행렬 유틸리티 / Matrix utilities
//   모두 column-major, mat4 = length 16 / All column-major, mat4 = length 16
// HW0와 동일한 행렬 곱셈 함수: C = A * B / Same matrix multiply as HW0: C = A * B
// ========================================

function mul(a, b) {
    const c = new Float32Array(16);

    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            let sum = 0;

            for (let k = 0; k < 4; k++) {
                sum += a[k * 4 + row] * b[col * 4 + k];
            }

            c[col * 4 + row] = sum;
        }
    }

    return c;
}

// 벡터 유틸리티 / Vector utilities
const sub = (a, b) => [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
];

const dot = (a, b) =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
];

const norm = (v) => {
    const length = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
};

// LookAt function
// HW0 강의자료의 함수를 그대로 사용한다. / Uses the function from the HW0 lecture notes as is.
// HW0과 동일한 파트입니다. / Same part as HW0.
function lookAt(eye, at, up) {
    const n = norm(sub(eye, at));   // forward
    const u = norm(cross(up, n));   // right
    const v = cross(n, u);          // corrected up

    return new Float32Array([
        u[0], v[0], n[0], 0,
        u[1], v[1], n[1], 0,
        u[2], v[2], n[2], 0,
        -dot(u, eye), -dot(v, eye), -dot(n, eye), 1
    ]);
}

// Projection: HW0 강의자료 행렬 / Projection: matrix from the HW0 lecture notes
// near -> NDC z=+1, far -> NDC z=-1
function perspective(fovyDeg, aspect, near, far) {
    const cot =
        1.0 / Math.tan((fovyDeg * Math.PI / 180) / 2);

    return new Float32Array([
        cot / aspect, 0,   0,                           0,
        0,            cot, 0,                           0,
        0,            0,   (far + near) / (far - near), -1,
        0,            0,   (2 * near * far) /
                           (far - near),                 0
    ]);
}


// ========================================
// 10. World / View / Projection 행렬 / World / View / Projection matrices
// ========================================

// 로컬 X축 방향의 직육면체가 화면의 3시 방향과 수평으로 놓인다.
// A cuboid along the local X axis lies horizontally, pointing to the 3 o'clock direction on screen.

const radX = 25.0 * Math.PI / 180;
const rotXMat = new Float32Array([
    1, 0,               0,                0,
    0, Math.cos(radX),  Math.sin(radX),   0,
    0, -Math.sin(radX),  Math.cos(radX),   0,
    0, 0,               0,                1
]);



const worldMat = rotXMat;

// HW0와 동일하게 카메라를 원점에서 Z축 방향으로 5만큼 배치한다.
// Same as HW0: the camera is placed 5 units away from the origin along the Z axis.

const viewMat = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);


const aspect = canvas.width / canvas.height;
const projMat = perspective(45.0, aspect, 0.1, 100.0);

// Uniform 위치 / Uniform locations
const worldLocation =
    gl.getUniformLocation(program, "worldMat");
const viewLocation =
    gl.getUniformLocation(program, "viewMat");
const projLocation =
    gl.getUniformLocation(program, "projMat");
const modelLocation =
    gl.getUniformLocation(program, "modelMat");
const colorLocation =
    gl.getUniformLocation(program, "uColor");
    //도형 별로 다른 색상 구분 uColor / uColor distinguishes a different color for each shape

// HW0와 동일하게 world/view/projection은 시작할 때 한 번만 전달한다.
// Same as HW0: world/view/projection are sent only once at startup.
gl.uniformMatrix4fv(worldLocation, false, worldMat);
gl.uniformMatrix4fv(viewLocation, false, viewMat);
gl.uniformMatrix4fv(projLocation, false, projMat);


// ========================================
// 11. 화면 / 깊이 설정 / Viewport / depth settings
// ========================================

gl.viewport(0, 0, canvas.width, canvas.height);

gl.enable(gl.DEPTH_TEST);

// HW0 projection은 near가 NDC z=+1이므로 깊이 규약을 반전한다.
// The HW0 projection maps near to NDC z=+1, so the depth convention is inverted.
gl.clearDepth(0.0);
gl.depthFunc(gl.GREATER);

gl.clearColor(0.0, 0.0, 0.0, 1.0);


// ========================================
// 12. 로봇 팔 기본값 / Robot arm defaults
// 각 변수를 관찰한 뒤 keyEvent를 작성합니다.
// Observe each variable first, then write the keyEvent.
// ========================================

// 관절 각도 / Joint angles
let shoulderAngle = 0;
// 닫힌 상태인 0도에서 시작해 W를 누르면 한 방향으로 열린다.
// Starts closed at 0 degrees; pressing W opens it in one direction.
let elbowAngle = 0;
// 손목도 닫힌 상태인 0도에서 시작한다.
// The wrist also starts closed at 0 degrees.
let wristAngle = 0;

// T 손목 자전: 손의 길이 방향인 로컬 X축을 기준으로 회전한다.
// T wrist spin: rotates around the local X axis, which is the hand's length direction.
let wristSpinAngle = 0;
const wristSpinAngleStep = 5;

// Q/A 이동 제한 / Q/A movement limits
const shoulderMinAngle = -130;
const shoulderMaxAngle = 130;
const shoulderAngleStep = 5;

//  W 이동 제한 / W movement limits
const elbowMinAngle = 0;
const elbowMaxAngle = 130;
const elbowAngleStep = 5;

//  E 이동 제한 / E movement limits
const wristMinAngle = 0;
const wristMaxAngle = 130;
const wristAngleStep = 5;

// 각 직육면체 길이 / Length of each cuboid
//const upperArmLength = 0.55;
//const lowerArmLength = 0.45;
//const handLength = 0.25;
const UpperArmLengthDefault = 0.55;
const LowerArmLengthDefault = 0.45;
const HandLengthDefault = 0.25;
// 현재 길이, 변할수 있는 변수로 지정
let upperArmLength = UpperArmLengthDefault;
let lowerArmLength = LowerArmLengthDefault;
let handLength = HandLengthDefault;

// 직육면체 반두께 / Half thickness of the cuboids
// 힌지 위치 이동에 필요 / Needed for moving the hinge position
// const armThickness = 0.08;
const ArmThicknessDefault = 0.08;
let armThickness = ArmThicknessDefault;

// 각 직육면체의 단색 / Solid color of each cuboid
const upperArmColor = [1.0, 0.0, 0.0];   // 빨강 / red
const lowerArmColor = [1.0, 1.0, 0.0];   // 노랑 / yellow
const handColor = [0.0, 0.0, 1.0];       // 파랑 / blue


// Task : 읽고 이해하기 / Task: Read and understand
// ========================================
// 13. Cube 그리기 / Drawing a cube
// ========================================

// 
// world/view/projection은 고정하고 model과 color만 draw마다 갱신한다.
// world/view/projection stay fixed; only model and color are updated per draw.
function drawCube(modelMatrix, color) {
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    gl.uniform3fv(colorLocation, color);

    gl.drawElements(
        gl.TRIANGLES,
        index.length,
        gl.UNSIGNED_SHORT,
        0
    );
}


// #Task1 : Shoulder - upperArm 을 토대로 코드의 빈 칸을 작성하시오.
// #Task1: Fill in the blanks of the code based on Shoulder - upperArm.
// ========================================
// 14. Hierarchy를 이용한 로봇 팔 그리기 / Drawing the robot arm using a hierarchy
// ========================================

function drawRobotArm() {
    // ------------------------------------
    // 1) Shoulder frame
    // ------------------------------------
    // shoulder는 상완 형상과 elbow의 공통 부모 좌표계이다.
    // shoulder is the common parent coordinate frame of the upper arm geometry and the elbow.
    const shoulder = mat4.create();

    // 로봇 팔 전체 시작 위치 / Starting position of the whole robot arm
    mat4.translate(
        shoulder,
        shoulder,
        [-0.65, 0.0, 0.0]
    );

    // 어깨 관절 회전 / Shoulder joint rotation
    // Y축 world 회전이 없으므로 shoulderAngle 0도가 화면의 3시 방향이다.
    // Since there is no Y-axis world rotation, shoulderAngle 0 points to the 3 o'clock direction on screen.
    mat4.rotateZ(
        shoulder,
        shoulder,
        toRad(shoulderAngle)
    );

    // ------------------------------------
    // 2) Upper arm geometry
    // ------------------------------------
    // 부모 관절에 scale이 전달되지 않도록 복사본에만 적용한다.
    // Apply scale only to a copy so it is not passed on to the parent joint.
    const upperArm = mat4.clone(shoulder);

    // 정육면체 중심을 상완의 중앙으로 이동한다.
    // Move the cube center to the middle of the upper arm.
    mat4.translate(
        upperArm,
        upperArm,
        [upperArmLength / 2, 0.0, 0.0]
    );

    // 한 변 길이 2인 정육면체를 상완 직육면체로 변경한다.
    // Turn the cube with edge length 2 into the upper arm cuboid.
    mat4.scale(
        upperArm,
        upperArm,
        [upperArmLength / 2, armThickness, armThickness]
    );

    drawCube(upperArm, upperArmColor);

    // ------------------------------------
    // 3) Elbow frame
    // ------------------------------------
    // shoulder의 변환을 상속하여 팔꿈치 관절 좌표계를 만든다.
    // Inherit shoulder's transform to build the elbow joint coordinate frame.
    const elbow = mat4.clone(shoulder); // TODO: 기본값(임시) - 아래에 translate / rotateZ를 추가하세요 / TODO: temporary default - add translate / rotateZ below

    // [Pivot 보정] / [Pivot correction]
    // 기본 중심선이 아닌 상완 끝의 윗변을 회전축으로 사용하기 위해
    // To use the top edge of the upper arm's end as the rotation axis instead of the default center line,
    // X축으로 상완 길이만큼, Y축으로 armThickness만큼 이동한다.
    // translate by the upper arm length along X and by armThickness along Y.
    // 즉, 회전축의 방향(Z축)은 유지하고 pivot의 위치만 윗변으로 옮긴다.
    // In other words, the rotation axis direction (Z axis) is kept and only the pivot position moves to the top edge.
    mat4.translate(
        elbow,
        elbow,
        [upperArmLength, armThickness, 0]
    );
    mat4.rotateZ(
        elbow,
        elbow,
        toRad(elbowAngle)
    );

    // ------------------------------------
    // 4) Lower arm geometry
    // -----------------------------------
    // [Pivot 보정 복귀] / [Pivot correction return]
    // elbow의 원점은 윗변 힌지에 있으므로,
    // The origin of elbow is at the top-edge hinge, so
    // 하완의 중심선을 맞추기 위해 -armThickness만큼 다시 내려온다.
    // move back down by -armThickness to align the center line of the lower arm.

    const lowerFrame = mat4.clone(elbow); // TODO: 기본값(임시) - Pivot 복귀 translate를 추가하세요 
    // / TODO: temporary default - add the pivot-return translate
    
    // lowerFrame을 기준으로 실제 하완 geometry를 만든다.
    // Build the actual lower arm geometry based on lowerFrame.
    // geometry에만 위치 보정과 scale을 적용하여
    // Apply the position offset and scale only to the geometry
    // scale이 wrist에 상속되지 않도록 한다.
    // so that the scale is not inherited by the wrist.
    mat4.translate(
        lowerFrame,
        lowerFrame,
        [0, -armThickness, 0]
    );

    const lowerArm = mat4.clone(lowerFrame); // TODO: 기본값(임시, 상완과 겹쳐 보임) - lowerFrame 기준으로 직접 작성하세요 
    // / TODO: temporary default (overlaps the upper arm) - write it yourself based on lowerFrame
    mat4.translate(
        lowerArm,
        lowerArm,
        [lowerArmLength / 2, 0.0, 0.0]
    );
    mat4.scale(
        lowerArm,
        lowerArm,
        [lowerArmLength / 2, armThickness, armThickness]
    );
    
    drawCube(lowerArm, lowerArmColor);

    // ------------------------------------
    // 5) Wrist frame
    // ------------------------------------
    // wrist는 lowerFrame의 움직임을 상속한다.
    // wrist inherits the motion of lowerFrame.
    const wrist = mat4.clone(lowerFrame) // TODO: 기본값(임시) - translate / rotateZ를 추가하세요 
    mat4.translate(
        wrist,
        wrist,
        [lowerArmLength, armThickness, 0]
    );
    mat4.rotateZ(
        wrist,
        wrist,
        toRad(wristAngle)
    );
    // ------------------------------------
    // 6) Hand geometry
    // ------------------------------------
    const handFrame = mat4.clone(wrist) // TODO: 기본값(임시) - Pivot 복귀 translate / rotateX를 추가하세요 
    mat4.translate(
        handFrame,
        handFrame,
        [0, -armThickness, 0]
    );
    mat4.rotateX(
        handFrame,
        handFrame,
        toRad(wristSpinAngle)
    );

    const hand = mat4.clone(handFrame); // TODO: 기본값(임시, 상완과 겹쳐 보임) - handFrame 기준으로 직접 작성하세요 
    mat4.translate(
        hand,
        hand,
        [handLength / 2, 0.0, 0.0]
    );
    mat4.scale(
        hand,
        hand,
        [handLength / 2, armThickness, armThickness]
    );
    
    drawCube(hand, handColor);
}


// ========================================
// 15. Render
// ========================================

function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
    );
    drawRobotArm();
}


// #Task 2 : 로봇팔의 키보드 이벤트를 처리하세요.
// #Task 2: Handle the keyboard events of the robot arm.
// 
// ========================================
// 16. Keyboard Event
// ========================================

window.addEventListener("keydown", function(event) {
    if (event.key === "q") {
        shoulderAngle = Math.min(
            shoulderAngle + shoulderAngleStep,
            shoulderMaxAngle
        );
    }

    if (event.key === "a") {
        shoulderAngle = Math.max(
            shoulderAngle - shoulderAngleStep,
            shoulderMinAngle
        );
    }

    if (event.key === "w") {
        elbowAngle = Math.min(
            elbowAngle + elbowAngleStep,
            elbowMaxAngle
        );
    }

    if (event.key === "s") {
        elbowAngle = Math.max(
            elbowAngle - elbowAngleStep,
            elbowMinAngle
        );
    }

    if (event.key === "e") {
        wristAngle = Math.min(
            wristAngle + wristAngleStep,
            wristMaxAngle
        );
    }

    if (event.key === "d") {
        wristAngle = Math.max(
            wristAngle - wristAngleStep,
            wristMinAngle
        );
    }

    if (event.key === "t") {
        wristSpinAngle = (wristSpinAngle + wristSpinAngleStep) % 360
    }

    if (event.key === "g"){
        // 각 부분 1%씩 증가, 최대 2배
        upperArmLength = Math.min(upperArmLength * 1.01, UpperArmLengthDefault * 2);
        lowerArmLength = Math.min(lowerArmLength * 1.01, LowerArmLengthDefault * 2);
        handLength = Math.min(handLength * 1.01, HandLengthDefault * 2);
        armThickness = Math.min(armThickness * 1.01, ArmThicknessDefault * 2);
    }


    if (event.key === "r") {
        shoulderAngle = 0;
        elbowAngle = elbowMinAngle;
        wristAngle = wristMinAngle;
        wristSpinAngle = 0;
        // 추가된 부분, 팔 길이를 되돌림
        upperArmLength = UpperArmLengthDefault;
        lowerArmLength = LowerArmLengthDefault;
        handLength = HandLengthDefault;
        armThickness = ArmThicknessDefault;
    }

    render();
});


// ========================================
// 17. 최초 화면 출력 / Initial screen output
// ========================================

render();

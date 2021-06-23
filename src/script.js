import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const gltfLoader = new GLTFLoader();

let mixer = null;

let leftShoulder = null;
let rightShoulder = null;
let leftElbow = null;
let rightElbow = null;

let wallOne = null;
let wallTwo = null;
let wallThree = null;
let wallFour = null;
let wallFive = null;

gltfLoader.load('/models/RiggedFigure.glb', (gltf) => {
  leftShoulder = gltf.scene.getObjectByName('arm_joint_L_1');
  rightShoulder = gltf.scene.getObjectByName('arm_joint_R_1');
  leftElbow = gltf.scene.getObjectByName('arm_joint_L_2');
  rightElbow = gltf.scene.getObjectByName('arm_joint_R_2');

  gui
    .add(leftShoulder.rotation, 'x', -Math.PI, Math.PI, 0.01)
    .name('leftShoulderX');
  gui
    .add(leftShoulder.rotation, 'y', -Math.PI, Math.PI, 0.01)
    .name('leftShoulderY');
  gui
    .add(leftShoulder.rotation, 'z', -Math.PI, Math.PI, 0.01)
    .name('leftShoulderZ');
  gui
    .add(rightShoulder.rotation, 'x', -Math.PI, Math.PI, 0.01)
    .name('rightShoulderX');
  gui
    .add(rightShoulder.rotation, 'y', -Math.PI, Math.PI, 0.01)
    .name('rightShoulderY');
  gui
    .add(rightShoulder.rotation, 'z', -Math.PI, Math.PI, 0.01)
    .name('rightShoulderZ');

  gui.add(leftElbow.rotation, 'x', -Math.PI, Math.PI, 0.01).name('leftElbowX');
  gui.add(leftElbow.rotation, 'y', -Math.PI, Math.PI, 0.01).name('leftElbowY');
  gui.add(leftElbow.rotation, 'z', -Math.PI, Math.PI, 0.01).name('leftElbowZ');
  gui
    .add(rightElbow.rotation, 'x', -Math.PI, Math.PI, 0.01)
    .name('rightElbowX');
  gui
    .add(rightElbow.rotation, 'y', -Math.PI, Math.PI, 0.01)
    .name('rightElbowY');
  gui
    .add(rightElbow.rotation, 'z', -Math.PI, Math.PI, 0.01)
    .name('rightElbowZ');

  scene.add(gltf.scene);

  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
});

gltfLoader.load('/models/Walls1.glb', (gltf) => {
  wallOne = gltf.scene;
  wallOne.position.z += 20;
  scene.add(wallOne);
});

gltfLoader.load('/models/Walls2.glb', (gltf) => {
  wallTwo = gltf.scene;
  wallTwo.position.z += 40;
  scene.add(wallTwo);
});

gltfLoader.load('/models/Walls3.glb', (gltf) => {
  wallThree = gltf.scene;
  wallThree.position.z += 60;
  scene.add(wallThree);
});

gltfLoader.load('/models/Walls4.glb', (gltf) => {
  wallFour = gltf.scene;
  wallFour.position.z += 80;
  scene.add(wallFour);
});

gltfLoader.load('/models/Walls5.glb', (gltf) => {
  wallFive = gltf.scene;
  wallFive.position.z += 100;
  scene.add(wallFive);
});

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial({
//     color: '#444444',
//     metalness: 0,
//     roughness: 0.5
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  mag: 2
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  const aspectRatio = sizes.width / sizes.height;
  camera.left = -2 * aspectRatio;
  camera.right = 2 * aspectRatio;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  1,
  20
);
const properties = {
  x: 0,
  y: 1,
  z: 0
};
camera.position.set(0, 1.5, -5);
camera.lookAt(new THREE.Vector3(0, 0.5, 0));
scene.add(camera);
gui.add(camera.position, 'x', -3, 3, 0.01).name('camera x');
gui.add(camera.position, 'y', -3, 3, 0.01).name('camera y');
gui.add(camera.position, 'z', -10, -1, 0.01).name('camera z');
gui
  .add(properties, 'x', -3, 3, 0.01)
  .name('look at x')
  .onChange(() => {
    camera.lookAt(new THREE.Vector3(properties.x, properties.y, properties.z));
  });
gui
  .add(properties, 'y', -3, 3, 0.01)
  .name('look at y')
  .onChange(() => {
    camera.lookAt(new THREE.Vector3(properties.x, properties.y, properties.z));
  });
gui
  .add(properties, 'z', -3, 3, 0.01)
  .name('look at z')
  .onChange(() => {
    camera.lookAt(new THREE.Vector3(properties.x, properties.y, properties.z));
  });

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0.75, 0);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
let wallIdx = 0;

const tick = () => {
  const walls = [wallOne, wallTwo, wallThree, wallFour, wallFive];
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  for (const wall of walls) {
    if (wall) {
      wall.position.z -= deltaTime * 5;
    }
  }

  if (wallIdx < walls.length && walls[wallIdx]) {
    const curWall = walls[wallIdx];
    if (curWall.position.z <= 5) {
      switch (curWall) {
        case wallOne:
          gsap.to(leftShoulder.rotation, { duration: 1, x: 1.25 });
          gsap.to(leftShoulder.rotation, { duration: 1, y: 0 });
          gsap.to(leftShoulder.rotation, { duration: 1, z: -1.59 });
          gsap.to(rightShoulder.rotation, { duration: 1, x: -2.06 });
          gsap.to(rightShoulder.rotation, { duration: 1, y: 0.05 });
          gsap.to(rightShoulder.rotation, { duration: 1, z: 1.54 });
          break;
        case wallTwo:
          gsap.to(leftShoulder.rotation, { duration: 1, x: 1.25 });
          gsap.to(leftShoulder.rotation, { duration: 1, y: -0.77 });
          gsap.to(leftShoulder.rotation, { duration: 1, z: -1.65 });
          gsap.to(rightShoulder.rotation, { duration: 1, x: -1.93 });
          gsap.to(rightShoulder.rotation, { duration: 1, y: -0.63 });
          gsap.to(rightShoulder.rotation, { duration: 1, z: 1.41 });
          break;
        case wallThree:
          gsap.to(leftShoulder.rotation, { duration: 1, x: -0.29 });
          gsap.to(leftShoulder.rotation, { duration: 1, y: 0 });
          gsap.to(leftShoulder.rotation, { duration: 1, z: -1.59 });
          gsap.to(rightShoulder.rotation, { duration: 1, x: -2.75 });
          gsap.to(rightShoulder.rotation, { duration: 1, y: 0.05 });
          gsap.to(rightShoulder.rotation, { duration: 1, z: 1.68 });
          gsap.to(leftElbow.rotation, { duration: 1, x: -0.16 });
          gsap.to(leftElbow.rotation, { duration: 1, y: 0.27 });
          gsap.to(leftElbow.rotation, { duration: 1, z: 1.61 });
          gsap.to(rightElbow.rotation, { duration: 1, x: 2.02 });
          gsap.to(rightElbow.rotation, { duration: 1, y: -0.53 });
          gsap.to(rightElbow.rotation, { duration: 1, z: 1.07 });
          break;
        case wallFour:
          gsap.to(leftShoulder.rotation, { duration: 1, x: 2.63 });
          gsap.to(leftShoulder.rotation, { duration: 1, y: 0 });
          gsap.to(leftShoulder.rotation, { duration: 1, z: -1.76 });
          gsap.to(rightShoulder.rotation, { duration: 1, x: 0.18 });
          gsap.to(rightShoulder.rotation, { duration: 1, y: -0.38 });
          gsap.to(rightShoulder.rotation, { duration: 1, z: 1.61 });
          gsap.to(leftElbow.rotation, { duration: 1, x: -0.16 });
          gsap.to(leftElbow.rotation, { duration: 1, y: 0.27 });
          gsap.to(leftElbow.rotation, { duration: 1, z: 1.61 });
          gsap.to(rightElbow.rotation, { duration: 1, x: 2.02 });
          gsap.to(rightElbow.rotation, { duration: 1, y: -0.29 });
          gsap.to(rightElbow.rotation, { duration: 1, z: 1.07 });
          break;
        case wallFive:
          gsap.to(leftShoulder.rotation, { duration: 1, x: 1.25 });
          gsap.to(leftShoulder.rotation, { duration: 1, y: -1.38 });
          gsap.to(leftShoulder.rotation, { duration: 1, z: -1.65 });
          gsap.to(rightShoulder.rotation, { duration: 1, x: -2.34 });
          gsap.to(rightShoulder.rotation, { duration: 1, y: -1.32 });
          gsap.to(rightShoulder.rotation, { duration: 1, z: 1.09 });
          gsap.to(leftElbow.rotation, { duration: 1, x: -0.08 });
          gsap.to(leftElbow.rotation, { duration: 1, y: 0.27 });
          gsap.to(leftElbow.rotation, { duration: 1, z: 0.57 });
          gsap.to(rightElbow.rotation, { duration: 1, x: 2.64 });
          gsap.to(rightElbow.rotation, { duration: 1, y: -0.53 });
          gsap.to(rightElbow.rotation, { duration: 1, z: 2.51 });
          break;
        default:
          break;
      }
      wallIdx += 1;
    }
  }
  if (wallIdx > 0 && walls[wallIdx - 1].position.z < -1) {
    gsap.to(leftShoulder.rotation, { duration: 1, x: 1.25 });
    gsap.to(leftShoulder.rotation, { duration: 1, y: -1.2 });
    gsap.to(leftShoulder.rotation, { duration: 1, z: -1.65 });
    gsap.to(rightShoulder.rotation, { duration: 1, x: -2.29 });
    gsap.to(rightShoulder.rotation, { duration: 1, y: -1.14 });
    gsap.to(rightShoulder.rotation, { duration: 1, z: 0.97 });
    gsap.to(leftElbow.rotation, { duration: 1, x: -0.08 });
    gsap.to(leftElbow.rotation, { duration: 1, y: 0.27 });
    gsap.to(leftElbow.rotation, { duration: 1, z: 0.57 });
    gsap.to(rightElbow.rotation, { duration: 1, x: 2.64 });
    gsap.to(rightElbow.rotation, { duration: 1, y: -0.53 });
    gsap.to(rightElbow.rotation, { duration: 1, z: 2.51 });
  }

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

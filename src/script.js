import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
let leftArm = null;
let rightArm = null;
let wallOne = null;
let wallTwo = null;
let wallThree = null;
let wallFour = null;
let wallFive = null;

gltfLoader.load('/models/RiggedFigure.glb', (gltf) => {
  leftArm = gltf.scene.getObjectByName('arm_joint_L_1');
  rightArm = gltf.scene.getObjectByName('arm_joint_R_1');
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
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (leftArm) {
    leftArm.rotation.y += Math.sin(elapsedTime) * 0.005;
  }
  if (rightArm) {
    rightArm.rotation.y += Math.sin(elapsedTime) * 0.005;
  }
  if (wallOne) {
    wallOne.position.z -= deltaTime * 1;
  }
  if (wallTwo) {
    wallTwo.position.z -= deltaTime * 1;
  }
  if (wallThree) {
    wallThree.position.z -= deltaTime * 1;
  }
  if (wallFour) {
    wallFour.position.z -= deltaTime * 1;
  }
  if (wallFive) {
    wallFive.position.z -= deltaTime * 1;
  }

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

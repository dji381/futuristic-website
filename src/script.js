import * as THREE from "three";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Debug
 */
const gui = new GUI();
gui.hide();
const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Model
 */
//Load Model
const loaderDiv = document.getElementById("loader");
const loadingTextElement = document.getElementById("loading");
let mixer;
let model;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/models/robot/scene.gltf",
  (gltf) => {
    gltf.scene.rotation.y = Math.PI * 0.15;
    gltf.scene.position.x = 0.5;
    scene.add(gltf.scene);
    model = gltf.scene;
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  },
  (xhr) => {
    let progressPercent = {
      value : 0
    }
    const tl = gsap.timeline();
    tl.to(progressPercent,{
      duration: 2,
      value: 100,
      onUpdate: ()=> loadingTextElement.innerText = `${Math.round(progressPercent.value)} %`
    })
    .to(progress, {
      width: '100%',
      duration: 2,
    },"<")
    .to(loaderDiv, {
        opacity: 0,
        duration: 1,
        onComplete: () => (loaderDiv.style.display = "none"),
      },"+=0.5");
  },
  (error) => {
    console.error("An error happened", error);
  }
);

// Base environment map
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/environmentMaps/0/1k.hdr', (environmentMap) =>
    {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping,
        scene.environment = environmentMap
    })

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const sections = document.querySelectorAll("section");
let sectionsHeigth = 0;
sections.forEach((section) => {
  sectionsHeigth += parseInt(section.offsetHeight);
});
sectionsHeigth = sectionsHeigth / sections.length;
window.addEventListener("resize", () => {
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

//Camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const cameraParameters = {
  x: 0,
  y: 4.5,
  z: 8,
};
if (window.innerWidth < 1024 && window.innerWidth > 650) {
  cameraParameters.x = -1;
  cameraParameters.y = 2;
  cameraParameters.z = 16;
}
if (window.innerWidth < 650) {
  cameraParameters.x = 0;
  cameraParameters.y = 4;
  cameraParameters.z = 6;
}
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = cameraParameters.z;
camera.position.y = cameraParameters.y;
const cameraFolder = gui.addFolder("Camera");
cameraFolder
  .add(cameraParameters, "x")
  .step(1)
  .min(-20)
  .max(20)
  .onChange(() => {
    camera.position.set(
      cameraParameters.x,
      cameraParameters.y,
      cameraParameters.z
    );
  });
cameraFolder
  .add(cameraParameters, "y")
  .step(1)
  .min(-20)
  .max(20)
  .onChange(() => {
    camera.position.set(
      cameraParameters.x,
      cameraParameters.y,
      cameraParameters.z
    );
  });
cameraFolder
  .add(cameraParameters, "z")
  .step(1)
  .min(-20)
  .max(20)
  .onChange(() => {
    camera.position.set(
      cameraParameters.x,
      cameraParameters.y,
      cameraParameters.z
    );
  });
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Scroll animation
 */
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});
//parallax
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});
/**
 * Animate
 */
let previousTime = 0;
const render = (time) => {
  const deltaTime = time - previousTime;
  previousTime = time;
  if (mixer) {
    mixer.update(deltaTime * 0.001);
  }
  if (model) {
    model.rotation.y += (parseFloat(cursor.x) - model.rotation.y) * 0.02;
  }
  //Animate the camra
  camera.position.y = (-scrollY / sectionsHeigth) * 3.5 + cameraParameters.y;
  // Render
  renderer.render(scene, camera);

  // Call render again on the next frame
  requestAnimationFrame(render);
};

requestAnimationFrame(render);

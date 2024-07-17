import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP
 */
gsap.registerPlugin(ScrollTrigger);
// Create the ScrollTrigger
ScrollTrigger.create({
    trigger: ".about-container",
    start: "top top",
    onEnter: () => {
        gsap.set(".webgl", {
            position: "absolute",
            top: "0px",
            left: "0px"
        });
    },
    onLeaveBack: () => {
        gsap.set(".webgl", {
            position: "fixed",
            top: "10px",
            left: "10px"
        });
    }
});
 // Split text into words and wrap each word in a span
 const text = document.querySelector('.about-paralax p');
 text.innerHTML = text.textContent.split(' ').map(word => `<span>${word}</span>`).join(' ');

 // Create the ScrollTrigger
 gsap.fromTo(".about-paralax span", 
     { opacity: 0 }, 
     { 
         opacity: 1, 
         duration: 1, 
         stagger: 0.1, 
         scrollTrigger: {
             trigger: ".about-paralax",
             start: "top 80%",
             end: "top top",
             scrub: true
         }
     }
 );

/**
 * Debug
 */
const gui = new GUI()
gui.hide();
const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//helper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
//Load Model
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/robot/scene.gltf',(gltf)=>{
    console.log(gltf)
    gltf.scene.rotation.y = Math.PI * 0.15
    gltf.scene.position.x = 0.5
    scene.add(gltf.scene)
})

/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,5);
scene.add(directionalLight)

//light helper
const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( directionalLightHelper );
const directionalLightParameters = { 
    x: 0,
    y: -2,
    z: 3,
    rotationX: 1,
    rotationY: 0,
    rotationZ: 0,
    color: "#ffffff"
}
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLight.position.y = directionalLightParameters.y;
directionalLight.position.z = directionalLightParameters.z;

directionalLight.rotation.x = directionalLightParameters.rotationX
//directional light gui position
directionalLightFolder.add(directionalLightParameters, 'x').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.position.set(directionalLightParameters.x,directionalLightParameters.y,directionalLightParameters.z)
}
)
directionalLightFolder.add(directionalLightParameters, 'y').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.position.set(directionalLightParameters.x,directionalLightParameters.y,directionalLightParameters.z)
}
)
directionalLightFolder.add(directionalLightParameters, 'z').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.position.set(directionalLightParameters.x,directionalLightParameters.y,directionalLightParameters.z)
}
)

//directionnal light gui rotation
directionalLightFolder.add(directionalLightParameters, 'rotationX').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.rotation.set(directionalLightParameters.rotationX,directionalLightParameters.rotationY,directionalLightParameters.rotationZ)
}
)
directionalLightFolder.add(directionalLightParameters, 'rotationY').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.rotation.set(directionalLightParameters.rotationX,directionalLightParameters.rotationY,directionalLightParameters.rotationZ)
}
)
directionalLightFolder.add(directionalLightParameters, 'rotationZ').step(1).min(-20).max(20).onChange(()=>{
    directionalLight.rotation.set(directionalLightParameters.rotationX,directionalLightParameters.rotationY,directionalLightParameters.rotationZ)
}
)

directionalLightFolder.addColor(directionalLightParameters, 'color').onChange(()=>{
    directionalLight.color.set(directionalLightParameters.color)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

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
    z: 8
};
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = cameraParameters.z
camera.position.y = cameraParameters.y
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(cameraParameters, 'x').step(1).min(-20).max(20).onChange(()=>{
    camera.position.set(cameraParameters.x,cameraParameters.y,cameraParameters.z)
}
)
cameraFolder.add(cameraParameters, 'y').step(1).min(-20).max(20).onChange(()=>{
    camera.position.set(cameraParameters.x,cameraParameters.y,cameraParameters.z)
}
)
cameraFolder.add(cameraParameters, 'z').step(1).min(-20).max(20).onChange(()=>{
    camera.position.set(cameraParameters.x,cameraParameters.y,cameraParameters.z)
}
)
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha(0);

/**
 * Scroll animation
 */
let scrollY = window.scrollY
window.addEventListener('scroll',()=>{
    scrollY = window.scrollY
})
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Animate the camra
    camera.position.y = - scrollY / sizes.height * 3.5 + cameraParameters.y
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
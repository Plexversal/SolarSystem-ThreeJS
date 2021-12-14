import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import { EffectComposer } from '/jsm/postprocessing/EffectComposer.js'
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { RenderPass } from '/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from '/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from '/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from '/jsm/libs/dat.gui.module.js';

//import * as THREE from 'three';



const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 2000000)
camera.position.set(3000, 1000, 0)
camera.lookAt(scene.position)

camera.rotation.order = "YXZ"
camera.rotation.y = 180;
camera.rotation.z = 0;
camera.rotation.x = 0;

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#000000')

document.getElementById('canvas-container').appendChild(renderer.domElement)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
})

let skyBoxArray = []

skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/px.png'), side: THREE.DoubleSide}))
skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/nx.png'), side: THREE.DoubleSide}))
skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/py.png'), side: THREE.DoubleSide}))
skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/ny.png'), side: THREE.DoubleSide}))
skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/pz.png'), side: THREE.DoubleSide}))
skyBoxArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/skyboxLow/nz.png'), side: THREE.DoubleSide}))

let skyBox = new THREE.Mesh(new THREE.BoxGeometry(250000, 250000, 250000), skyBoxArray)
skyBox.rotation.z = Math.PI / 2
scene.add(skyBox)

// create the lights

const pointlight1 = new THREE.PointLight(0xFFFFFF, 1.2, 60000)
pointlight1.position.set(0, 0, 0)
scene.add(pointlight1)

const ss = new THREE.AmbientLight( 0xffffbb, 0.1 );
scene.add( ss );

// create the planets

let planetsArray = []

// https://www.solarsystemscope.com/textures/

const sun = new THREE.Mesh(new THREE.SphereGeometry(695500 / 10000, 80, 80), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_sun.jpg'), emissive: 0xFFFF00}))
const mercury = new THREE.Mesh(new THREE.SphereGeometry(2439.7 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_mercury.jpg')}))
const venus = new THREE.Mesh(new THREE.SphereGeometry(6051.8 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_venus_atmosphere.jpg')}))
const earth = new THREE.Mesh(new THREE.SphereGeometry(6378.1 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_earth_daymap.jpg')}))
const mars = new THREE.Mesh(new THREE.SphereGeometry(3396.2 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_mars.jpg')}))
const jupiter = new THREE.Mesh(new THREE.SphereGeometry(71492 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_jupiter.jpg')}))
const saturn = new THREE.Mesh(new THREE.SphereGeometry(60268 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_saturn.jpg')}))
const uranus = new THREE.Mesh(new THREE.SphereGeometry(25559 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_uranus.jpg')}))
const neptune = new THREE.Mesh(new THREE.SphereGeometry(24764 / 1000, 80, 80), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('/images/solarsystemtextures/2k_neptune.jpg')}))

mercury.name = "mercury"
venus.name = "venus"
earth.name = "earth"
mars.name = "mars"
jupiter.name = "jupiter"
saturn.name = "saturn"
uranus.name = "uranus"
neptune.name = "neptune"
sun.name = "sun"

sun.position.set(0,0,0);
mercury.position.set(0.4 * 1000, 0, 0)
venus.position.set(0.7* 1000, 0, 0)
earth.position.set(1* 1000, 0, 0)
mars.position.set(1.5* 1000, 0, 0)
jupiter.position.set(5.2* 1000, 0, 0)
saturn.position.set(9.5* 1000, 0, 0)
uranus.position.set(19.8* 1000, 0, 0)
neptune.position.set(30.1* 1000, 0, 0)

scene.add(sun, mercury, venus, earth, mars, jupiter, uranus, neptune, saturn)
planetsArray.push(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune)

// staurn rings

let saturnRadius = saturn.geometry.parameters.radius
const saturnRings = new THREE.Mesh(new THREE.RingGeometry(saturnRadius * 2, saturnRadius * 1.38, 64), new THREE.MeshLambertMaterial( { color: 0xebebeb, transparent: true, opacity: 0.67, side: THREE.DoubleSide } ))
saturnRings.position.set(saturn.position.x, saturn.position.y, saturn.position.z)
saturnRings.rotation.x = 116 * (Math.PI / 180)

// axial tilts
sun.rotation.x = 7.25 * (Math.PI / 180)
mercury.rotation.x = 0.03 * (Math.PI / 180)
venus.rotation.x = 2.6 * (Math.PI / 180)
earth.rotation.x = 23.4 * (Math.PI / 180)
mars.rotation.x = 25.19 * (Math.PI / 180)
jupiter.rotation.x = 3.13 * (Math.PI / 180)
saturn.rotation.x = 26.73 * (Math.PI / 180)
uranus.rotation.x = 82.23 * (Math.PI / 180)
neptune.rotation.x = 57.54 * (Math.PI / 180)


scene.add(saturnRings)

// create the orbit paths

planetsArray.forEach(e => {
    const radius = e.position.x
    const ellipse = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, 0);
    const orbitCurve = new THREE.Line( new THREE.BufferGeometry().setFromPoints( ellipse.getPoints( 2000 ) ), new THREE.LineBasicMaterial( { color : 0x808080 } ) );
    orbitCurve.name = e.name
    orbitCurve.rotation.x = Math.PI / 2

    scene.add(orbitCurve)
})

document.getElementById('orbit-path').addEventListener('change', function() {
  if (this.checked) {
    scene.children.filter(e => e.type == `Line`).forEach(e => e.visible = true)
  } else {
    scene.children.filter(e => e.type == `Line`).forEach(e =>  e.visible = false)
  }
});

// const particles = 500000;
// const geometry = new THREE.BufferGeometry();
// const positions = [];
// const colors = [];
// const color = new THREE.Color();
// const n = 1000
// const n2 = n / 2; // particles spread in the cube

// const torus = new THREE.Mesh( new THREE.TorusGeometry( 12000, 900, 300, 300 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
// //scene.add( torus );

// for ( let i = 0; i < particles; i ++ ) {
//     // positions
//     const x =1
//     const y = 1
//     const z = 1

//     positions.push( x,y, z);
//     // colors
//     const vx = ( x / n ) + 0.5;
//     const vy = ( y / n ) + 0.5;
//     const vz = ( z / n ) + 0.5;

//     color.setRGB( vx, vy, vz );
//     colors.push( color.r, color.g, color.b );

// }
// console.log(torus.geometry.attributes.position.array)
// let linePos = scene.children.filter(o => o.name == "jupiter" && o.type == "Line")[0].geometry.attributes.position.array
// console.log(linePos)
// geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( linePos, 3 ) );
// geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
// geometry.computeBoundingSphere();

// const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );
// let points = new THREE.Points( geometry, material );
// points.rotation.x = Math.PI / 2
// scene.add( points );



let CameraType = ""

document.getElementById('planet-selector').childNodes.forEach(e => {
    if(e.nodeName.toLowerCase() == 'button'){
        e.addEventListener('mouseover', () => {

          function circle(radius, position) {
            const ellipse = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, 0);
            const orbitCurve = new THREE.Line( new THREE.BufferGeometry().setFromPoints( ellipse.getPoints( 2000 ) ), new THREE.LineBasicMaterial( { color : 0x808080 } ) );
            orbitCurve.position.set(position.x, position.y, position.z)
            orbitCurve.lookAt(camera.position)

            scene.add(orbitCurve)

            // filter this within render function and make it show
          }

          // circle on hover
          // scene.children.filter(o => o.name == 'mercury' && o.name == e.id && o.type == "Line").forEach(function(e){ 
          //   e.material = new THREE.LineBasicMaterial( { color : 0xc9d1d1 } )

          //   // base radius and position from child obj
          //   circle(40, mercury.position)
          // })
          scene.children.filter(o => o.name == 'venus' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0xffeaab } ))
          scene.children.filter(o => o.name == 'earth' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0x00b9e3 } ))
          scene.children.filter(o => o.name == 'mars' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0xf28500 } ))
          scene.children.filter(o => o.name == 'jupiter' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0xffc89c } ))
          scene.children.filter(o => o.name == 'saturn' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0xffeccc } ))
          scene.children.filter(o => o.name == 'uranus' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0x4fd9db } ))
          scene.children.filter(o => o.name == 'neptune' && o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0x3048ff } ))

        })
        e.addEventListener('mouseout', () => {
            scene.children.filter(o => o.name == e.id && o.type == "Line").forEach(e => e.material = new THREE.LineBasicMaterial( { color : 0x808080 } ))
        })
        e.addEventListener('click', () => {
            console.log(e.id)
            let obj = scene.children.filter(o => o.name == e.id && o.type == "Mesh")
            if(obj[0].geometry.parameters.radius > 20){
                camera.position.set(450, 50, 35)
                goal.add(camera)
                CameraType = e.id
            } else {
                camera.position.set(50, 10, 15)
                goal.add(camera)
                CameraType = e.id
            }

        })
    }
})

const dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
dirLight.position.set( 0, - 1, 0 ).normalize();
dirLight.color.setHSL( 0.1, 0.7, 0.5 );
scene.add( dirLight );

var dir = new THREE.Vector3;
var a = new THREE.Vector3;
var b = new THREE.Vector3;
let goal = new THREE.Object3D

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 10;
controls.maxDistance = 70000;
//controls.enablePan = false;

document.getElementById('fullscreen').addEventListener('click', e => {
    let elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { 
        elem.msRequestFullscreen();
      }

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { 
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
})

// const params = {
//   exposure: 1,
//   bloomStrength: 1.5,
//   bloomThreshold: 0,
//   bloomRadius: 0
// };
// const renderScene = new RenderPass( scene, camera );
// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;

// let composer = new EffectComposer( renderer );
// composer.addPass( renderScene );
// composer.addPass( bloomPass );

// const gui = new GUI();

// gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
//   renderer.toneMappingExposure = Math.pow( value, 4.0 );
// } );

// gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
//   bloomPass.threshold = Number( value );
// } );

// gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
//   bloomPass.strength = Number( value );
// } );

// gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
//   bloomPass.radius = Number( value );
// } );

// sun glow and lens flare
// planet glows
// plant moons
// asteroid belt
// ui, hover animations and planet info

// 60fps renderer
const render = () => {
    requestAnimationFrame(render)

    if(CameraType != "") {
        let obj = scene.children.filter(e => e.name == CameraType && e.type == "Mesh")
        a.lerp(obj[0].position, 0.4); 
        b.copy(goal.position); // changing b to goals position vector
        dir.copy( a ).sub( b ).normalize();
        const dis = a.distanceTo( b ) - 0.3;
        goal.position.addScaledVector( dir, dis );
        camera.lookAt( obj[0].position );
        controls.update()
    }
    renderer.render(scene, camera)
    sun.rotation.y += 0.005
    planetsArray.forEach(function (planet) {
        
        if(planet.name == "saturn") {
            planet.rotation.y += 0.005
            let distance = planet.position.distanceTo(sun.position).toFixed(1)
            let matrix = new THREE.Matrix4();
            matrix.makeRotationY((Math.PI) / (distance * 10));
            
            saturnRings.position.applyMatrix4(matrix)
            planet.position.applyMatrix4(matrix);
        } else {
            planet.rotation.y += 0.005
            let distance = planet.position.distanceTo(sun.position).toFixed(1)
            let matrix = new THREE.Matrix4();
            matrix.makeRotationY((Math.PI) / (distance * 10));
    
            planet.position.applyMatrix4(matrix);
        }



    })
  // composer.render();

}

render();

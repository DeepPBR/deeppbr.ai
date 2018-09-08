//if (!Detector.webgl ) Detector.addGetWebGLMessage();
const THREE = require('three');
const dat = require('dat.gui');

import { SpriteText2D, textAlign } from 'three-text2d'

var statsEnabled = false;

var container, stats, loader;

var camera, scene, renderer, controls;

var mesh;

var pointLight;
var spotLight;
//var lampBright;

var imageMapCurrent = 0

var settings = {
    metalness: 0.2,
    roughness: 1.3,
    lampIntensity: 0.75,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    displacementScale: 2.0, // 2.436143, // from original model
    normalScale: -0.7,
    mapImage: 0,
    diffuse_map: "00_delit.jpg",
    roughness_map: "00_rough.jpg",
    normal_map: "00_norms.jpg"

};

var material = new THREE.MeshStandardMaterial();
var materialSwap = new THREE.MeshStandardMaterial();
initGui();
init();
animate();

// function setImageMap() {
//    // mesh.scale.set( params.scale, params.scale, params.scale );
// }

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Init gui
function initGui() {
    var gui = new dat.GUI();
    //var gui = gui.addFolder( "Material" );
    
    gui.add( settings, "metalness" ).min( 0 ).max( 2 ).onChange( function( value ) {
        material.metalness = value;
    } );
    
    gui.add( settings, "roughness" ).min( 0 ).max( 2 ).onChange( function( value ) {
        material.roughness = value;
    } );

    gui.add( settings, "lampIntensity" ).min( 0 ).max( 10 ).onChange( function( value ) {
        pointLight.intensity = value;
    } );

    gui.add( settings, 'mapImage', 0, 8 ).step( 1 )
    .onChange( function( value )  {
    
        if (imageMapCurrent != value) {
            console.log("DIFFERENT");
            imageMapCurrent = value;


            var formated = pad(value, 2);      // 0010
            var dif = "_delit.jpg";
            var nrm = "_norms.jpg";
            var rog = "_rough.jpg";

            settings.diffuse_map   = formated.concat(dif);
            settings.normal_map    = formated.concat(nrm);
            settings.roughness_map = formated.concat(rog);
            var loader = new THREE.TextureLoader()
                        .setPath( './assets/img/examples/');

            materialSwap.map = loader.load(settings.diffuse_map);
            // roughness is in G channel, metalness is in B channel
            materialSwap.metalnessMap = material.roughnessMap = loader.load(settings.roughness_map); /// is this correct???
            materialSwap.normalMap = loader.load(settings.normal_map);
            material.map = materialSwap.map
            material.roughnessMap = material.roughnessMap = materialSwap.roughnessMap
            material.normalMap = materialSwap.normalMap

            // console.log(formated.concat(dif));
            // console.log(formated.concat(nrm));
            // console.log(formated.concat(rog));
        }
    });

    // gui.add( settings, "ambientIntensity" ).min( 0 ).max( 1 ).onChange( function( value ) {
    //  ambientLight.intensity = value;
    // } );
    // gui.add( settings, "envMapIntensity" ).min( 0 ).max( 3 ).onChange( function( value ) {
    //  material.envMapIntensity = value;
    // } );
    // gui.add( settings, "displacementScale" ).min( 0 ).max( 3.0 ).onChange( function( value ) {
    //  material.displacementScale = value;
    // } );

    gui.add( settings, "normalScale" ).min( -4 ).max( 3 ).onChange( function( value ) {
        material.normalScale.set( 1, -1 ).multiplyScalar( value );
    });

} // initGui

function hud() {

}

function init() {

    container = document.getElementById( "webgl_container" );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    
    var canvasWidth = container.offsetWidth;
    var canvasHeight = container.offsetHeight;
    renderer.setSize( canvasWidth, canvasHeight);


    container.appendChild( renderer.domElement );

    // reposition gui to top left of the webgl element 
    var gui = $( ".dg.ac" );
    gui.detach().appendTo($("#webgl_container"));
    gui.css("top", $("#webgl_container").css("top"));

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 2;
    camera.rotation.x = Math.PI / 0.5
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    //scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );
    pointLight = new THREE.PointLight( 0xffffff, settings.lampBright, 0 );
    pointLight.position.set(0,0,5);

    scene.add(pointLight);
    
    new THREE.OBJLoader()
        .setPath( './assets/webgl/geo/' )
        .load( 'plane.geo', function ( group ) {

            var loader = new THREE.TextureLoader()
                .setPath( './assets/img/examples/' );

            material.metalness = settings.metalness;
            material.roughness = settings.roughness;
            material.normalScale.set( 1, -1 ).multiplyScalar( settings.normalScale );

            material.map = loader.load(settings.diffuse_map);
            // roughness is in G channel, metalness is in B channel
            material.metalnessMap = material.roughnessMap = loader.load(settings.roughness_map); /// is this correct???
            material.normalMap = loader.load(settings.normal_map);

            material.map.wrapS = THREE.RepeatWrapping;
            material.roughnessMap.wrapS = THREE.RepeatWrapping;
            material.metalnessMap.wrapS = THREE.RepeatWrapping;
            material.normalMap.wrapS = THREE.RepeatWrapping;
            material.side = THREE.DoubleSide;

            group.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    child.material = material;

                }

            } );

            group.position.x = 0 ;
            group.rotation.y = 0 ; - Math.PI / 2;
            group.rotation.x = Math.PI / 2; 
            scene.add( group );

        } );

    var genCubeUrls = function( prefix, postfix ) {
        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];
    };


    if ( statsEnabled ) {

        stats = new Stats();
        container.appendChild( stats.dom );

    }

    setTimeout(onWindowResize, 100);

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'keydown', onKeyDown, true);
}

//

function onWindowResize( event ) {


    container = document.getElementById( "webgl_container" );
    var canvasWidth = container.offsetWidth;
    var canvasHeight = container.offsetHeight;
    renderer.setSize( canvasWidth, canvasHeight);

    camera.aspect = canvasWidth / canvasHeight; // window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

function onKeyDown( e ) {
                var maps = [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ];
                if ( e.keyCode === 65 ) {
                   console
                } else if ( e.keyCode === 83 ) {
                   console
                } else if ( e.keyCode === 68 ) {
                   console
                } else if ( e.keyCode === 70 ) {
                  console
                }
            }

    //

    function animate() {

        requestAnimationFrame( animate );

        controls.update();
        renderer.render( scene, camera );
                renderer.setClearColor( 0xB4B4B4, 1 );
        pointLight.position.x = camera.position.x;
        pointLight.position.y = camera.position.y;
        pointLight.position.z = camera.position.z;

        pointLight.rotation.x = camera.rotation.x;
        pointLight.rotation.y = camera.rotation.y;
        pointLight.rotation.z = camera.rotation.z;

        if ( statsEnabled ) stats.update();

    }
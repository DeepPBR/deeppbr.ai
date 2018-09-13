//if (!Detector.webgl ) Detector.addGetWebGLMessage();
const THREE = require('three');
const dat = require('dat.gui');

import { SpriteText2D, textAlign } from 'three-text2d'

var statsEnabled = false;

var container, stats, loader;

var camera, scene, renderer, controls;

var mesh;

var pointLight;
var directionalLight;
//var lampBright;
var sprite;

var imageMapCurrent = 0

var settings = {
    metalness: 0.2,
    roughness: 1.3,
    lampIntensity: 5, //0.75,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    dispScale: 2.0, // 2.436143, // from original model
    dispBias: 0.5, // -0.428408,
    normalScale: -0.7,
};

var defaults = {
    "07" : {
        metalness: 0.35,
        roughness: 0.8,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.2, // 2.436143, // from original model
        dispBias: -0.09, // -0.428408,
        normalScale: -0.7,
    },
    "01" : {
        metalness: 0.22,
        roughness: 0.9,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.1, // 2.436143, // from original model
        dispBias: 0.01, // -0.428408,
        normalScale: -0.7,
    },
    "02" : {
        metalness: 0.31,
        roughness: 0.8,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.2, // 2.436143, // from original model
        dispBias: 0.05, // -0.428408,
        normalScale: -0.94,
    },
    "03" : {
        metalness: 0.7,
        roughness: 0.9,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.2, // 2.436143, // from original model
        dispBias: -0.12, // -0.428408,
        normalScale: -0.64,
    },
    "05" : {
        metalness: 0.1,
        roughness: 0.7,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.1, // 2.436143, // from original model
        dispBias: -0.09, // -0.428408,
        normalScale: -0.64,
    },
    "06" : {
        metalness: 0.27,
        roughness: 0.8,
        lampIntensity: 5, //0.75,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        dispScale: 0.2, // 2.436143, // from original model
        dispBias: -0.12, // -0.428408,
        normalScale: -1.02,
    },
}

defaults["07"].lampIntensity = 6;


console.log(defaults["07"]);

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

    // start with gui closed
    gui.closed = true;
    
    gui.add( settings, "metalness" ).min( 0 ).max( 2 ).onChange( function( value ) {
        material.metalness = value;
    } );
    
    gui.add( settings, "roughness" ).min( 0 ).max( 2 ).onChange( function( value ) {
        material.roughness = value;
    } );

    gui.add( settings, "lampIntensity" ).min( 0 ).max( 2.1 ).onChange( function( value ) {
        directionalLight.intensity = value;
    } );

    gui.add( settings, "envMapIntensity" ).min( 0 ).max( 10 ).onChange( function( value ) {
        material.envMapIntensity = value;
    } );

    gui.add( settings, "dispScale" ).min( -3.0 ).max( 3.0 ).onChange( function( value ) {
        material.displacementScale = value;
    } );

    gui.add( settings, "dispBias" ).min( -3.0 ).max( 3.0 ).onChange( function( value ) {
        material.displacementBias = value;
    } );

    gui.add( settings, "normalScale" ).min( -4 ).max( 3 ).onChange( function( value ) {
        material.normalScale.set( 1, -1 ).multiplyScalar( value );
    });
    
    // gui.add( settings, "ambientIntensity" ).min( 0 ).max( 1 ).onChange( function( value ) {
    //  ambientLight.intensity = value;
    // } );

} // initGui

function hud() {

}

function init() {

    container = document.getElementById( "webgl_container" );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

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

    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMappingExposure = 3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMapSoft = true;
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 2;
    camera.rotation.x = Math.PI / 0.5
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    //scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );
    pointLight = new THREE.PointLight( 0xffffff, settings.lampBright, 0 );
    pointLight.position.set(0,0,4);
    pointLight.castShadow = true;
    pointLight.shadowCameraVisible = true;
        //Set up shadow properties for the light
    // light.shadow.mapSize.width = 512;  // default
    // light.shadow.mapSize.height = 512; // default
    // light.shadow.camera.near = 0.1;       // default
    // light.shadow.camera.far = 50;      // default

    scene.add(pointLight);

    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 5);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.intensity = 0.5; 
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;
     
    directionalLight.shadowCameraNear = 0;
    directionalLight.shadowCameraFar = 15;
     
    directionalLight.shadowCameraLeft = -5;
    directionalLight.shadowCameraRight = 5;
    directionalLight.shadowCameraTop = 5;
    directionalLight.shadowCameraBottom = -5;
     
    scene.add(directionalLight);

    sprite = new SpriteText2D("Zoom back in", { align: textAlign.center,  font: '140px Arial', fillStyle: '#00ff00' , antialias: false })
    sprite.position.z = 60;

    scene.add(sprite)

    
    new THREE.OBJLoader()
        .setPath( './assets/webgl/geo/' )
        .load( 'plane_sub_div_40.geo', function ( group ) {

            set_source_image("07");

            material.map.wrapS = THREE.RepeatWrapping;
            material.roughnessMap.wrapS = THREE.RepeatWrapping;
            material.metalnessMap.wrapS = THREE.RepeatWrapping;
            material.normalMap.wrapS = THREE.RepeatWrapping;
            material.side = THREE.DoubleSide;

            group.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                }
            });

            group.position.x = 0 ;
            group.rotation.y = 0 ; - Math.PI / 2;
            group.rotation.x = Math.PI / 2; 

            group.castShadow = true;

            var geometry2 = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
            var material2 = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.BackSide});
            var sphere = new THREE.Mesh(geometry2, material2);
            //sphere.receiveShadow = true
            sphere.castShadow = true

            var geo = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
            var mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
            var shadowPlane = new THREE.Mesh(geo, mat);
            shadowPlane.position.x = 4.0;
            shadowPlane.castShadow = true;
            //shadowPlane.receiveShadow = true;

            var groundGeo = new THREE.SphereGeometry(0.1, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2);
            var groundMat = new THREE.MeshPhongMaterial( {color: 0x444444, side: THREE.BackSide});
            var groundNode = new THREE.Mesh(groundGeo, groundMat);
            groundNode.receiveShadow = false

            groundNode.position.z = 0;

            //scene.add(groundNode);
            scene.add(sphere);
            scene.add( group );
            //scene.add(shadowPlane);


        } );


    if ( statsEnabled ) {

        stats = new Stats();
        container.appendChild( stats.dom );

    }

    setTimeout(onWindowResize, 100);

    window.addEventListener( 'resize', onWindowResize, false );
    //window.addEventListener( 'keydown', onKeyDown, true);
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

function animate() {

    requestAnimationFrame( animate );

    controls.update();
    renderer.render( scene, camera );
    renderer.setClearColor( 0x808080, 1 );
    // pointLight.position.x = camera.position.x;
    // pointLight.position.y = camera.position.y;
    // pointLight.position.z = camera.position.z;

    // pointLight.rotation.x = camera.rotation.x;
    // pointLight.rotation.y = camera.rotation.y;
    // pointLight.rotation.z = camera.rotation.z;


    directionalLight.position.x = camera.position.x;
    directionalLight.position.y = camera.position.y;
    directionalLight.position.z = camera.position.z;

    directionalLight.rotation.x = camera.rotation.x;
    directionalLight.rotation.y = camera.rotation.y;
    directionalLight.rotation.z = camera.rotation.z;

    sprite.position.y = camera.position.y;
    sprite.position.z = camera.position.z;

    sprite.rotation.x = camera.rotation.x;
    sprite.rotation.y = camera.rotation.y;
    sprite.rotation.z = camera.rotation.z;

    if ( statsEnabled ) stats.update();

}


function set_source_image( src_id )  {
    
    console.log("set_source_image: " + src_id);
    
    var diffuse_map   = src_id + "_delit.jpg";
    var normal_map    = src_id + "_norms.jpg";
    var roughness_map = src_id + "_rough.jpg";
    var displacement_map = src_id + "_disp.jpg";

    var loader = new THREE.TextureLoader()
                .setPath( './assets/img/examples/');

    var new_defaults = defaults[src_id];
    if (!(new_defaults)) 
        throw "You need to define some defaults[src_id] for src_id:" + src_id;

    // update settings (for gui)
    Object.assign(settings, new_defaults);
    
    // update actual material 
    material.metalness = settings.metalness;
    material.roughness = settings.roughness;
    material.normalScale.set( 1, -1 ).multiplyScalar( settings.normalScale );
    material.displacementScale = settings.dispScale;
    material.displacementBias = settings.dispBias;
   
    // ?? is this the right light?
    directionalLight.lampIntensity = settings.lampIntensity;
    console.log("lampIntensity " + settings.lampIntensity);
    // ???.aoMapIntensity = default_setting.aoMapIntensity;
    // ???.envMapIntensity = default_setting.envMapIntensity;
    

    // load into the swap first (not sure this helps though!)
    materialSwap.map = loader.load(diffuse_map);
    materialSwap.normalMap = loader.load(normal_map);
    materialSwap.displacementMap = loader.load(displacement_map);
    materialSwap.roughnessMap = loader.load(roughness_map);
    materialSwap.metalnessMap = materialSwap.roughnessMap;

    // swap in the actual image
    material.normalMap = materialSwap.normalMap;
    material.displacementMap = materialSwap.displacementMap;
    material.roughnessMap =materialSwap.roughnessMap;
    material.metalnessMap = materialSwap.roughnessMap;
    material.map = materialSwap.map;

    animate();

}

module.exports = {
  set_source_image: function(src_id) {
        set_source_image(src_id);
  }
};

// ideally we'd put this in app.js but stupid whatever doesnt work so whack it in here for now

(function($) {
    "use strict"; // Start of use strict
    const regex = /(\d\d)_base/;

    $(".select-source a").click(function(evt) {
        var str = evt.target.src;
        var match = str.match(regex)[1];
        if (match) {
            var src_id = pad(parseInt(match), 2); // 01
            set_source_image(src_id);

            $(".src_base img").attr("src", "assets/img/examples/" + src_id + "_base.jpg"); 
            $(".src_base").attr("href", "assets/img/examples/" + src_id + "_base.jpg"); 

            $(".src_norms img").attr("src", "assets/img/examples/" + src_id + "_norms.jpg"); 
            $(".src_norms").attr("href", "assets/img/examples/" + src_id + "_norms.jpg"); 

            $(".src_rough img").attr("src", "assets/img/examples/" + src_id + "_rough.jpg"); 
            $(".src_rough").attr("href", "assets/img/examples/" + src_id + "_rough.jpg"); 

            $(".src_disp img").attr("src", "assets/img/examples/" + src_id + "_disp.jpg"); 
            $(".src_disp").attr("href", "assets/img/examples/" + src_id + "_disp.jpg"); 

            $(".src_delit img").attr("src", "assets/img/examples/" + src_id + "_delit.jpg"); 
            $(".src_delit").attr("href", "assets/img/examples/" + src_id + "_delit.jpg"); 
        }
        
    
        evt.preventDefault();
    })

})(jQuery); // End of use strict


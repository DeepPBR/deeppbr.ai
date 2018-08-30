//if (!Detector.webgl ) Detector.addGetWebGLMessage();
    var THREE = require('three');

    var statsEnabled = false;

    var container, stats, loader;

    var camera, scene, renderer, controls;

    var mesh;

    var pointLight;

    //var lampBright;

    var settings = {
        metalness: 0.0,
        roughness: 0.4,
        lampIntensity: 3,
        aoMapIntensity: 1.0,
        envMapIntensity: 1.0,
        displacementScale: 2.436143, // from original model
        normalScale: 1.0
    };




    //initGui();
    init();
    animate();
    
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
        // gui.add( settings, "ambientIntensity" ).min( 0 ).max( 1 ).onChange( function( value ) {
        //  ambientLight.intensity = value;
        // } );
        // gui.add( settings, "envMapIntensity" ).min( 0 ).max( 3 ).onChange( function( value ) {
        //  material.envMapIntensity = value;
        // } );
        // gui.add( settings, "displacementScale" ).min( 0 ).max( 3.0 ).onChange( function( value ) {
        //  material.displacementScale = value;
        // } );
        gui.add( settings, "normalScale" ).min( - 1 ).max( 2 ).onChange( function( value ) {
            material.normalScale.set( 1, -1 ).multiplyScalar( value );
        } );
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

        //

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 1000 );
        camera.position.z = 2;
        camera.rotation.x = Math.PI / 0.5

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        //

        //scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );
        pointLight = new THREE.PointLight( 0xffffff, settings.lampBright, 0 );
        pointLight.position.set(0,0,5);

        // var backLight = new THREE.PointLight(0xffffff, 3, 0);
        // pointLight.position.set(0,0,-5);

        scene.add(pointLight);
        //scene.add(backLight);



        //

        new THREE.CubeTextureLoader()
            .setPath( './assets/webgl/textures/cube/pisa/' )
            .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ], function ( textureCube ) {

                scene.background = textureCube;

            } );

        //

        material = new THREE.MeshStandardMaterial();

        new THREE.OBJLoader()
            .setPath( './assets/webgl/geo/' )
            .load( 'plane.obj', function ( group ) {

                var loader = new THREE.TextureLoader()
                    .setPath( './assets/webgl/textures/demo_textures/' );

                material.roughness = 0.75; // attenuates roughnessMap
                material.metalness = 1.0; // attenuates metalnessMap

                material.map = loader.load( 'ceil_4_diffuse.jpg' );
                // roughness is in G channel, metalness is in B channel
                material.metalnessMap = material.roughnessMap = loader.load( 'ceil_4_roughness.jpg' );
                material.normalMap = loader.load( 'ceil_4_normals.jpg' );

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

                group.position.x = - 0.45;
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

        var hdrUrls = genCubeUrls( './assets/webgl/textures/cube/pisaHDR/', '.hdr' );
        new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrUrls, function ( hdrCubeMap ) {

            var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
            pmremGenerator.update( renderer );

            var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
            pmremCubeUVPacker.update( renderer );

            var hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

            //material.envMap = hdrCubeRenderTarget.texture;
            material.needsUpdate = true; // is this needed?

            hdrCubeMap.dispose();
            pmremGenerator.dispose();
            pmremCubeUVPacker.dispose();

        } );

        //

        if ( statsEnabled ) {

            stats = new Stats();
            container.appendChild( stats.dom );

        }

        window.addEventListener( 'resize', onWindowResize, false );

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

    //

    function animate() {

        requestAnimationFrame( animate );

        controls.update();
        renderer.render( scene, camera );

        if ( statsEnabled ) stats.update();

    }
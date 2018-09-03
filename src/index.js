// css
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// proper sass stuff
import "./assets/css/main.scss";

// quick hacks in css 
import "./assets/css/dpr.css";

// images we need to be sure to include in deployed distribution
import "./assets/img/bg-masthead.jpg";

// js - libraries
import "bootstrap"; //magic! i dunno
import "../node_modules/tether/dist/js/tether.js";
import "../node_modules/jquery.easing/jquery.easing.min.js";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

// ease in, ease out menus stuff
import "./assets/js/grayscale.js";

// webgl includes needed
import "three"

import "./assets/webgl/js/controls/OrbitControls.js"
import "./assets/webgl/js/loaders/OBJLoader.js"
import "./assets/webgl/js/loaders/RGBELoader.js"
import "./assets/webgl/js/loaders/HDRCubeTextureLoader.js"

import "./assets/webgl/js/pmrem/PMREMGenerator.js"
import "./assets/webgl/js/pmrem/PMREMCubeUVPacker.js"

import "./assets/webgl/js/Detector.js"
import "./assets/webgl/js/libs/stats.min.js"

import "./assets/webgl/js/libs/dat.gui.min.js"

// our webgl script 
import "./assets/js/webgl_main.js"
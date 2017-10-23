// example import asset
// import imgPath from './assets/img.jpg';

import music from '../audio/audio.mp3';


// TODO : add Dat.GUI
// TODO : add Stats

import * as THREE from 'three'
let OrbitControls = require('three-orbit-controls')(THREE);

import Sound from "./Sound";

export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

    	//Camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

        //Control
        this.controls = new OrbitControls(this.camera);

        //Scene
    	this.scene = new THREE.Scene();

    	//AxisHelper
        let axisHelper = new THREE.AxisHelper(5);
        this.scene.add(axisHelper);


    	//Rectangle
        let rectGeometry = new THREE.BoxGeometry( 0.04, 0.01, 0.01 );
	    let material = new THREE.MeshBasicMaterial({color : 'red'});
    	this.rectMesh = new THREE.Mesh( rectGeometry, material );
    	this.rectMesh.position.x = 0.40;
    	this.rectMesh.position.y = 0.25;
        this.scene.add( this.rectMesh );


        //Cylindre
        let cylinderGeomety = new THREE.CylinderGeometry( 0.050, 0.050, 0.15, 8, 2, false, 0, Math.PI * 2);
        let cylinderMaterial = new THREE.MeshBasicMaterial({color: 'pink'});
        let cylindreMesh = new THREE.Mesh(cylinderGeomety, cylinderMaterial);
        this.scene.add(cylindreMesh);


        //Render
    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );



        //Audio test
        this.audio = new Sound( null, null, null, null, true);

        this.audio._load(music, () => {
            this.audio.play()
        });






    }

    render() {

        //this.mesh.rotation.x += 0.1;
        //this.mesh.rotation.y += 0.008;
        this.rectMesh.rotation.z += 0.05;

    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

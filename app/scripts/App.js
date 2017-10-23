// example import asset
// import imgPath from './assets/img.jpg';
//import music from '../audio/audio.mp3';
//import Sound from "./Sound";

import * as THREE from 'three'

// TODO : add Dat.GUI
// TODO : add Stats


let OrbitControls = require('three-orbit-controls')(THREE),
cylindres = [];


export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

    	//Camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.x = 1;

        //Control
        this.controls = new OrbitControls(this.camera);

        //Scene
    	this.scene = new THREE.Scene();

    	//Helpers
        let axisHelper = new THREE.AxisHelper(5);
        let gridHelper = new THREE.GridHelper();

        this.scene.add(axisHelper, gridHelper);
        this.scene.background = new THREE.Color('#0f005e');

        //let cameraHelper = new THREE.CameraHelper( this.camera );
        //this.scene.add( cameraHelper );


    	//Rectangle
        let rectGeometry = new THREE.BoxGeometry( 0.04, 0.01, 0.01 );
	    let material = new THREE.MeshBasicMaterial({color : 'red'});
    	this.rectMesh = new THREE.Mesh( rectGeometry, material );
    	this.rectMesh.position.x = 0.40;
    	this.rectMesh.position.y = 0.25;
        this.scene.add( this.rectMesh );


        //Cylindre
        let cylinderGeomety = new THREE.CylinderGeometry( 0.05, 0.05, 0.15, 80, 2, true, 0, Math.PI * 2);
        let cylinderMaterial = new THREE.MeshBasicMaterial({color: 'pink', side:THREE.DoubleSide});
        let cylindreMesh = new THREE.Mesh(cylinderGeomety, cylinderMaterial);
        //cylindreMesh.position.x= 0.5;
        this.scene.add(cylindreMesh);

        let cylinderGeomety2 = new THREE.CylinderGeometry( 0.1, 0.1, 0.10, 80, 2, true, 0, Math.PI * 2);
        let cylinderMaterial2 = new THREE.MeshBasicMaterial({color: 'red', side:THREE.DoubleSide});
        let cylindreMesh2 = new THREE.Mesh(cylinderGeomety2, cylinderMaterial2);
        //cylindreMesh2.position.x= 0.5;
        this.scene.add(cylindreMesh2);

        let cylinderGeomety3 = new THREE.CylinderGeometry( 0.15, 0.15, 0.05, 80, 2, true, 0, Math.PI * 2);
        let cylinderMaterial3 = new THREE.MeshBasicMaterial({color: 'blue', side:THREE.DoubleSide});
        let cylindreMesh3 = new THREE.Mesh(cylinderGeomety3, cylinderMaterial3);
        //cylindreMesh3.position.x= 0.5;
        this.scene.add(cylindreMesh3);





        //Render
    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );



        //Audio test
       /* this.audio = new Sound( null, null, null, null, true);

        this.audio._load(music, () => {
            this.audio.play()
        });*/






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

    /*

    createCylindre(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength = Math.PI * 2){
        let cylinderGeomety = new THREE.CylinderGeometry( 0.05, 0.05, 0.15, 80, 2, true, 0, Math.PI * 2);
        let cylinderMaterial = new THREE.MeshBasicMaterial({color: 'pink', side:THREE.DoubleSide});
        let cylindreMesh = new THREE.Mesh(cylinderGeomety, cylinderMaterial);
        //cylindreMesh.position.x= 0.5;
        this.scene.add(cylindreMesh);
    }*/
}

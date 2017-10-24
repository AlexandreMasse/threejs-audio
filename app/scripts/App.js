// example import asset
// import imgPath from './assets/img.jpg';
import music from '../audio/audio.mp3';
import Sound from "./Sound";

import * as THREE from 'three'

// TODO : add Dat.GUI
// TODO : add Stats


let OrbitControls = require('three-orbit-controls')(THREE);

let cylindres = [],
nbCylindre = 50;


function getRandom(min, max) {
    return Math.floor(Math.random() * max  + min);
}

let colors1 = [
    '#d6d6d6',
    '#9c9c9c',
    '#7c7c7c',
    '#6d6d6d',
    '#454444',
];

let colors2 = [
    '#D6F8D6',
    '#246A73',
    '#368F8B',
    '#F1FAEE',
    '#24C9C1',
];



function getRandomColor() {
    return  colors2[getRandom(0, colors2.length - 1)];
}


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

    	//Cylindres
        let hauteur = 0.01;
        let largeur = 0.1;
        for(let i = 1; i <= nbCylindre; i++){
            let color = getRandomColor();
            //Cylindre
            let cylinderGeometry = new THREE.CylinderGeometry( largeur , largeur, hauteur, 64, 2, true, 0, Math.PI * 2);
            let cylinderMaterial = new THREE.MeshBasicMaterial({color: color, side:THREE.DoubleSide});
            let cylindreMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            //cylindreMesh.position.x= 0.5;
            this.scene.add(cylindreMesh);
            cylindres.push(cylindreMesh);

            //hauteur -= 0.1;
            largeur += 0.1;
        }

        console.log(cylindres);

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

        this.allData = this.audio.frequencyDataArray;

        //Remove Highest Frequency Data (10%)
        //this.allData = this.allData.slice(0, Math.floor((this.allData.length - 1) * 0.90 ));





    }

    render() {

        //this.mesh.rotation.x += 0.1;
        //this.mesh.rotation.y += 0.008;
        //this.rectMesh.rotation.z += 0.05;

        const everageData = [];

        console.log(this.allData);

        for(let i = 0; i < nbCylindre; i++ ){

            let everageCurrent = 0;
            let cumul = 0;

            let debut = Math.floor( ((this.allData.length - 1) / nbCylindre) * i );
            let fin = Math.floor( ((this.allData.length - 1) / nbCylindre) * (i + 1) );

            for(let j = debut; j < fin; j++) {
                cumul += this.allData[j];
            }

            everageCurrent = cumul / (fin - debut);

            everageData.push(everageCurrent);
        }



        //Render Cylindres

        for(let i= 0; i < nbCylindre; i++ ){
            //let line = lines[i];

            cylindres[i].scale.y = 0.1 + everageData[i];

        }


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

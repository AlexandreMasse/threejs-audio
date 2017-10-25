// example import asset
// import imgPath from './assets/img.jpg';
import music from '../audio/audio.mp3';
import Sound from "./Sound";

import CylinderGroup from './CylinderGroup';

import * as THREE from 'three'

// TODO : add Dat.GUI
// TODO : add Stats



function getRandom(min, max) {
     return Math.floor(Math.random() * ((max-min)+1) + min);
    //return Math.floor(Math.random() * max  + min);
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

        this.nbCylindre = 25;
        this.nbGroup = 5;
        this.groupWidth = 5;
        //this.cylinders = [];
        this.groupArray = [];

        this.initContainer();

    	this.initCamera();

    	this.initControl();

    	this.initScene();

        window.scene = this.scene;
        window.THREE = THREE;

    	this.initLight();

    	this.initHelper();



    	//Create group

        for(let i = 0; i < this.nbGroup; i++) {

            let cylinderGroup = new CylinderGroup(this.nbCylindre, this.groupWidth);

            //Get Group
            let group = cylinderGroup.getCylinderGroup();


            group.position.x = getRandom(-10, 10);
            group.position.y = getRandom(-10, 10);
            group.position.z = getRandom(-10, 10);

            //Add group to scene
            this.scene.add(group);

            //Get array of meshs
            let arrayMesh = cylinderGroup.getCylinderArray();

            //Add array of meshs to groupArray
            this.groupArray.push(arrayMesh);


            console.log( 'groupArray : ', this.groupArray);
        }




        //this.scene.add(this.cylinderGroup.getCylinderGroup());

       /* this.groupArray.push(this.cylinderGroup);

        console.log(this.groupArray);*/

        //this.cylinderGroup = new THREE.Group();

    	/*//Cylindres
        let hauteur = 0.01;
        let largeur = this.groupWidth / this.nbCylindre;
        for(let i = 1; i <= this.nbCylindre; i++){
            //let color = getRandomColor();
            let color = new THREE.Color("hsl(320, 100%, 50%)");
            //Cylindre
            let cylinderGeometry = new THREE.CylinderGeometry(largeur , largeur, hauteur, 32, 1, true, 0, Math.PI * 2);
            let cylinderMaterial = new THREE.MeshBasicMaterial({color : color, side:THREE.DoubleSide});
            let cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            //cylindreMesh.position.x= 0.5;
            this.cylinderGroup.add(cylinderMesh);
            this.cylinders.push(cylinderMesh);

            largeur += this.groupWidth / this.nbCylindre;
        }

        this.groupArray.push(this.cylinderGroup);

        console.log(this.groupArray);*/


        /*this.cylinderGroup2 = this.cylinderGroup.clone();
        this.cylinderGroup3 = this.cylinderGroup.clone();
        this.cylinderGroup4 = this.cylinderGroup.clone();
        this.cylinderGroup5 = this.cylinderGroup.clone();
        this.cylinderGroup6 = this.cylinderGroup.clone();
        this.cylinderGroup7 = this.cylinderGroup.clone();

        this.scene.add(
            this.cylinderGroup,
            this.cylinderGroup2,
            this.cylinderGroup3,
            this.cylinderGroup4,
            this.cylinderGroup5,
            this.cylinderGroup6,
            this.cylinderGroup7,
        );*/

/*
        this.cylinderGroup.position.y = 0;
        this.cylinderGroup2.position.x = -5;
        this.cylinderGroup3.position.x = 5;
        this.cylinderGroup4.position.y = -5;
        this.cylinderGroup5.position.y = 5;
        this.cylinderGroup6.position.z = -5;
        this.cylinderGroup7.position.z = 5;*/






        //Test

       /* let ringGeo = new THREE.RingGeometry(0.5, 3, 32);
        let mat = new THREE.MeshBasicMaterial({color: 'pink', side : THREE.DoubleSide});
        let ringMesh = new THREE.Mesh(ringGeo, mat);

        ringMesh.position.y = 8;
        ringMesh.scale.z = 3;

        this.scene.add(ringMesh);

        let geometry = new THREE.TorusGeometry( 0.5, 0.1, 3, 100 );
        let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
       let torus = new THREE.Mesh( geometry, material );
        this.scene.add( torus );

        torus.scale.z = 2;
*/

        //Render
    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );



    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );

        this.initAudio();

    }

    render() {

        //this.mesh.rotation.x += 0.1;
        //this.mesh.rotation.y += 0.008;
        //this.rectMesh.rotation.z += 0.05;
/*
        this.cylinderGroup.rotation.x += 0.01;
        this.cylinderGroup2.rotation.x += 0.02;
        this.cylinderGroup3.rotation.x += 0.02;
        this.cylinderGroup4.rotation.x += 0.02;
        this.cylinderGroup5.rotation.x += 0.02;
        this.cylinderGroup6.rotation.x += 0.02;
        this.cylinderGroup7.rotation.x += 0.02;*/


        const everageData = [];

        this.allData = this.audio.frequencyDataArray.slice(Math.floor(this.audio.frequencyDataArray.length - 1) * 0.02, Math.floor((this.audio.frequencyDataArray.length - 1) * 0.90 ));

        for (let i = 0; i < this.nbCylindre; i++ ){

            let everageCurrent = 0;
            let cumul = 0;

            let debut = Math.floor( ((this.allData.length - 1) / this.nbCylindre) * i );
            let fin = Math.floor( ((this.allData.length - 1) / this.nbCylindre) * (i + 1) );

            for(let j = debut; j < fin; j++) {
                cumul += this.allData[j];
            }

            everageCurrent = cumul / (fin - debut);

            everageData.push(everageCurrent);
        }

        //Render group
        for(let j = 0; j < this.groupArray.length; j++){

            //Render Cylindres
            for(let i= 0; i < this.nbCylindre; i++ ){
                this.groupArray[j][i].scale.y = 0.001 + everageData[i] * 3;
                this.groupArray[j][i].material.color.setHSL(( everageData[i] / 255), 1, 0.50);
            }
        }


    	this.renderer.render(this.scene, this.camera );

    }

    initContainer(){
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
    }

    initCamera(){
        //Camera
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.x = 10;
        this.camera.position.y = 10;
    }

    initControl(){
        //Control
        let OrbitControls = require('three-orbit-controls')(THREE);
        this.controls = new OrbitControls(this.camera);
    }

    initScene(){
        //Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0f005e');
    }

    initLight(){
        //Light
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        this.scene.add(this.directionalLight );
    }

    initHelper(){
        //Helpers
        let axisHelper = new THREE.AxisHelper(5);
        let gridHelper = new THREE.GridHelper();
        this.scene.add(axisHelper, gridHelper);
    }

    initAudio(){
        //Audio
        this.audio = new Sound( null, null, null, null, false);
        this.audio._load(music, () => {
            this.audio.play()
        });
    }




    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

}

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

}


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

        //variables
        this.nbCylindre = 50;
        this.nbGroup = 36;
        this.groupWidth = 3;
        this.groupArray = [];


        this.initContainer();

    	this.initCamera();

    	this.initControl();

    	this.initScene();

        window.scene = this.scene;
        window.THREE = THREE;

    	this.initLight();

    	this.initHelper();


    	//Create CilinderGroup

        for(let i = 0; i < this.nbGroup; i++) {

            let cylinderGroup = new CylinderGroup(this.nbCylindre, this.groupWidth);

            //Get Group
            let group = cylinderGroup.getCylinderGroup();

            //Add group to scene
            this.scene.add(group);

            //Add group to groupArray
            this.groupArray.push(group);

            /*
            group.position.x = getRandom(-10, 10);
            group.position.y = getRandom(-10, 10);
            group.position.z = getRandom(-10, 10);*/

            //group.position.z = i * this.groupWidth;
            group.position.z = - (this.nbGroup * this.groupWidth / 2) + i * this.groupWidth;

        }

        this.initRenderer();

        this.initEvent();

        this.onWindowResize();

        this.initAudio();

    }

    render() {

        //this.mesh.rotation.x += 0.1;
        //this.mesh.rotation.y += 0.008;
        //this.rectMesh.rotation.z += 0.05;


        const everageData = this.getEverrageData();


        //Render Group
        for(let j = 0; j < this.groupArray.length; j++){

            //Formule : base + angle * radius

            let group =  this.groupArray[j];

            let time = Date.now() / 1000;

            //test 1
          /*  let angle = ((Math.PI * 2) / this.nbGroup ) * j;
            let radius = 10;
            group.position.x = 0 + Math.sin(angle + time ) * radius;
            group.position.y = 0 + Math.cos(angle + time ) * radius;
            group.position.z = 0 + Math.tan(angle + time / 10) * 5 ;
*/

            //Test 2
            let angle = ((Math.PI * 5) / this.nbGroup ) * j;
            let radius = 10;
            group.position.x = 0 + Math.sin(angle + time ) * radius;
            group.position.y = 0 + Math.cos(angle + time ) * radius;
            //group.position.z -= 0.1;


            //group.rotation.x += 0.05;
            //group.rotation.z += 0.05;


            //Render Cylindres
            for(let i= 0; i < this.nbCylindre; i++ ){
                //Change Scale
                group.children[i].scale.y = 0.001 + everageData[i] * 3;
                //Change color
                //group.children[i].material.color.setHSL( everageData[i] / 255, 1, 0.5);
                //group.children[i].material.color.setHSL( (1 / 360) * 230, 1,  0.3 + everageData[i] / 255);
                group.children[i].material.color.setHSL( (1 / 360) * (10 * j) + time / 3, 1,  0.3 + everageData[i] / 255);
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
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000 );
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

    initEvent(){
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    initRenderer(){
        //Renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );

        this.renderer.animate( this.render.bind(this) );
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


    getEverrageData(){

        const everageData = [];

        const allData = this.audio.frequencyDataArray.slice(Math.floor(this.audio.frequencyDataArray.length - 1) * 0.02, Math.floor((this.audio.frequencyDataArray.length - 1) * 0.85 ));

        for (let i = 0; i < this.nbCylindre; i++ ){

            let everageCurrent = 0;
            let cumul = 0;

            let debut = Math.floor( ((allData.length - 1) / this.nbCylindre) * i );
            let fin = Math.floor( ((allData.length - 1) / this.nbCylindre) * (i + 1) );

            for(let j = debut; j < fin; j++) {
                cumul += allData[j];
            }

            everageCurrent = cumul / (fin - debut);

            everageData.push(everageCurrent);
        }

        return everageData;
    }



}

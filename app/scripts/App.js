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

export default class App {

    constructor() {

        //variables
        this.nbCylindre = 10;
        this.nbGroup = 10;
        this.nbLine = 5;

        this.groupWidth = 4;
        this.groupArray = [];
        this.lineArray = [];


        this.initContainer();

    	this.initCamera();

    	this.initControl();

    	this.initScene();

        window.scene = this.scene;
        window.THREE = THREE;

    	this.initLight();

    	this.initHelper();




    	//Create Lines
    	for(let j = 0; j < this.nbLine; j++){

    	    this.groupArray = [];

    	    //Create CylinderGroup
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
                group.position.y = getRandom(-10, 10);*/
                //group.position.z = getRandom(-10, 10);

                //group.position.z = i * this.groupWidth;

            }

            //Add groupArray (line) to lineArray
            this.lineArray.push(this.groupArray)

        }

    	console.log(this.groupArray);
    	console.log(this.lineArray);




        this.initRenderer();

        this.initEvent();

        this.onWindowResize();

        this.initAudio();

    }

    render() {

        const allData = this.audio.getSpectrum();

        const averageData = this.getAverageData(allData);

        let time = Date.now() / 1000;

        //Render Line
        for(let k = 0; k < this.nbLine; k++){
            let line = this.lineArray[k];

            //Render Group

            for(let j = 0; j < this.groupArray.length; j++){

                //let group = this.groupArray[j];
                let group = line[j];


                //Test 1 : speed disparition on Z axe
                /*let angle = ((Math.PI * 2) / this.nbGroup ) * j;
                 let radius = 10;
                 group.position.x = 0 + Math.sin(angle + time ) * radius;
                 group.position.y = 0 + Math.cos(angle + time ) * radius;
                 group.position.z = 0 + Math.tan(angle + time / 10) * 5 ;*/


                //Test : Spirale
                /*let angle = ((Math.PI * 5) / this.nbGroup ) * j;
                let radius = 10;
                group.position.x = Math.sin(angle + time ) * radius;
                group.position.y = Math.cos(angle + time ) * radius;
                group.position.z = ( - (this.nbGroup * this.groupWidth / 2) + j * this.groupWidth ) * 2;*/

                // Test 3 line center:
                group.position.x = ( - ((this.nbGroup - 1) * this.groupWidth / 2 ) + j * this.groupWidth ) * 3 ;
                //group.position.z = k * 7;
                group.position.z = ( - ((this.nbLine - 1) * this.groupWidth / 2 ) + k * this.groupWidth ) * 3 ;



                //Test 4 : 2 line
                /*if (j >= this.nbGroup / 2) {
                    group.position.x = ( - (this.nbGroup * this.groupWidth / 1.5 ) + j * this.groupWidth ) * 2;
                } else {
                    group.position.x = ( - (this.nbGroup * this.groupWidth / 1.5 ) + (this.nbGroup - 1  - j) * this.groupWidth ) * 2;
                    group.position.z = 5;
                }
    */


                //Render Cylindres
                for(let i= 0; i < this.nbCylindre; i++ ){
                    //Change Scale
                    group.children[i].scale.y = 0.001 + averageData[i] * 3;
                    //Change color
                    //group.children[i].material.color.setHSL( everageData[i] / 255, 1, 0.5);
                    //group.children[i].material.color.setHSL( (1 / 360) * 230, 1,  0.3 + everageData[i] / 255);
                    group.children[i].material.color.setHSL( (1 / 360) * (10 * j) + time / 5, 0.5,  0.3 + averageData[i] / 255);
                }
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
        this.audio = new Sound( music, null, null, () => {
            this.audio.play()
        }, false);
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }


    getAverageData(allData){

        const averageData = [];

        //Remove lowest and highest frequency
        allData.slice(Math.floor(allData.length - 1) * 0.05, Math.floor((allData.length - 1) * 0.90 ));

        for (let i = 0; i < this.nbCylindre; i++){

            let averageCurrent = 0;
            let cumul = 0;

            let debut = Math.floor( ((allData.length - 1) / this.nbCylindre) * i );
            let fin = Math.floor( ((allData.length - 1) / this.nbCylindre) * (i + 1) );

            for(let j = debut; j < fin; j++) {
                cumul += allData[j];
            }

            averageCurrent = cumul / (fin - debut);

            averageData.push(averageCurrent);
        }

        return averageData;
    }



}

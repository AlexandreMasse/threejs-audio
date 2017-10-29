// example import asset
// import imgPath from './assets/img.jpg';
import music from '../audio/audio.mp3';
import Sound from "./Sound";
import {TweenMax, Power1, Quad} from "gsap";

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
        this.nbGroup = 20;
        this.nbLine = 10;
        this.groupWidth = 4;
        this.spiralePositionRadius = 10;
        this.circlePositionRadius = 10;

        this.isCirclePosition = true;
        this.isLinePosition = false;
        this.isSpiralePosition = false;
        this.isSpiralePositionFinish = false;

        this.groupArray = [];
        this.lineArray = [];

        this.nbCylindreSlider = document.getElementById('nb-cylindre');
        this.nbGroupSlider = document.getElementById('nb-group');
        this.nbLineSlider = document.getElementById('nb-line');
        this.groupWidthSlider = document.getElementById('group-width');
        this.spiralePositionRadiusSlider = document.getElementById('spirale-radius');
        this.circlePositionRadiusSlider = document.getElementById('circle-radius');
        this.circlePositionRadio = document.getElementById('circle-position');
        this.spiralePositionRadio = document.getElementById('spirale-position');
        this.linePositionRadio = document.getElementById('line-position');

        this.initOption();

        this.initContainer();

    	this.initCamera();

    	this.initScene();

        window.scene = this.scene;
        window.THREE = THREE;


    	this.initLight();

    	this.initHelper();


        this.initRenderer();

        this.initControl();

        this.initEvent();

        this.onWindowResize();

        this.createCylinder();




        this.initAudio();

    }

    render() {

        const allData = this.audio.getSpectrum();

        const averageData = this.getAverageData(allData);

        let time = Date.now() / 1000;

        //UpdateCylinder Color and height width song
        this.updateCylinder(time, averageData);


        //Spirale Update
        if (this.isSpiralePositionFinish) {
            this.updateSpiralePosition(time);
        }

/*
        //Render Line
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];

            //Render Group
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){

                //let group = this.groupArray[groupIndex];
                let group = line[groupIndex];

                //Test 1 : speed disparition on Z axe
                /!*let angle = ((Math.PI * 2) / this.nbGroup ) * groupIndex;
                 let radius = 20;
                 group.position.x = 0 + Math.sin(angle + time ) * radius;
                 group.position.y = 0 + Math.cos(angle + time ) * radius;
                 group.position.z = 0 + Math.tan(angle + time / 10) * 5 ;*!/


                // Test 3 lines center:
             /!* group.position.x = ( - ((this.nbGroup - 1) * this.groupWidth / 2 ) + groupIndex * this.groupWidth ) * 3 ;
                group.position.z = ( - ((this.nbLine - 1) * this.groupWidth / 2 ) + lineIndex * this.groupWidth ) * 3 ;*!/


                //Test 4 : Concentric circle
               /!* let angle = ((Math.PI * 2) / this.nbGroup ) * groupIndex;
                let radius = 20;
                group.position.x = Math.sin(angle ) * radius * (lineIndex + 1) / 2;
                group.position.z = Math.cos(angle) * radius * (lineIndex + 1) / 2;*!/

               //group.position.z = 0 + Math.tan(angle + time / 10) * 5 ;*!/


                //group.position.y = averageData[lineIndex] / 2;

               /!* TweenMax.to(group.position, 1, {
                    ease: Power1.easeOut,
                    y: averageData[lineIndex] / 5

                });*!/


                //Render Cylindres
                /!*for(let i = 0; i < this.nbCylindre; i++ ){
                    //Change Scale
                    group.children[i].scale.y = 0.001 + averageData[i] * 3;
                    //Change color
                    //group.children[i].material.color.setHSL( averageData[i] / 255, 1, 0.5);
                    //group.children[i].material.color.setHSL( (1 / 360) * 230, 1,  0.3 + averageData[i] / 255);
                    //group.children[i].material.color.setHSL( (1 / 360) * (10 * groupIndex) + time / 5, 0.5,  0.3 + averageData[i] / 255);
                    group.children[i].material.color.setHSL( (1 / 360) * (360 / this.nbGroup * groupIndex) + (time / 3), 0.7,  0.3 + averageData[i] / 255);
                }*!/
            }

        }*/

    	this.renderer.render(this.scene, this.camera);

    }

    initOption() {
        this.nbCylindreSlider.value = this.nbLineSlider ;
        this.nbGroupSlider.value = this.nbGroup;
        this.nbLineSlider.value = this.nbLine;
        this.groupWidthSlider.value = this.groupWidth;
        this.spiralePositionRadiusSlider.value = this.spiralePositionRadius ;
        this.circlePositionRadiusSlider.value = this.circlePositionRadius;

        this.circlePositionRadio.checked = this.isCirclePosition;

    }


    initContainer(){
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
    }

    initCamera(){
        //Camera
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000 );
        this.camera.position.x = 140;
        this.camera.position.y = 70;
        //this.camera.rotation.z = 100;
    }

    initScene(){
        //Scene
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color('#0f005e');
        this.scene.background = new THREE.Color('black');
    }

    initLight(){
        //Light
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        this.scene.add(this.directionalLight );
    }

    initHelper(){
        //Helpers
        let axisHelper = new THREE.AxisHelper(50);
        let gridHelper = new THREE.GridHelper(100, 10);
        this.scene.add(axisHelper, gridHelper);
    }

    initEvent(){

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        window.addEventListener('keydown', this.onKeyDown.bind(this));


        this.nbCylindreSlider.addEventListener('change', () => {
            this.nbCylindre = Number(this.nbCylindreSlider.value);
            this.createCylinder();
        });


        this.nbGroupSlider.addEventListener('change', () => {
            this.nbGroup = Number(this.nbGroupSlider.value);
            this.createCylinder();
        });

        this.nbLineSlider.addEventListener('change', () => {
            this.nbLine = Number(this.nbLineSlider.value);
            this.createCylinder();
        });

        this.groupWidthSlider.addEventListener('change', () => {
            this.groupWidth = Number(this.groupWidthSlider.value);
            this.createCylinder();
        });

        this.spiralePositionRadiusSlider.addEventListener('change', () => {
            this.spiralePositionRadius = Number(this.spiralePositionRadiusSlider.value);
            if(this.isSpiralePosition){
                this.setSpiralePosition();
            }
            //this.createCylinder();
        });

        this.circlePositionRadiusSlider.addEventListener('change', () => {
            this.circlePositionRadius = Number(this.circlePositionRadiusSlider.value);
            if(this.isCirclePosition){
                this.setCirclePosition();
            }
            //this.createCylinder();
        });

        this.circlePositionRadio.addEventListener('change', () => {
            if(this.circlePositionRadio.checked){
                this.isCirclePosition = true;
                this.setCirclePosition();
            }else{
                this.isCirclePosition = false;
            }
        });

        this.linePositionRadio.addEventListener('change', () => {
            if(this.linePositionRadio.checked){
                this.isLinePosition = true;
                this.setLinePosition();
            }else{
                this.isLinePosition = false;
            }
        });

        this.spiralePositionRadio.addEventListener('change', () => {
            if(this.spiralePositionRadio.checked){
                this.isSpiralePosition = true;
                this.setSpiralePosition();
            }else{
                this.isSpiralePosition = false;
            }
        });


    }

    initRenderer(){
        //Renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );

        this.renderer.animate( this.render.bind(this) );
    }

    initControl(){
        //Control
        let OrbitControls = require('three-orbit-controls')(THREE);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }


    createCylinder() {

        //Clear Scene
       while(this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
       }

       this.initHelper();

        //Clear array
        this.lineArray = [];

        //CreateLines
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){

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

            }

            //Add groupArray (line) to lineArray
            this.lineArray.push(this.groupArray)

        }

        console.log(this.groupArray);
        console.log(this.lineArray);

        if (this.isLinePosition) {
            this.setLinePosition()
        }

        if(this.isCirclePosition) {
            this.setCirclePosition()
        }

        if(this.isSpiralePosition) {
            this.setSpiralePosition()
        }


    }


    initAudio(){
        //Audio
        this.audio = new Sound( music, 94, 5, () => {
            this.audio.play()
        }, false);

        this.kick = this.audio.createKick({
            frequency: 2,
            treshold: 250,
            decay: 0,
            onKick : () => {

                this.scene.background = new THREE.Color(1, 1, 1);


                if (this.isCirclePosition) {
                    //Line
                    for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++) {
                        let line = this.lineArray[lineIndex];
                        //Group
                        for (let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++) {
                            let group = line[groupIndex];
                            TweenMax.to(group.position, 0.5 + lineIndex / this.nbLine * 0.3, {
                                ease: Quad.easeIn,
                                y: (- lineIndex + this.nbLine ) * 6.5,
                                onComplete: () => {
                                    TweenMax.to(group.position, 0.25, {
                                        ease: Power1.easeOut,
                                        y : 0
                                    })
                                }
                            });
                        }
                    }
                }

                if (this.isLinePosition) {

                    //Line
                    for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++) {
                        let line = this.lineArray[lineIndex];

                        //Group
                        for (let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++) {

                            let group = line[groupIndex];

                            TweenMax.to(group.position, 0.5 + groupIndex / this.nbGroup * 0.3, {
                                ease: Quad.easeIn,
                                y: (- groupIndex + this.nbGroup ) * 5 ,
                                onComplete: () => {
                                    TweenMax.to(group.position, 0.25, {
                                        ease: Power1.easeOut,
                                        y : 0
                                    })
                                }
                            });
                        }
                    }
                }

            },
            offKick : () => {
                this.scene.background = new THREE.Color(0, 0, 0);

            }});


        this.audio.onceAt('kick begin', 30.6, () => {
            this.kick.on();
        });

    }


    setLinePosition(){
        this.isLinePosition = true;
        this.isCirclePosition = false;
        this.isSpiralePosition = false;
        this.isSpiralePositionFinish = false;

        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];

            //Render Group
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){

                let group = line[groupIndex];

                TweenMax.to(group.position, 0.7, {
                    ease: Power1.easeOut,
                    x: ( - ((this.nbGroup - 1) * this.groupWidth / 2 ) + groupIndex * this.groupWidth ) * 3 ,
                    z: ( - ((this.nbLine - 1) * this.groupWidth / 2 ) + lineIndex * this.groupWidth ) * 3,
                    y : 0,

                });
                /*
                group.position.x = ( - ((this.nbGroup - 1) * this.groupWidth / 2 ) + groupIndex * this.groupWidth ) * 3 ;
                group.position.z = ( - ((this.nbLine - 1) * this.groupWidth / 2 ) + lineIndex * this.groupWidth ) * 3 ;*/

            }
        }
    }

    setCirclePosition(){
        this.isCirclePosition = true;
        this.isLinePosition = false;
        this.isSpiralePosition = false;
        this.isSpiralePositionFinish = false;
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){
                let group = line[groupIndex];

                //Concentric circle
                let angle = ((Math.PI * 2) / this.nbGroup ) * groupIndex;
                let radius = this.circlePositionRadius;

                TweenMax.to(group.position, 0.7, {
                    ease: Power1.easeOut,
                    x: Math.sin(angle ) * radius * (lineIndex + 1) / 2,
                    z: Math.cos(angle) * radius * (lineIndex + 1) / 2,
                    y : 0,

                });
            }
        }
    }

    setSpiralePosition(){
        this.isSpiralePosition = true;
        this.isCirclePosition = false;
        this.isLinePosition = false;
        this.isSpiralePositionFinish = false;
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){
                let group = line[groupIndex];

                //Spirale
                let angle = ((Math.PI * 2) / this.nbGroup ) * groupIndex;
                let radius = this.spiralePositionRadius;

                TweenMax.to(group.position, 0.7, {
                    ease: Power1.easeOut,
                    x:Math.sin(angle + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius,
                    y:Math.cos(angle + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius,
                    z:( - (this.nbGroup * this.groupWidth / 2) + groupIndex * this.groupWidth ) * 2,
                    onComplete: () => {
                        this.isSpiralePositionFinish = true;
                    }
                });

              /*
                group.position.x = Math.sin(angle + time + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius;
                group.position.y = Math.cos(angle + time + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius;
                group.position.z = ( - (this.nbGroup * this.groupWidth / 2) + groupIndex * this.groupWidth ) * 2;
                */

            }
        }
    }


    updateSpiralePosition(time){
        //Lines
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];
            //Groups
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){
                let group = line[groupIndex];

                let angle = ((Math.PI * 2) / this.nbGroup ) * groupIndex;
                let radius = this.spiralePositionRadius;
                group.position.x = Math.sin(angle + time + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius;
                group.position.y = Math.cos(angle + time + ((Math.PI * 2) / this.nbLine ) * lineIndex) * radius;
                group.position.z = ( - (this.nbGroup * this.groupWidth / 2) + groupIndex * this.groupWidth ) * 2;

            }
        }
    }

     updateCylinder(time, averageData){
        //Lines
        for(let lineIndex = 0; lineIndex < this.nbLine; lineIndex++){
            let line = this.lineArray[lineIndex];
            //Groups
            for(let groupIndex = 0; groupIndex < this.groupArray.length; groupIndex++){
                let group = line[groupIndex];

                //Render Cylindres
                for(let i = 0; i < this.nbCylindre; i++ ){
                    //Change Scale
                    group.children[i].scale.y = 0.001 + averageData[i] * 3;
                    //Change color
                    //group.children[i].material.color.setHSL( averageData[i] / 255, 1, 0.5);
                    //group.children[i].material.color.setHSL( (1 / 360) * 230, 1,  0.3 + averageData[i] / 255);
                    //group.children[i].material.color.setHSL( (1 / 360) * (10 * groupIndex) + time / 5, 0.5,  0.3 + averageData[i] / 255);
                    group.children[i].material.color.setHSL( (1 / 360) * (360 / this.nbGroup * groupIndex) + (time / 3), 0.7,  0.3 + averageData[i] / 255);
                }

            }
        }
    }



    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }


    onKeyDown(e) {

        if (e.key === "l"){
            this.setLinePosition();
        }

        if (e.key === "c"){
            this.setCirclePosition();
        }

        if (e.key === "s"){
            this.setSpiralePosition();
        }



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

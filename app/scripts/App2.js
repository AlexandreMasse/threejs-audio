import * as THREE from 'three';
import vertex from '../scripts/glsl/vertex/vertex.vert';
import fragment from '../scripts/glsl/fragment/fragment.frag';

let OrbitControls = require('three-orbit-controls')(THREE);

export default class App2 {

    constructor() {

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        //Camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 1;

        //Control
        this.controls = new OrbitControls(this.camera);

        //Scene
        this.scene = new THREE.Scene();

        //Helpers
        let axisHelper = new THREE.AxisHelper(5);
        let gridHelper = new THREE.GridHelper(10, 10);

        this.scene.add(axisHelper, gridHelper);
        this.scene.background = new THREE.Color('#0f005e');



        //Triangle
        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( -0.5, -0.5, 0 ),
            new THREE.Vector3( 0.5, -0.5, 0 ),
            new THREE.Vector3( 0.5, 0.5, 0 ),
            new THREE.Vector3( -0.5, 0.5, 0 )
        );
        geometry.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(0 ,2, 3)
        );

        let material = new THREE.ShaderMaterial({
            vertexShader : vertex,
            fragmentShader : fragment,
            //wireframe : true
        });
        let mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);






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

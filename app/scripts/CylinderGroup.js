import * as THREE from 'three'

export default class CylinderGroup {


    constructor(nbCylinder, groupWidth){

        this.nbCylinder = nbCylinder;
        this.groupWidth = groupWidth;
        this.cylinderArray = [];

        this.cylinderGroup = new THREE.Group();


        //Cylindres
        let hauteur = 0.01;
        let largeur = this.groupWidth / this.nbCylinder;

        for(let i = 1; i <= this.nbCylinder; i++){
            //let color = getRandomColor();
            let color = new THREE.Color("hsl(320, 100%, 50%)");
            //Cylindre
            let cylinderGeometry = new THREE.CylinderGeometry(largeur , largeur, hauteur, 32, 1, true, 0, Math.PI * 2);
            let cylinderMaterial = new THREE.MeshBasicMaterial({color : color, side:THREE.DoubleSide});
            let cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);


            //Add Mesh to Group
            this.cylinderGroup.add(cylinderMesh);

            //Add Mesh to Array
            this.cylinderArray.push(cylinderMesh);

            //Increment width
            largeur += this.groupWidth / this.nbCylinder;
        }


    }

    getCylinderArray(){
        return this.cylinderArray;
    }

     getCylinderGroup(){
        return this.cylinderGroup;
    }


}
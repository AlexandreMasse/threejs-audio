import * as dat from 'dat.gui';
import './index.css';
import App from './scripts/App';

window.app = new App();

// dat.gui

const guiCustomControls = {
    nbCylindre: window.app.nbCylindre,
    nbGroup: window.app.nbGroup,
    nbLine: window.app.nbLine,
    groupWidth: window.app.groupWidth,
    position: "circle"
}

window.onload = function() {
    const gui = new dat.GUI({closed: true});
    gui.close()
    gui.add(guiCustomControls, "position", {Circle: "circle", Line: "line", Spiral: "spiral"}).name("Position").listen().onChange((value) => {
       switch (value) {
           case "circle":
               window.app.setCirclePosition()
               break;
           case "line":
               window.app.setLinePosition()
               break;
           case "spiral":
               window.app.setSpiralePosition()
               break;
       }
    });
    gui.add(guiCustomControls, "nbLine", 1, 20, 1).name("NbLine").onFinishChange((value) => {
        window.app.nbLine = value
        window.app.createCylinder()
    })
     gui.add(guiCustomControls, "nbGroup", 1, 30, 1).name("NbGroup").onFinishChange((value) => {
        window.app.nbGroup = value
        window.app.createCylinder()
    })
    gui.add(guiCustomControls, "nbCylindre", 1, 12, 1).name("ParticuleComplexity").onFinishChange((value) => {
        window.app.nbCylindre = value
        window.app.createCylinder()
    });
    gui.add(guiCustomControls, "groupWidth", 1, 25, 1).name("ParticuleWidth").onFinishChange((value) => {
        window.app.groupWidth = value
        window.app.createCylinder()
    })
    gui.add(window.app, "colorSpeed", -2, 2, 0.1).name("ColorSpeed")

    const circlePositionFolder = gui.addFolder("Circle position options")
    circlePositionFolder.add(window.app, "circlePositionRadius", 1, 50, 1).name("CircleRadius").onChange(() => {
        window.app.setCirclePosition()
        guiCustomControls.position = "circle"
    })

    const spiralePositionFolder = gui.addFolder("Spiral position options")
    spiralePositionFolder.add(window.app, "spiralePositionRadius", 1, 80, 1).name("SpiraleRadius").onChange(() => {
        window.app.setSpiralePosition()
        guiCustomControls.position = "spiral"
    })

}




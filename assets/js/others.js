export const activePlayerArrow = (arrow, scene)=>{
    arrow = BABYLON.MeshBuilder.CreateCylinder("arrow", {
        diameterTop: 0,
        diameterBottom: 0.5,
        height: 1,
        tessellation: 4,
    }, scene);

    arrow.rotation.x = Math.PI; // Point downward
    arrow.position.y = 3;

    const arrowMat = new BABYLON.StandardMaterial("arrowMat", scene);
    arrowMat.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
    arrow.material = arrowMat;
    return arrow;
};

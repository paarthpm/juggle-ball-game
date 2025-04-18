// Set up scene lighting, camera, etc.
export const createGround = (scene) => {
  return BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
};

export const createCamera = (scene, canvas) => {
  const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 15, -30), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  return camera;
};

export const setLight = (scene) =>{
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
};

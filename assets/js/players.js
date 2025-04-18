export const createPlayers = (scene, players) => {
  const playerPositions = [-10, 0, 10];

  for (let i = 0; i < 3; i++) {
    const player = BABYLON.MeshBuilder.CreateSphere(`player${i}`, { diameter: 2 }, scene);
    player.position = new BABYLON.Vector3(playerPositions[i], 1, 0);
    players.push(player);
  }

  return players;
};

export const updatePlayerHighlight = (players, activePlayerIndex,scene,arrow) => {
  const activeMaterial = new BABYLON.StandardMaterial("activeMat", scene);
  activeMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
  const defaultMaterial = new BABYLON.StandardMaterial("defaultMat", scene);
  defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Gray

  players.forEach((p, i) => {
    p.material = i === activePlayerIndex ? activeMaterial : defaultMaterial;
  });

    // Move arrow above the active player
    const active = players[activePlayerIndex];
    arrow.position.x = active.position.x;
    arrow.position.z = active.position.z;
    arrow.position.y = active.position.y + 2.5;
};

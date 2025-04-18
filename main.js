const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

let players = [];
let arrow;
let activePlayerIndex = 0;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.5, 0.8, 1);

  const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 15, -30), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  // Ground
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

  // Create 3 players
  const playerPositions = [-10, 0, 10];
    players = [];

  for (let i = 0; i < 3; i++) {
    const player = BABYLON.MeshBuilder.CreateSphere(`player${i}`, { diameter: 2 }, scene);
    player.position = new BABYLON.Vector3(playerPositions[i], 1, 0);
    players.push(player);
  }

    // Arrow added for active player
    // Create floating arrow
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


  

  // Highlight the active player
  const activeMaterial = new BABYLON.StandardMaterial("activeMat", scene);
  activeMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
  const defaultMaterial = new BABYLON.StandardMaterial("defaultMat", scene);
  defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Gray

  function updatePlayerHighlight() {
    players.forEach((p, i) => {
        p.material = i === activePlayerIndex ? activeMaterial : defaultMaterial;
    });

    // Move arrow above the active player
    const active = players[activePlayerIndex];
    arrow.position.x = active.position.x;
    arrow.position.z = active.position.z;
    arrow.position.y = active.position.y + 2.5;
    }


  updatePlayerHighlight();

  // Movement keys
  window.addEventListener("keydown", (e) => {
    const player = players[activePlayerIndex];
    const speed = 1;

    switch (e.key.toLowerCase()) {
      case "w": player.position.z -= speed; break;
      case "s": player.position.z += speed; break;
      case "a": player.position.x -= speed; break;
      case "d": player.position.x += speed; break;

      case "f":
        activePlayerIndex = (activePlayerIndex + 1) % players.length;
        updatePlayerHighlight();
        break;
    }
  });


  // Create the football (initially with the first player)
    const football = BABYLON.MeshBuilder.CreateSphere("football", { diameter: 1 }, scene);
    football.position = new BABYLON.Vector3(0, 1, 0); // On top of the ground


    let isJuggling = false;
    let jugglingPlayer = players[0]; // Start with player 0 juggling the ball

    // Mouse click for juggling the ball
canvas.addEventListener("pointerdown", (e) => {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
  
    if (pickResult.hit) {
      const clickedMesh = pickResult.pickedMesh;
  
      // Juggle the ball if the clicked mesh is the juggler player
      if (clickedMesh === jugglingPlayer) {
        isJuggling = true;
        let bounceHeight = 2;
        football.position.y = jugglingPlayer.position.y + bounceHeight;
  
        // Bounce animation
        const bounceAnimation = new BABYLON.Animation("bounce", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        bounceAnimation.setKeys([
          { frame: 0, value: jugglingPlayer.position.y + bounceHeight },
          { frame: 30, value: jugglingPlayer.position.y + bounceHeight / 2 },
          { frame: 60, value: jugglingPlayer.position.y + bounceHeight },
        ]);
        football.animations = [bounceAnimation];
        scene.beginAnimation(football, 0, 60, true);
      }
    }
  });
  
  // For passing the ball (c key), player switching (f key), and active player logic remain as before
  

    // Pass the ball to the active player
    window.addEventListener("keydown", (e) => {
        const activePlayer = players[activePlayerIndex];
        
        if (e.key.toLowerCase() === "c") {
        const distance = BABYLON.Vector3.Distance(activePlayer.position, jugglingPlayer.position);
    
        if (distance < 5) { // Adjust the pass distance based on your needs
            // Pass the ball to the active player
            football.position = activePlayer.position.clone();
            jugglingPlayer = activePlayer; // Now the active player has the ball
            isJuggling = false; // The new player starts juggling
        }
        }
    });
    
    // Switch active players
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "f" && !isJuggling) { // Only switch if not juggling
        activePlayerIndex = (activePlayerIndex + 1) % players.length;
        updatePlayerHighlight();
        }
    });
  
    scene.registerBeforeRender(() => {
        if (isJuggling) {
          football.position.x = jugglingPlayer.position.x;
          football.position.z = jugglingPlayer.position.z;
        }
      });
      
      

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
  
  const active = players[activePlayerIndex];
  arrow.position.x = active.position.x;
  arrow.position.z = active.position.z;
});

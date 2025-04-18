import { createPlayers, updatePlayerHighlight } from './players.js';
import { createFootball } from './football.js';
import { createGround, createCamera, setLight} from './scene.js';
import { activePlayerArrow} from './others.js';

const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);
engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

let players = [];
let arrow;
let activePlayerIndex = 0;
let football = null;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.5, 0.8, 1);

  // Lights and camera
  setLight(scene)
  createCamera(scene, canvas)

  // Ground
  createGround(scene);

  // Create players
  players = createPlayers(scene, players);

  // active arrow on players
  arrow = activePlayerArrow(arrow, scene);
  // Update player highlight
  updatePlayerHighlight(players, activePlayerIndex,scene,arrow);

  // Player movement and switching
  window.addEventListener("keydown", (e) => {
    const player = players[activePlayerIndex];
    const speed = 1;

    switch (e.key.toLowerCase()) {
        case "s": player.position.z -= speed; break;
        case "w": player.position.z += speed; break;
        case "a": player.position.x -= speed; break;
        case "d": player.position.x += speed; break;

        case "f":
            activePlayerIndex = (activePlayerIndex + 1) % players.length;
            updatePlayerHighlight(players, activePlayerIndex, scene, arrow);
            break;

        case " ": // Space key
            // If football already exists, dispose it first
            if (football) {
            football.dispose();
            }
            // Create new football on active player
            football = createFootball(scene, players[activePlayerIndex], canvas);
             // Simulate F key press
            const fKeyEvent = new KeyboardEvent('keydown', { key: 'f' });
            window.dispatchEvent(fKeyEvent);
            break;
    }
  });

  // Pass the ball
//   window.addEventListener("keydown", (e) => {
//     if (e.key.toLowerCase() === "c") {
//       passBall(players, football);
//     }
//   });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
    // moving active arrow above players
    const active = players[activePlayerIndex];
    arrow.position.x = active.position.x;
    arrow.position.z = active.position.z;
});

export { createScene };

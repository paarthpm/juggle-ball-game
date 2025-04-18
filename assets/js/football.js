export const createFootball = (scene, initialPlayer, canvas) => {
    // Create football slightly to the right and above the player
    const football = BABYLON.MeshBuilder.CreateSphere("football", { diameter: 0.5 }, scene);
    football.position = new BABYLON.Vector3(
        initialPlayer.position.x + 0.5,  // Right side offset
        initialPlayer.position.y + 10,    // Start above player
        initialPlayer.position.z
    );

    // Add physics to make the ball fall
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    
    football.physicsImpostor = new BABYLON.PhysicsImpostor(
        football, 
        BABYLON.PhysicsImpostor.SphereImpostor, 
        {   mass: 1.8,               // Heavier than before
            restitution: 0.6,        // Less bouncy
            friction: 0.2,
            damping:1.1             // Air resistance 
        }, 
        scene
    );

    // Variables for juggling
    let bounceAnimation = null;

    // Mouse click for juggling the ball
    canvas.addEventListener("pointerdown", (e) => {
        if (bounceAnimation) {
            scene.stopAnimation(football);
        }
        
        // Apply impulse to make the ball jump
        football.physicsImpostor.applyImpulse(
            new BABYLON.Vector3(0, 10, 0),
            football.getAbsolutePosition()
        );


    });

    return football;
};

export const passBall = (players, football) => {
    const activePlayer = players[activePlayerIndex];
    const distance = BABYLON.Vector3.Distance(activePlayer.position, football.position);

    if (distance < 5) {
        // Stop any current physics
        football.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        football.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        
        // Position ball near new player
        football.position = new BABYLON.Vector3(
            activePlayer.position.x + 0.5,
            activePlayer.position.y + 1,
            activePlayer.position.z
        );
        
        // Update juggling player reference
        jugglingPlayer = activePlayer;
        isJuggling = false;
    }
};

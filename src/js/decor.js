function Decor(main) {
    THREE.Group.call(this);
    this.main = main;
    this.sol;
    this.lumiere;
    this.etoiles;
    this.skybox;
};
// On surcharge la classe Decor
Decor.prototype = Object.create(THREE.Group.prototype);
Decor.prototype.constructor = Decor;
// fonction qui initialise notre décor et les ajoute à notre Group
Decor.prototype.init = function() {
    this.chargerPlan();
    this.eclairer();
    this.chargerEtoiles();
    this.chargerSkybox();
    this.add(this.etoiles);
    this.add(this.sol);
    this.add(this.skybox);
};

// fonction qui permet l'animation des étoiles
Decor.prototype.animate = function() {
    this.animerEtoiles();
};
// fonction qui crée la skybox
Decor.prototype.chargerSkybox = function() {
    var textureLoader = new THREE.TextureLoader();
    var colorMapSkybox = textureLoader.load("src/medias/images/skybox.jpg");
    var skyboxMaterial = new THREE.MeshBasicMaterial({
        map: colorMapSkybox,
        side: THREE.BackSide
    });
    this.skybox = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), skyboxMaterial);
    this.skybox.material.depthWrite = false;
    this.skybox.renderOrder = -999;
    this.skybox.scale.set(10000, 10000, 10000);
    this.skybox.position.set(0, 0, 0);
    this.add(this.skybox);
}
// fonction qui permet de créer le plateau et la grille
Decor.prototype.chargerPlan = function() {
    this.sol = new THREE.Group();

    var solGeometry = new THREE.PlaneGeometry(2000, 2000);
    var solMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8ebef,
        depthWrite: false,
        transparent: true,
        opacity: 0.3
    });
    var solMesh = new THREE.Mesh(solGeometry, solMaterial);

    solMesh.rotation.z = Math.PI / 2;
    solMesh.position.x = 50;
    solMesh.position.y = 600;
    solMesh.position.z = -150;
    solMesh.receiveShadow = true;
    solMesh.castShadow = true;
    this.sol.add(solMesh);

    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.rotation.x = Math.PI / 2;
    grid.position.x = -50;
    grid.position.y = 600;
    grid.position.z = -150;
    grid.material.opacity = 0.8;
    grid.material.transparent = true;
    this.sol.add(grid);
};

// fonction qui créer l'éclairage de notre scene
Decor.prototype.eclairer = function() {
    this.lumiere = new THREE.HemisphereLight(0xffffff, 0x444444);
    this.lumiere.position.set(0, 200, 0);
    this.add(this.lumiere);
    this.lumiere = new THREE.DirectionalLight(0xffffff);
    this.lumiere.position.set(0, 200, 100);
    this.lumiere.castShadow = true;
    this.lumiere.shadow.camera.top = 180;
    this.lumiere.shadow.camera.bottom = -100;
    this.lumiere.shadow.camera.left = -120;
    this.lumiere.shadow.camera.right = 120;
    this.add(this.lumiere);
};

// fonction qui permet de générer dynamique nos étoiles
Decor.prototype.chargerEtoiles = function() {
    var map = new THREE.TextureLoader().load("src/medias/images/etoile.jpg");
    var particleCount = 600,
        particles = new THREE.Geometry({
            renderOrder: -999
        }),
        pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: map,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

    for (var p = 0; p < particleCount; p++) {
        var pX = Math.random() * 2 * 800 - 800,
            pY = Math.random() * 2 * 800 - 800,
            pZ = Math.random() * 2 * 800 - 800,
            particle = new THREE.Vector3(pX, pY, pZ);
        particles.vertices.push(particle);
    }
    this.etoiles = new THREE.Points(particles, pMaterial);
    this.etoiles.sortParticles = true;
};

// fonction qui anime les étoiles (simple rotation)
Decor.prototype.animerEtoiles = function() {
    var rand = Math.random();
    this.etoiles.rotation.x += (Math.cos(0.7 * rand) + Math.sin(0.7 * rand)) / 3000;
    this.etoiles.rotation.y += (Math.cos(0.3 * rand) + Math.sin(0.3 * rand)) / 3000;
};

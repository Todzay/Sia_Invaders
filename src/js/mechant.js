function Mechant(deplacement, points, force, ligne, main, chemin) {

    //modele 3D JSON (fait sous BLender)
    this.chemin = chemin;

    //DONNEES HITBOX
    this.largeur = 70;
    this.hauteur = 130;
    this.profondeur = 20;
    ModeleAdd.call(this, this.chemin, this.largeur, this.hauteur, this.profondeur, this);
    this.deplacement = deplacement;
    this.force = force;
    this.points = points;
    this.projectileTab = new Array();
    this.ligneMechant = ligne;
    this.direction = new THREE.Vector3(0, -1, 0);
    this.main = main;
    this.attente = false;
    //  Positionnement des enemmis
    this.rotation.z += -90 * Math.PI / 180;
    this.rotation.x += 90 * Math.PI / 180;
    this.scale.set(0.5, 0.5, 0.5);
};
Mechant.prototype = Object.create(ModeleAdd.prototype);
Mechant.prototype.constructor = Mechant;

// fonction qui permet de déplacer un Mechant
Mechant.prototype.deplacer = function(direction) {
    this.position.x += (direction[0] * this.deplacement);
    this.position.y += (direction[1] * this.deplacement);
    this.position.z += (direction[2] * this.deplacement);
};

// fonction qui permet le déplacement d'un projectile stocké dans la table des projectiles
Mechant.prototype.deplacementProjectile = function() {
    for (var i = 0; i < this.projectileTab.length; i++) {
        this.projectileTab[i].deplacer(this.direction);
    }
};
// fonction qui permet de détruire un projectile en particulier
Mechant.prototype.detruireProjectile = function(projectile) {
    var i = this.projectileTab.indexOf(projectile);
    if (i > -1) {
        this.main.remove(this.projectileTab[i]);
        this.projectileTab.splice(i, 1);
    }
};
// fonction qui permet à un Mechant de tirer un projectile
Mechant.prototype.tirer = function() {
    var _this = this;
    if (!this.attente) {
        this.attente = true;
        var cheminLaser = 'src/medias/models/json/laser.json';
        var unLaser = new Projectile(4 + this.force, this, cheminLaser, this.main);
        unLaser.position.set(this.position.x + this.hauteur, this.position.y - this.largeur, 0);
        unLaser.rotation.z += -90 * Math.PI / 180;
        unLaser.position.z -= 50;
        this.main.audio.son["laser"].stop();
        this.main.audio.son["laser"].play();
        this.main.add(unLaser);
        this.projectileTab.push(unLaser);
        setTimeout(function() {
            _this.attente = false;
        }, (Math.floor((Math.random() * 20000) - _this.force * _this.force)));
    }
};

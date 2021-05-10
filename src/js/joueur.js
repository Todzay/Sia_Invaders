function Joueur(vie, deplacement, main) {

    //modele 3D JSON (fait sous BLender)
    this.chemin = 'src/medias/models/json/joueur.json';

    //DONNEES HITBOX
    this.largeur = 50;
    this.hauteur = 45;
    this.profondeur = 20;
    ModeleAdd.call(this, this.chemin, this.largeur, this.hauteur, this.profondeur, this);
    this.pointsDeVie = vie;
    this.points = 0;
    this.main = main;
    this.deplacement = deplacement;
    this.laserTab = new Array();
    this.direction = new THREE.Vector3(0, 1, 0);
    this.attente = false;
    this.scale.set(2, 2, 2);
    this.position.x = 0;
    this.position.y = -280;
    this.position.z = -90;
};

Joueur.prototype = Object.create(ModeleAdd.prototype);
Joueur.prototype.constructor = Joueur;

// fonction qui permet de déplacer le joueur
Joueur.prototype.deplacer = function(direction) {
    this.position.x += (direction[0] * this.deplacement);
    this.position.y += (direction[1] * this.deplacement);
    this.position.z += (direction[2] * this.deplacement);
};

// fonction qui permet au joueur de tirer un projectile
Joueur.prototype.tirer = function() {
    var _this = this;
    if (!this.attente) {
        this.attente = true;
        var cheminLaser = 'src/medias/models/json/laser.json';
        var unLaser = new Projectile(15, this, cheminLaser, this.main);
        unLaser.position.set(this.position.x - (this.largeur / 2), this.position.y, this.position.z);
        unLaser.rotation.z += 90 * Math.PI / 180;
        this.main.audio.son["laser"].stop();
        this.main.audio.son["laser"].play();
        this.laserTab.push(unLaser);
        this.main.add(unLaser);
        setTimeout(function() {
            _this.attente = false;
        }, (500 + (50 * _this.main.difficulte)));
    }
};

// fonction qui permet de déplacer tous les projectives du joueur
Joueur.prototype.deplacementProjectile = function() {
    for (var i = 0; i < this.laserTab.length; i++) {
        this.laserTab[i].deplacer(this.direction);
    }
};

// fonction qui permet de détruire un projectile passé en paramètre dans le tableau de projectile du joueur
Joueur.prototype.detruireProjectile = function(laser) {

    var i = this.laserTab.indexOf(laser);
    if (i > -1) {
        this.main.remove(this.laserTab[i]);
        this.laserTab.splice(i, 1);
    }
};

// fonction qui permet de clear tous les projectiles du joueur de la scene (utilie pour la classe Niveau)
Joueur.prototype.detruireTousLesProjectiles = function() {
    while (this.laserTab.length > 0) {
        this.detruireProjectile(this.laserTab[this.laserTab.length - 1]);
    }
};

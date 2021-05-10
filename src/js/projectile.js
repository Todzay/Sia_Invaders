function Projectile(deplacement, tireur, chemin, main) {
    this.chemin = chemin;
    this.main = main;

    //HITBOX
    this.largeur = 15;
    this.hauteur = 22;
    this.profondeur = 7;
    ModeleAdd.call(this, this.chemin, this.largeur, this.hauteur, this.profondeur, this);
    this.scale.set(1.5, 1.5, 1.5);
    this.position.x = 0;
    this.position.y = -280;
    this.position.z = -80;
    this.rotation.x = 0.40;
    this.updateMatrix();
    this.deplacement = deplacement;
    this.tireur = tireur;
    this.direction = new THREE.Vector3();
    this.collision;
};
// On surcharge la classe Projectile
Projectile.prototype = Object.create(ModeleAdd.prototype);
Projectile.prototype.constructor = Projectile;
// fonction qui permet de deplacer les projectiles
Projectile.prototype.deplacer = function(direction) {
    this.direction = direction;
    if (this.position.y >= 2000 || this.position.y <= -750) {
        this.tireur.detruireProjectile(this);
    }
    this.position.x += this.direction.x * this.deplacement;
    this.position.y += this.direction.y * this.deplacement;
    this.position.z += this.direction.z * this.deplacement;
    this.gestionCollision();
};
Projectile.prototype.gestionCollision = function() {
    var direction = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z);
    var origine = new THREE.Vector3(this.position.x + (this.largeur / 2), this.position.y, this.position.z);

    this.collision = new THREE.Raycaster(origine, direction, 0, 30);
    if (this.tireur instanceof Joueur)
        var cibleTab = this.collision.intersectObjects(this.main.gestionNiveau.horde.children.concat(this.main.gestionNiveau.bouclier), true);
    if (this.tireur instanceof Mechant)
        var cibleTab = this.collision.intersectObjects(this.main.joueur.children.concat(this.main.gestionNiveau.bouclier), true);

    if (cibleTab.length > 0) {
        var laCible = cibleTab[0].object.parent;

        if (laCible instanceof Joueur && cibleTab[0].distance <= 30 && this.tireur instanceof Mechant) {
            this.main.audio.son["hit"].play();
            laCible.pointsDeVie--;
            this.main.interface.affichageVies();
            this.tireur.detruireProjectile(this);
        }
        if (laCible instanceof Mechant && cibleTab[0].distance <= 30 && this.tireur instanceof Joueur) {
            this.main.gestionNiveau.horde.detruireUnMechant(laCible);
            this.tireur.points += laCible.points;
            this.main.interface.affichageScore();
            this.tireur.detruireProjectile(this);
        }
        if (laCible instanceof Bouclier && cibleTab[0].distance <= 20) {
            this.main.audio.son["hit"].play();
            laCible.detruire(cibleTab[0].object);
            this.tireur.detruireProjectile(this);
        }
    }
};

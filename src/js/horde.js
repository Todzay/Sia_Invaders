function Horde(main, niveau, deplacement, force, points, nombreDeLignes, nombreMechants, typeMechant) {
    THREE.Group.call(this);
    this.main = main;
    this.ligne = new Array();
    this.force = force;
    this.niveau = niveau;
    // distance entre les mechantes d'une meme ligne
    var distanceEntreDeuxLignes = (200 / (nombreDeLignes)) / 2;
    for (var i = 0; i < nombreDeLignes; i++) {
        var uneLigne = new LigneMechant(typeMechant[i], deplacement[i], points[i], nombreMechants[i], 1400 - (i * distanceEntreDeuxLignes), this.force, this, this.main);

        this.ligne.push(uneLigne);
        this.add(uneLigne);
    }
};
// On surcharge la classe Horde
Horde.prototype = Object.create(THREE.Group.prototype);
Horde.prototype.constructor = Horde;
// fonction qui permet de gérer le deplacement des lignes
Horde.prototype.deplacer = function() {
    for (var i = 0; i < this.ligne.length; i++) {
        this.ligne[i].deplacer();
    }
    // si la premiere ligne mechante arrive au niveau des boucliers, le joueur perd la partie!
    if (this.ligne.length > 0 && this.ligne[this.ligne.length - 1].collisionBouclier()) {
        this.main.etat = this.main.jeuEtatsPossibles.GAMEOVER;
        this.main.audio.son["gameover"].loop(true);
        this.main.audio.son["gameover"].play();
    }
};
// fonction qui permet de supprimer un mechant de la ligne
Horde.prototype.detruireUnMechant = function(mechant) {
    mechant.ligneMechant.detruireUnMechant(mechant);
};

// fonction qui permet de supprimer une ligne d'mechants
Horde.prototype.detruireUneLigne = function(uneLigne) {
    var i = this.ligne.indexOf(uneLigne);

    if (i > -1) {
        this.remove(this.ligne[i]);
        this.niveau.main.remove(this.ligne[i]);
        this.ligne.splice(i, 1);
    }

    if (this.ligne.length === 0) {
        this.niveau.main.etat = this.niveau.main.jeuEtatsPossibles.LANCEMENT;
    }
};
// fonction qui permet à une ligne de tirer (seules les deux premieres lignes tirent)
Horde.prototype.tirer = function() {
    for (var i = 0; i < 2; i++) {
        if (this.ligne[i] !== undefined)
            this.ligne[i].tirer();
    }
};
// fonction qui permet le deplacement d'un projectile
Horde.prototype.deplacementProjectile = function() {
    for (var i = 0; i < this.ligne.length; i++) {
        this.ligne[i].deplacementProjectile();
    }
};
// fonction qui permet l'animation d'une ligne (deplacement et tir)
Horde.prototype.animate = function() {
    this.deplacer();
    this.tirer();
    this.deplacementProjectile();
};
// fonction qui permet de tout détuire => code de triche (touche k)
Horde.prototype.detruireHorde = function() {
    while (this.ligne.length > 0) {
        if (this.ligne[this.ligne.length - 1] !== undefined) {
            if (this.ligne[this.ligne.length - 1].mechantTab.length !== undefined) {
                while (this.ligne[this.ligne.length - 1].mechantTab.length > 0) {
                    this.ligne[this.ligne.length - 1].detruireUnMechant(this.ligne[this.ligne.length - 1].mechantTab[this.ligne[this.ligne.length - 1].mechantTab.length - 1]);
                }
            }
        }
    }
};

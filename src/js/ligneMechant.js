function LigneMechant(typeMechant, deplacement, points, nombreMechants, hauteurLigne, force, horde, main) {
    THREE.Group.call(this);
    this.mechantTab = new Array();
    this.deplacement = deplacement;
    this.direction = [-1, 0, 0];
    this.force = force;
    this.horde = horde;
    this.main = main;
    this.chemin = typeMechant;
    this.points = points;

    // on récupére les modeles des mechants (voir la classe gestionNiveau)
    switch (this.chemin) {
        case "M1":
            this.chemin = 'src/medias/models/json/mechant1.json';
            break;
        case "M2":
            this.chemin = 'src/medias/models/json/mechant2.json';
            break;
        case "M3":
            this.chemin = 'src/medias/models/json/mechant3.json';
            break;
        default:
            break;
    }
    for (var i = -nombreMechants / 2; i < nombreMechants / 2; i++) {
        var UnMechant = new Mechant(this.deplacement, this.points, this.force, this, this.main, this.chemin);

        // on positionne correcte l'mechant
        UnMechant.position.x = i * (500 / nombreMechants);
        UnMechant.position.y = hauteurLigne;
        UnMechant.position.z -= 40;

        this.mechantTab.push(UnMechant);
        this.add(UnMechant);
    }
};
// On surcharge la classe LigneMechant
LigneMechant.prototype = Object.create(THREE.Group.prototype);
LigneMechant.prototype.constructor = LigneMechant;

// fonction qui permet de vérifier quand l'mechant le plus à droite atteindra la limite  du "board"
LigneMechant.prototype.sortieDroite = function() {
    if (this.mechantTab[this.mechantTab.length - 1].position.x >= 300) {
        return true;
    } else {
        return false;
    }
};

// fonction qui permet de vérifier quand l'mechant le plus à gauche atteindra la limite du "board"
LigneMechant.prototype.sortieGauche = function() {
    if (this.mechantTab[0].position.x < -300) {
        return true;
    } else {
        return false;
    }
};

// fonction qui permet de déplacer une ligne d'mechant
LigneMechant.prototype.deplacer = function() {

    var d = [0, -this.mechantTab[0].hauteur / this.deplacement, 0];

    for (var i = 0; i < this.mechantTab.length; i++) {
        this.mechantTab[i].deplacer(this.direction);
    }

    if ((this.sortieDroite() || this.sortieGauche())) {
        if (!this.collisionEntreDeuxLignes()) {
            for (var i = 0; i < this.mechantTab.length; i++) {
                this.mechantTab[i].deplacer(d);
            }
        }

        this.direction[0] = -this.direction[0];
        this.direction[1] = -this.direction[1];
        this.direction[2] = -this.direction[2];
    }
};

// fonction qui permet de vérifier que la ligne actuelle n'entrera pas en collision avec la suivante
LigneMechant.prototype.collisionEntreDeuxLignes = function() {
    var i = this.horde.ligne.indexOf(this);
    if ((i >= 0) && (i < this.horde.ligne.length - 1)) {
        if (this.horde.ligne[i + 1] && (this.mechantTab[0].position.y - this.horde.ligne[i + 1].mechantTab[0].position.y <= this.mechantTab[0].hauteur)) {
            return true;
        }
    }
    return false;
};

// fonction qui permet d'indiquer quand la ligne la plus proche du joueur entrera en collision avec un bouclier
LigneMechant.prototype.collisionBouclier = function() {
    var contact = this.main.joueur.position.y;
    if (this.main.gestionNiveau.bouclier.bouclierTab.length > 0) {
        contact = this.main.gestionNiveau.bouclier.bouclierTab[0].position.y;
    }
    if (this.mechantTab[0] !== undefined && this.mechantTab[0].position.y <= contact) {
        return true;
    }
    return false;
};

// fonction qui permet de supprimer un mechant particulier de la ligne
LigneMechant.prototype.detruireUnMechant = function(UnMechant) {
    var i = this.mechantTab.indexOf(UnMechant);

    if (i > -1) {
        while (this.mechantTab[i].projectileTab.length > 0) {
            this.mechantTab[i].detruireProjectile(this.mechantTab[i].projectileTab[this.mechantTab[i].projectileTab.length - 1]);
        }
        this.remove(this.mechantTab[i]);
        this.mechantTab.splice(i, 1);
    }
    if (this.mechantTab.length === 0) {
        this.horde.detruireUneLigne(this);
    }
};

// fonction utile qui calcule la distance entre deux points
LigneMechant.prototype.distanceDeuxPoints = function(point1, point2) {
    var x = point1.x - point2.x;
    var y = point1.y - point2.y;
    var z = point1.z - point2.z;

    var distance = Math.sqrt(x * x + y * y + z * z);
    return distance;
};

// fonction qui permet de selectionner le candidat au tir le plus proche de la position du joueur
LigneMechant.prototype.mechantLePlusProche = function() {
    var candidat = 9000;
    var UnMechant;

    for (var i = 0; i < this.mechantTab.length; i++) {
        if (candidat > this.distanceDeuxPoints(this.mechantTab[i].position, this.main.joueur.position)) {
            candidat = this.distanceDeuxPoints(this.mechantTab[i].position, this.main.joueur.position);
            UnMechant = this.mechantTab[i];
        }
    }
    return UnMechant;
};

// fonction qui permet à l'mechant le plus proche de tirer
LigneMechant.prototype.tirer = function() {
    this.mechantLePlusProche().tirer();
};

// fonction qui permet de déplacer tous les projectiles des mechants de la ligne
LigneMechant.prototype.deplacementProjectile = function() {
    for (var i = 0; i < this.mechantTab.length; i++) {
        this.mechantTab[i].deplacementProjectile();
    }
};

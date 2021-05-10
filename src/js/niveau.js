function Niveau(niveau, joueur, main) {
    THREE.Group.call(this);
    this.main = main;
    this.niveau = niveau;
    this.joueur = joueur;
    this.horde;
    this.bouclier;
    this.typeMechant = ["M1", "M2", "M3"];
    this.scoreMechant = [10, 20, 40];
};
// On surcharge la classe gestionNiveau
Niveau.prototype = Object.create(THREE.Group.prototype);
Niveau.prototype.constructor = Niveau;
// fonction qui permet de générer dynamique les mechants
Niveau.prototype.init = function() {
    var typeMechantTab = new Array();
    var pointsTab = new Array();
    var deplacementTab = new Array();
    var nombreMechantsTab = new Array();
    var nombreDeLignes = this.niveau * 2;
    var force = this.niveau;

    for (var i = 0; i < nombreDeLignes; i++) {
        var rand = Math.floor(Math.random() * 3);
        typeMechantTab.push(this.typeMechant[rand]);
        pointsTab.push(this.scoreMechant[rand] * force);
        deplacementTab.push(Math.floor((Math.random() * 1 * this.niveau)) + 1.5);
        nombreMechantsTab.push(Math.floor((Math.random() * this.niveau) + 3));
    }
    this.horde = new Horde(this.main, this, deplacementTab, force, pointsTab, nombreDeLignes, nombreMechantsTab, typeMechantTab);
    this.add(this.horde);
    var nombreBoucliers = (this.niveau <= 2) ? 3 : 5;
    this.bouclier = new ligneBouclier(nombreBoucliers, this);
    this.add(this.bouclier);
    this.niveau++;
};
// fonction qui permet de supprimer tous les mechants, boucliers et projectiles
Niveau.prototype.reset = function() {
    if (this.joueur) {
        this.joueur.detruireTousLesProjectiles();
    }
    if (this.horde) {
        this.horde.detruireHorde();
    }
    if (this.bouclier) {
        this.bouclier.detruireTousLesBoucliers();
    }
};

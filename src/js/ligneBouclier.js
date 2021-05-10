function ligneBouclier(nombreBoucliers, niveau) {
    THREE.Group.call(this);
    this.niveau = niveau;
    this.bouclierTab = new Array();
    // on calcule la distance entre chaque bouclier en fonction du nombre de bouclier et de la "taille" du board
    var distanceEntreBoucliers = 700 / nombreBoucliers;
    for (var i = 0; i < nombreBoucliers; i++) {
        var unBouclier = new Bouclier(this);
        // on ajuste le positionnement du bouclier
        unBouclier.position.x = -250 + (i * distanceEntreBoucliers);
        unBouclier.position.y = this.niveau.joueur.position.y + 200;
        unBouclier.rotation.z = -90 * Math.PI / 180;
        this.bouclierTab.push(unBouclier);
        this.add(unBouclier);
    }
};
ligneBouclier.prototype = Object.create(THREE.Group.prototype);
ligneBouclier.prototype.constructor = ligneBouclier;
// fonction qui permet de détruire un bouclier particulier (appellé par la classe ligneBouclier)
ligneBouclier.prototype.detruireUnBouclier = function(unBouclier) {
    var i = this.bouclierTab.indexOf(unBouclier);

    if (i > -1) {
        this.remove(this.bouclierTab[i]);
        this.bouclierTab.splice(i, 1);
    }
};
// fonction qui permet de détruire tous les boucliers (appellé par la classe ligneBouclier)
ligneBouclier.prototype.detruireTousLesBoucliers = function() {
    while (this.bouclierTab.length > 0) {
        this.detruireUnBouclier(this.bouclierTab[this.bouclierTab.length - 1]);
    }
};

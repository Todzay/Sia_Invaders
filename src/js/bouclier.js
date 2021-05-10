function Bouclier(ligneBouclier) {
    //modele 3D JSON (fait sous BLender)
    this.chemin = 'src/medias/models/json/bouclier.json';
    this.largeur = 30;
    this.hauteur = 30;
    this.profondeur = 30;
    this.ligne = ligneBouclier;
    ModeleAdd.call(this, this.chemin, this.largeur, this.hauteur, this.profondeur, this);
    this.scale.set(2.2, 2.2, 2.2);
    this.rotation.y += 4.7;
    this.position.z -= 100;
};
// On surcharge la classe Bouclier
Bouclier.prototype = Object.create(ModeleAdd.prototype);
Bouclier.prototype.constructor = Bouclier;
// fonction qui permet de détuire un bouclier
Bouclier.prototype.detruire = function() {
    this.ligne.detruireUnBouclier(this);
};

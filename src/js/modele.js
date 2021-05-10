
function ModeleAdd(cheminFichierJSON, largeur, hauteur, profondeur, demandeur) {
    this.chemin = cheminFichierJSON;

    // HITBOX
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.profondeur = profondeur;
    this.demandeur = demandeur;
    THREE.Group.call(this);
    var _this = this;
    var loader = new THREE.JSONLoader();
    loader.load(this.chemin, function(geometry, materials) {
        var modele = new THREE.Mesh(geometry, materials);
        _this.add(modele);
    });

    var hitbox = new THREE.Mesh(new THREE.BoxGeometry(this.largeur, this.hauteur, this.profondeur), new THREE.MeshBasicMaterial({
        visible: false //je mes le cube invisible
    }));


    if (this.demandeur instanceof Joueur) {
        hitbox.scale.set(1, 1, 2);
    };

    if (this.demandeur instanceof Projectile) {
        hitbox.translateX((this.largeur / 2) + 10);
        hitbox.translateY(-10);
    };

    if (this.demandeur instanceof Mechant) {
        hitbox.translateX((this.largeur / 2) + 30);
        hitbox.translateY((this.hauteur / 2));
        hitbox.translateZ(5);
    };

    if (this.demandeur instanceof Bouclier) {
        hitbox.translateX((this.largeur / 2));
        hitbox.translateY((this.hauteur / 2));
        hitbox.translateZ(5);
    };

    this.add(hitbox);
};

ModeleAdd.prototype = Object.create(THREE.Group.prototype);
ModeleAdd.prototype.constructor = ModeleAdd;

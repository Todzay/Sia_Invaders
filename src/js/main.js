function Main() {
    THREE.Scene.call(this);

    //initilisation des proprietes
    this.joueur;
    this.decor = new Decor(this);
    this.armee;
    this.camera;
    this.cameraEtat;
    this.interface = new Interface(this);
    this.audio = new Audio();
    this.gestionNiveau;
    this.difficulte;
    this.jeuEtatsPossibles = {
        LANCEMENT: 1,
        PAUSE: 2,
        ENJEU: 3,
        GAMEOVER: 4,
        ACCUEIL: 5
    };
    this.etat = this.jeuEtatsPossibles.ACCUEIL;
    this.listeVuesCamera = Array();
    this.cameraEtatsPossibles = {
        ACCUEIL: "accueil",
        DEFAUT: "defaut",
        JOUEUR: "joueur",
    };
};
// On surcharge la classe Main
Main.prototype = Object.create(THREE.Scene.prototype);
Main.prototype.constructor = Main;
Main.prototype.init = function() {
    // AUDIO
    this.audio.init();
    this.audio.musique["Accueil"].loop(true);
    this.audio.musique["Accueil"].play();

    // JOUEUR
    this.joueur = new Joueur(3, 7, this);
    this.add(this.joueur);

    // NIVEAU
    this.difficulte = 1;
    this.gestionNiveau = new Niveau(this.difficulte, this.joueur, this);
    this.gestionNiveau.init();
    this.add(this.gestionNiveau);

    // DECOR
    this.decor.init();
    this.add(this.decor);

    // INTERFACE
    this.interface.init();

    // CLAVIER
    this.gestionCLavier();

    // CAMERA
    this.creerCamera();
};
Main.prototype.animate = function() {

    this.decor.animate(); // animation du décor
    if (this.etat === this.jeuEtatsPossibles.LANCEMENT) {
        if (this.joueur.pointsDeVie != 3) {
            this.joueur.pointsDeVie = 3;
            this.interface.affichageVies();
        }
        this.difficulte++;
        document.getElementById("level").innerHTML = this.difficulte;
        var messageNiveau = "Level " + this.difficulte;
        if (this.difficulte === 1) {
            this.interface.afficheMessage(messageNiveau, "C'est parti !", 2500)
        } else {
            this.interface.afficheMessage("Stage Clear <br>" + messageNiveau, "Niveau suivant!", 2500);
        }
        // on masque le score final (suite à l'écran game over)
        document.getElementById("scorefinal").innerHTML = "";
        document.getElementById("scorefinal").style.visibility = 'hidden';
        this.gestionNiveau.reset();
        // on génére de nouveau une horde d'mechants
        this.gestionNiveau = new Niveau(this.difficulte, this.joueur, this);
        this.gestionNiveau.init();
        this.add(this.gestionNiveau);
        this.etat = this.jeuEtatsPossibles.PAUSE;
    }
    if (this.etat === this.jeuEtatsPossibles.ENJEU) {
        this.audio.musique["Accueil"].fade(0.8, 0.0, 1000);
        this.audio.musique["Accueil"].pause();
        this.gestionNiveau.horde.animate();
        this.joueur.deplacementProjectile();
        // on arrete la partie lorsque le joueur n'a plus de points de vie
        if (this.joueur.pointsDeVie === 0) {
            this.etat = this.jeuEtatsPossibles.GAMEOVER;
            this.audio.musique["Theme"].fade(0.8, 0.0, 700);
            this.audio.son["gameover"].play();
            this.audio.son["gameover"].loop(true);
        }
    }
    // le joueur a perdu la partie, on affiche le score
    if (this.etat === this.jeuEtatsPossibles.GAMEOVER) {
        this.interface.afficheMessage("YOU LOSE", "Your score: " + this.joueur.points, -1);
        document.getElementById("scorefinal").innerHTML = "Press Enter to try again";
    }
    kd.tick();
    TWEEN.update();
};

Main.prototype.gestionCLavier = function() {
    var _this = this;
    kd.F.press(function() {

        THREEx.WindowResize.bind(renderer, _this.camera);
        if (THREEx.FullScreen.activated()) {
            THREEx.FullScreen.cancel();
        } else {
            THREEx.FullScreen.request();
        }
    });

    kd.S.press(function() {
        var dataUrl = renderer.domElement.toDataURL("image/jpeg");
        var iframe = "<iframe width='100%' height='100%' src='" + dataUrl + "'></iframe>";
        var nouvelOnglet = window.open();
        nouvelOnglet.document.write(iframe);
        nouvelOnglet.document.close();
    });


    kd.M.press(function() {
        _this.audio.couperMusique();
    });

    kd.K.press(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {
            _this.gestionNiveau.reset();
        } else {
        }
    });

    kd.P.press(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {
            _this.audio.musique["Theme"].fade(0.8, 0.0, 800);
            _this.etat = _this.jeuEtatsPossibles.PAUSE;
        } else if (_this.etat === _this.jeuEtatsPossibles.PAUSE) {
            _this.etat = _this.jeuEtatsPossibles.ENJEU;
            _this.audio.musique["Theme"].fade(0.0, 0.8, 800);
        } else if (_this.etat === _this.jeuEtatsPossibles.LANCEMENT) {

        }
    });
    kd.H.press(function() {
        if (document.getElementById("info_middle").style.visibility === "visible") {
            document.getElementById("info_middle").style.visibility = "hidden";
        } else if (document.getElementById("info_middle").style.visibility === "hidden") {
            document.getElementById("info_middle").style.visibility = "visible";
        } else {

        }
    });
    kd.ZERO.press(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {
            _this.choixCamera(0);
        } else if (_this.etat === _this.jeuEtatsPossibles.PAUSE) {
            _this.choixCamera(0);
        } else if (_this.etat === _this.jeuEtatsPossibles.LANCEMENT) {
        }
    });
    kd.ONE.press(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {
            _this.choixCamera(1);
        } else if (_this.etat === _this.jeuEtatsPossibles.PAUSE) {
            _this.choixCamera(1);
        } else if (_this.etat === _this.jeuEtatsPossibles.LANCEMENT) {
        }
    });
    kd.ENTER.press(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ACCUEIL) {
            _this.interface.masquerEcranAccueil();
            _this.interface.affichageBarresInfo();
            _this.audio.musique["Accueil"].fade(0.8, 0.0, 1000);
            _this.audio.musique["Theme"].fade(0.0, 0.8, 1000);
            _this.audio.musique["Theme"].loop(true);
            _this.audio.musique["Theme"].play();
            _this.choixCamera(0);
            var messageNiveau = "Level " + _this.difficulte;
            _this.interface.afficheMessage(messageNiveau, "C'est parti !", 2000);

        }
        else if (_this.etat === _this.jeuEtatsPossibles.GAMEOVER) {

            _this.audio.son["gameover"].fade(1.0, 0.0, 1200);
            _this.audio.son["gameover"].stop();
            _this.audio.musique["Theme"].fade(0.0, 0.8, 2500);

            _this.difficulte = -1;
            _this.joueur.points = 0;
            _this.joueur.pointsDeVie = 3;

            _this.interface.init();
            _this.interface.masquerEcranAccueil();
            _this.interface.affichageBarresInfo();
            _this.etat = _this.jeuEtatsPossibles.LANCEMENT;
        }
    });
    kd.LEFT.down(function() {

        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {

            var direction = [-1, 0, 0]

            if (_this.joueur.position.x > -280) {
                _this.joueur.deplacer(direction);
                if (_this.cameraEtat === _this.cameraEtatsPossibles.JOUEUR) {
                    _this.camera.position.x += (direction[0] * _this.joueur.deplacement);
                    _this.camera.position.y += (direction[1] * _this.joueur.deplacement);
                    _this.camera.position.z += (direction[2] * _this.joueur.deplacement);
                }
            }
            _this.actualisationVueJoueur();
        }
    });
    kd.RIGHT.down(function() {

        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {

            var direction = [1, 0, 0]

            if (_this.joueur.position.x < 280) {
                _this.joueur.deplacer(direction);
                if (_this.cameraEtat === _this.cameraEtatsPossibles.JOUEUR) {
                    _this.camera.position.x += (direction[0] * _this.joueur.deplacement);
                    _this.camera.position.y += (direction[1] * _this.joueur.deplacement);
                    _this.camera.position.z += (direction[2] * _this.joueur.deplacement);
                }
            }
            _this.actualisationVueJoueur();
        }
    });
    kd.SPACE.down(function() {
        if (_this.etat === _this.jeuEtatsPossibles.ENJEU) {
            _this.joueur.tirer();
        }
    });
};
// fonction qui initialise les differentes vues possibles
Main.prototype.creationVuesCamera = function() {
    var positionCamera;
    var directionCamera; //(lookAt)
    var uneVueTemp = new Array();

    positionCamera = new THREE.Vector3(-8000, -80, 8000);
    directionCamera = new THREE.Vector3(0, 0, 0);
    uneVueTemp.push(positionCamera);
    uneVueTemp.push(directionCamera);
    this.listeVuesCamera["accueil"] = uneVueTemp;

    uneVueTemp = [];
    positionCamera = new THREE.Vector3(0, -800, 100);
    directionCamera = new THREE.Vector3(0, 1, 0);
    uneVueTemp.push(positionCamera);
    uneVueTemp.push(directionCamera);
    this.listeVuesCamera["defaut"] = uneVueTemp;
    uneVueTemp = [];
    var positionJoueur = new THREE.Vector3(this.joueur.position.x, this.joueur.position.y, this.joueur.position.z);
    positionJoueur.x += 20;
    positionJoueur.z += this.joueur.hauteur;
    positionCamera = new THREE.Vector3(positionJoueur.x, positionJoueur.y, positionJoueur.z);
    directionCamera = new THREE.Vector3(0, 1, 0);
    uneVueTemp.push(positionCamera);
    uneVueTemp.push(directionCamera);
    this.listeVuesCamera["joueur"] = uneVueTemp;
};

// fonction qui créer et ajoute la camera à la scene
Main.prototype.creerCamera = function() {
    this.creationVuesCamera();
    var vueActuelle = this.listeVuesCamera["accueil"];
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 5000);
    this.camera.position.set(vueActuelle[0].x, vueActuelle[0].y, vueActuelle[0].z);
    this.camera.lookAt(vueActuelle[1]);
    this.add(this.camera);
    this.cameraEtat = this.cameraEtatsPossibles.ACCUEIL;
};

// fonction qui actualise la position de la vue joueur (necessaire car la position du joeur varie)
Main.prototype.actualisationVueJoueur = function() {
    var positionJoueur = new THREE.Vector3(this.joueur.position.x, this.joueur.position.y, this.joueur.position.z);
    positionJoueur.x += 20;
    positionJoueur.z += this.joueur.hauteur;
    var positionTemp = new THREE.Vector3(positionJoueur.x, positionJoueur.y, positionJoueur.z);
    var directionTemp = new THREE.Vector3(0, 1, 0);
    var uneVue = new Array();
    uneVue.push(positionTemp);
    uneVue.push(directionTemp);
    this.listeVuesCamera["joueur"] = uneVue;
};

// fonction qui effectue les transitions et place la camera à la vue demandée
Main.prototype.choixCamera = function(choix) {
    switch (choix) {
        case 0:
            this.transitionCamera(this.listeVuesCamera["defaut"][0], this.listeVuesCamera["defaut"][1], false);
            this.cameraEtat = this.cameraEtatsPossibles.DEFAUT;
            break;
        case 1:
            this.transitionCamera(this.listeVuesCamera["joueur"][0], this.listeVuesCamera["joueur"][1], true);
            this.cameraEtat = this.cameraEtatsPossibles.JOUEUR;
            break;
        default:
            break;
    }
};

// fonction qui effectue les transitions (grâce à la library TWEEN.js)
Main.prototype.transitionCamera = function(positionCamera, directionCamera, cameraJoueur) {

    var destination = {
        x: positionCamera.x,
        y: positionCamera.y,
        z: positionCamera.z
    };

    var _this = this;

    var transition = new TWEEN.Tween(this.camera.position);
    transition.easing(TWEEN.Easing.Circular.Out);

    if (this.cameraEtat === this.cameraEtatsPossibles.ACCUEIL) {
        transition.to(destination, 2000);
        transition.onUpdate(function() {
            _this.camera.lookAt(directionCamera);
        });
        transition.onComplete(function() {
            _this.cameraEtat = _this.cameraEtatsPossibles.DEFAUT;
        });
    }
    else if (this.cameraEtat === this.cameraEtatsPossibles.DEFAUT) {
        transition.to(destination, 300);
        transition.onComplete(function() {
            _this.camera.position.x = _this.joueur.position.x;
        });
    } else {
        transition.to(destination, 1500);
        transition.onUpdate(function() {
            _this.camera.lookAt(directionCamera);
        });
    }
    transition.start();
};

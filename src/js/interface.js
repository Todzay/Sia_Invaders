function Interface(main) {

    this.main = main;
};
// fonction qui initialise les barres d'infos et la page d'accueil
Interface.prototype.init = function(main) {

    this.masquageBarresInfo();
    this.affichageVies();
    this.affichageScore();
    this.affichageNiveau();
    this.affichageEcranAccueil();
}
// fonction qui permet de masquer les barres d'info
Interface.prototype.masquageBarresInfo = function() {
    document.getElementById("info").style.visibility = "hidden";
};
// fonction qui permet d'afficher les barres d'info
Interface.prototype.affichageBarresInfo = function() {
    document.getElementById("info").style.visibility = "visible";
    document.getElementById("info_middle").style.visibility = "hidden";
}
// fonction qui permet d'afficher/actualiser les points de vie
Interface.prototype.affichageVies = function() {
    document.getElementById("life").innerHTML = "";
    for (var i = 0; i < this.main.joueur.pointsDeVie; i++) {
        document.getElementById("life").innerHTML += "♥";
    }
};
// fonction qui permet d'afficher/actualiser le score
Interface.prototype.affichageScore = function() {
    document.getElementById("score").innerHTML = this.main.joueur.points;
};
// fonction qui permet d'afficher/actualiser le niveau actuel du jeu
Interface.prototype.affichageNiveau = function() {
    document.getElementById("level").innerHTML = this.main.difficulte;
};
// fonction qui permet d'afficher la page d'accueil
Interface.prototype.affichageEcranAccueil = function() {
    document.getElementById("bande-message").style.visibility = "hidden";
    document.getElementById("centre-message").style.visibility = "hidden";
    document.getElementById("message").style.visibility = "hidden";
    document.getElementById("instruction").style.visibility = "hidden";
    document.getElementById("info_middle").style.visibility = "hidden";
    var logo = "<span style='font-size: 150%;'>SIA</span> <br/> <span style='font-size: 150%;'>INVADERS</span>";
    var auteur = "<span style='color: #8B0000;'>by Lucas Olazagazti</span>";
    var instruction = "Press ENTER to play";
    document.getElementById('sia-title').innerHTML = logo;
    document.getElementById('auteur').innerHTML = auteur;
    document.getElementById('instruction-accueil').innerHTML = instruction;
    document.getElementById('centre-accueil').style.background = 'transparent';
    document.getElementById('accueil').style.visibility = "visible";
    document.getElementById('centre-accueil').style.visibility = "visible";
};
// fonction qui permet de masquer la page d'accueil
Interface.prototype.masquerEcranAccueil = function() {
    document.getElementById("accueil").style.visibility = "hidden";
    document.getElementById("centre-accueil").style.visibility = "hidden";
    document.getElementById("sia-title").style.visibility = "hidden";
    document.getElementById("auteur").style.visibility = "hidden";
    document.getElementById("instruction").style.visibility = "hidden";
    document.getElementById("points").style.visibility = "hidden";
};
// fonction qui permet d'afficher un message personnalisé en fonction du niveau actuel dans le jeu
Interface.prototype.afficheMessage = function(text, instruction, duree) {
    var _this = this;
    document.getElementById("message").innerHTML = text;
    document.getElementById("instruction").innerHTML = instruction;
    document.getElementById("centre-message").style.background = 'rgba(10,10,10,0.2)';
    document.getElementById("bande-message").style.visibility = "visible";
    document.getElementById("centre-message").style.visibility = "visible";
    document.getElementById("message").style.visibility = "visible";
    document.getElementById("instruction").style.visibility = "visible";
    if (duree > 0) {
        setTimeout(function() {
            document.getElementById("bande-message").style.visibility = "hidden";
            document.getElementById("centre-message").style.visibility = "hidden";
            document.getElementById("message").style.visibility = "hidden";
            document.getElementById("instruction").style.visibility = "hidden";
            _this.main.etat = _this.main.jeuEtatsPossibles.ENJEU;
        }, duree);
    }
};

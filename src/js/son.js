function Audio() {
    this.musique = new Array();
    this.son = new Array();
    this.uneMusiqueON = true;
};
// fonction qui précharge nos musiques et sons
Audio.prototype.init = function() {

    this.musique["Accueil"] = new Howl({
        src: ['src/medias/sounds/musics/1.mp3'],
        volume: 0.2,
        preload: true
    });

    this.musique["Theme"] = new Howl({
        src: ['src/medias/sounds/musics/2.mp3'],
        volume: 0.2,
        preload: true
    });

    this.son["laser"] = new Howl({
        src: ['src/medias/sounds/sound_effects/gun.wav'],
        volume: 0.8,
        preload: true
    });

    this.son["gameover"] = new Howl({
        src: ['src/medias/sounds/sound_effects/Game_Over.mp3'],
        volume: 0.5,
        preload: true
    });


    this.son["hit"] = new Howl({
        src: ['src/medias/sounds/sound_effects/hit.wav'],
        volume: 1.0,
        preload: true
    });
};
// fonction qui permet de mute la musique (touche M)
Audio.prototype.couperMusique = function() {
    if (this.uneMusiqueON === true) {
        this.uneMusiqueON = false;
    } else {
        this.uneMusiqueON = true;
    }
    if (this.uneMusiqueON) {
        for (var m in this.musique) {
            this.musique[m].mute(false);
        }
    } else {
        for (var m in this.musique) {
            this.musique[m].mute(true);
        }
    }
};

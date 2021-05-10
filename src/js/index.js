let renderer,stats;

renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true ,
});


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//lancement du jeu
var lancementJeu = new Main();

function loop() {
    window.requestAnimationFrame(loop);
    renderer.render(lancementJeu, lancementJeu.camera);
    lancementJeu.animate();
    stats = new Stats();
    stats.domElement.style.position	= 'absolute';
    stats.domElement.style.bottom	= '0px';
    document.body.appendChild( stats.domElement );
};

if (!lancementJeu.init()) {
    loop();
}

import * as THREE from '../../../vendor/three/build/three.module.js';

function createAudioHelper() {

    const audioListener = new THREE.AudioListener();
    const loader = new THREE.AudioLoader();

    const sounds = [
        {url: 'assets/sound/birds.wav', audio: new THREE.Audio(audioListener), loop: true, autoplay: true},
        {url: 'assets/sound/ball_into_hole.wav', audio: new THREE.Audio(audioListener)},
        {url: 'assets/sound/clap.wav', audio: new THREE.Audio(audioListener)},
        {url: 'assets/sound/wood_thud.wav', audio: new THREE.Audio(audioListener)},
        {url: 'assets/sound/grass_thud.wav', audio: new THREE.Audio(audioListener)},
        {url: 'assets/sound/strike_medium_power.wav', audio: new THREE.Audio(audioListener)},
        {url: 'assets/sound/strike_high_power.wav', audio: new THREE.Audio(audioListener)},
    ];

    for(const sound of sounds) {
        loader.load(
            sound.url,
            //onLoad callback
            function(audioBuffer) {
                sound.audio.setBuffer(audioBuffer);
                if(sound.loop) {
                    sound.audio.setLoop(true);
                }
                if(sound.autoplay) {
                    sound.audio.autoplay = true;
                    sound.audio.play();
                }
            },

            //onProgress callback
            function (xhr) {
                //console.log(xhr.loaded / xhr.total * 100 + "%");
            },

            //onError callback
            function (error) {
                console.log("[Audio loader error]: " + error);
            }
        );
    }

    const audioHelper = {
        audioListener: audioListener,
        sounds: sounds,
    }

    audioHelper.resume = () => {
        for(const sound of sounds) {
            sound.audio.context.resume();
        }
    }

    audioHelper.playSound = (url, volume) => {
        if(volume === undefined || volume === null) {
            volume = 1.0;
        }
        for(const sound of sounds) {
            if(sound.url == url) {
                sound.audio.setVolume(volume);
                if(sound.audio.isPlaying) {
                    sound.audio.stop();
                }
                sound.audio.play();
                return;
            }
        }
    }



    return audioHelper;


}

export { createAudioHelper };

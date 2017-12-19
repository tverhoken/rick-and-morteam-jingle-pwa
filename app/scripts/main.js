(function() {
  'use strict';

  const JinglePlayer = function() {
    // The jingle Player.

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let source;
    let buffer;

    const loadSound = function(jingleNumber, bufferObj, callback) {
      callback = callback || function() {};

      fetch(`/sounds/ramj${jingleNumber}.mp3`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }).then(res => {
        if (res.ok) {
          return res.arrayBuffer();
        }
      }).then(arrayBuffer => {
        audioCtx.decodeAudioData(arrayBuffer, decodedBuffer => {
          callback(decodedBuffer);
        });
      }).catch(err => {
        console.error(err.message);
      });
    };


    this.start = function() {
      source = audioCtx.createBufferSource();

      source.connect(audioCtx.destination);

      source.buffer = buffer;

      source.start(0);
      source.loop = true;
      source.loopStart = 0.24;
      source.loopEnd = 0.34;
    };

    this.stop = function() {
      source.loop = false;
    };

    const init = function() {

      loadSound(1, buffer, function(decodedBuffer) {
        buffer = decodedBuffer;
      });
    };

    init();

  };

  const JingleController = function(root) {
    // Controls the jingle player.

    // var jingle = root.querySelector('.jingle');
    const jinglePlayer = new JinglePlayer();

    const start = function(e) {
      e.preventDefault();

      if(e.touches && e.touches.length > 1) {
        // Multi touch. OFF.
        return false;
      }

      // Play the sound
      // jingle.classList.add('playing');
      jinglePlayer.start();

    };

    const stop = function(e) {
      e.preventDefault();
      // Stop the sound
      // jingle.classList.remove('horning');
      jinglePlayer.stop();
    };

    root.addEventListener("mousedown", start);
    root.addEventListener("touchstart", start);

    document.documentElement.addEventListener("mouseup", stop);
    document.documentElement.addEventListener("touchend", stop);

  };

  const Installer = function(root) {

    const tooltip = root.querySelector('.tooltip');

    const install = function(e) {
      e.preventDefault();
      if (window.install) {
        window.install.prompt()
        .then(function(outcome) {
          // The user actioned the prompt (good or bad).
          root.classList.remove('available');
        })
        .catch(function(installError) {
          // Boo. update the UI.
          console.error(installError.message);
        });
      }
    };

    const init = function() {
      if (window.install) {
        window.install.canPrompt()
          .then(function() {
              root.classList.add('available');
          });
      }
    };

    root.addEventListener('click', install.bind(this));
    root.addEventListener('touchend', install.bind(this));

    init();
  };

  window.addEventListener('load', function() {
    const jingleEl = document.getElementById('jingle');
    const jingle = new JingleController(jingleEl);

    const installEl = document.getElementById('installer');
    const installer = new Installer(installEl);
  });
})();

(function() {
  'use strict'

  const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
  const audioSources = {}

  /**
   * 
   * @param {string} name
   * @return Promise
   */
  function loadSound(name) {
    return fetch(`/sounds/${name}.mp3`)
      .then(response => response.arrayBuffer())
  }

  function createAudioSource(audioCtx, audioData) {
    const source = audioCtx.createBufferSource()
    source.buffer = audioData
    source.connect(audioCtx.destination)
    return source
  }

  function play(audioContext, audioData) {
    return new Promise((resolve) => {
      const audioSource = createAudioSource(audioContext, audioData)
      audioSource.onended = () => {
        resolve()
      }
      audioSource.start()
    })
  }

  function playSound($event, name) {
    const promises = []
    if (!audioSources[name]) {
      promises.push(loadSound(name).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedData => audioSources[name] = decodedData, error => console.error(error)))
    }
    Promise.all(promises).then(() => {
      const element = document.querySelector(`.content .${name}`)
      element.classList.add('active')
      play(audioContext, audioSources[name]).then(() => element.classList.remove('active'))
    })
  }

  window.addEventListener('load', function() {
    console.log('init')
    document.querySelectorAll('.player').forEach(e => e.addEventListener('click', event => playSound(event, e.dataset.name)))
  });
})();

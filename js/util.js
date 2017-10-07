var log = console.log.bind(console)

function playMusic(musicId) {
    var audio = document.getElementById(musicId)
    if (audio != null) {
        audio.currentTime = 0;
        audio.play()
    }
}

function setEleContent(eleId, content) {
    document.getElementById(eleId).innerHTML = content
}
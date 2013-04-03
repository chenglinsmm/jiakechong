document.addEventListener('DOMContentLoaded', function () {
    replaceLinks();
});
var musicName;
var singer;
var album;
function replaceLinks() {
    var links = document.querySelectorAll('a');
    for (i = 0; i < links.length; i++) {
        var link = links[i];
        link.addEventListener("click", replacePage, false);
    }

}

function replacePage() {
    event.preventDefault();
    var href = this.href;
    var ajax = new XMLHttpRequest();
    ajax.open("GET", href, true);
    ajax.send();

    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && (ajax.status == 200)) {
            var body = document.querySelector('body');
            var bodyContent = grabBody(ajax.responseText, "body");
            body.addEventListener('webkitTransitionEnd', moveToRight, false);
            body.style.left = "-100%";
            window.addEventListener("popstate", handleBackButton);

            function moveToRight(event) {
                var body = document.querySelector('body');
                body.removeEventListener('webkitTransitionEnd', moveToRight, false);
                body.addEventListener('webkitTransitionEnd', returnToCenter, false);
                body.style.opacity = 0;
                body.style.left = "100%"
            }

            function returnToCenter(event) {
                var body = document.querySelector('body');
                body.removeEventListener('webkitTransitionEnd', returnToCenter, false);
                body.innerHTML = bodyContent;
                history.pushState(null, null, href);
                body.style.opacity = 1;
                body.style.left = 0;
                replaceLinks();
            }

            function handleBackButton(e) {

                var ajaxBack = new XMLHttpRequest();
                ajaxBack.open("GET", location.pathname, true);
                ajaxBack.send();

                ajaxBack.onreadystatechange = function () {
                    var bodyBack = document.querySelector('body');
                    var bodyBackContent = grabBody(ajaxBack.responseText, "body");
                    bodyBack.addEventListener('webkitTransitionEnd', moveToLeft, false);
                    bodyBack.style.left = "100%";

                    function backToCenter(event) {
                        var body = document.querySelector('body');
                        body.removeEventListener('webkitTransitionEnd', backToCenter, false);
                        body.innerHTML = bodyBackContent;
                        body.style.opacity = 1;
                        body.style.left = 0;
                        replaceLinks();
                    }

                    function moveToLeft(event) {
                        var body = document.querySelector('body');
                        body.removeEventListener('webkitTransitionEnd', moveToLeft, false);
                        body.addEventListener('webkitTransitionEnd', backToCenter, false);
                        body.style.opacity = 0;
                        body.style.left = "-100%"
                    }
                }
            }
        }
    }
    href = decodeURI(href);
    musicName = href.split("?")[1];
    singer = href.split("?")[2];
    album = href.split("?")[3];
}

function grabBody(html) {
    var tagStart = html.indexOf("<body");
    var start = html.indexOf(">", tagStart) + 1;
    var end = html.indexOf("</body", start);
    return html.slice(start, end);
}

function picZ(album) {
    if (album == "我是歌手") {
        album = "woshigeshou";
    }
    if (album == "真的见证") {
        album = "zhendejianzheng";
    }
    if (album == "海阔天空") {
        album = "haikuotiankong";
    }
    var pic_A = "img/" + album + ".jpg";
    document.getElementById("picture1").src = pic_A;

}
function picG(singer) {
    if (singer == "周晓欧") {
        singer = "zhouxiaoou";
    }
    var pic_S = "img/" + singer + ".jpg";
    document.getElementById("picture2").src = pic_S;
}

function sName(singer) {
    document.getElementById("S_name").innerHTML = "singer : " + singer;
}
function mName(musicName) {
    document.getElementById("M_name").innerHTML = musicName;
}
function aName(album) {
    document.getElementById("A_name").innerHTML = "《 " + album + " 》";
}

var my_media = null;
var mediaTimer = null;
function playAudio(src) {
    if (src == "我是歌手") {
        src = "woshigeshou";
    }
    if (src == "真的见证") {
        src = "zhendejianzheng";
    }
    if (src == "海阔天空") {
        src = "haikuotiankong";
    }
    var src = "/android_asset/www/" + src + ".mp3";
    //alert("src::" + src);
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);
    // Play audio
    my_media.play();
    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function () {
            var durTime = my_media.getDuration();
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function (position) {
                    if (position >= durTime) {
                        position = durTime;
                        document.getElementById('overLoad').style.width = 0 + "px";
                    }
                    document.getElementById('overLoad').style.width = position / durTime * 220 + "px";
                    //document.getElementById('showTime').innerHTML = "timeRemaining:" + (durTime - position) + "millisecond";

                    if (position > -1) {
                        setAudioPosition((position.toFixed(1)) + " sec");
                    }
                },
                // error callback
                function (e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 10);
    }
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

function changePlay() {
    var pause = document.getElementById("pause");
    pause.style.display = "none";
    var play = document.getElementById("play");
    play.style.display = "";
    if (my_media) {
        my_media.pause();
    }
}

function changePause() {
    var pause = document.getElementById("pause");
    pause.style.display = "";
    var play = document.getElementById("play");
    play.style.display = "none";
    my_media.play();
}

function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

function ForwardAudio(src) {
    stopAudio();
    playAudio(src);
}
function BackAudio() {
    console.log("跳转到page2");
    stopAudio();
//    setTimeout(function () {
//        playAudio(src);
//    }, -10000);
}

function toEndAudio() {
    console.log("跳转到page1");
    stopAudio();
}





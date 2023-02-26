const bgm0 = document.querySelector("#bgm0");
const btn = document.querySelector("#btn-play");

btn.innerHTML = '<i class="fas fa-play">Play</i>';  // 「再生ボタン」に切り替え
bgm0.pause();

btn.addEventListener("click", () => {
    // pausedがtrue=>停止, false=>再生中
    if (!bgm0.paused) {
        btn.innerHTML = '<i class="fas fa-play">Play</i>';  // 「再生ボタン」に切り替え
        bgm0.pause();
    }
    else {
        btn.innerHTML = '<i class="fas fa-pause">Pause</i>';  // 「一時停止ボタン」に切り替え
        bgm0.play();
    }
});

const bgm0 = document.querySelector("#bgm0");
const btn = document.querySelector("#btn-play");
let v = document.getElementById('video0');
v.addEventListener('ended', () => { alert(score + "点...普通だな！"); });

//キャンバス名"cvs"
const cvs = document.getElementById("myCanvas");

//キャンバスの内容名"ctx"
const ctx = cvs.getContext("2d");

//ゲームの横と縦
const width = cvs.width * 2 / 3;
const height = cvs.height;

let frame = 0;
let dispframe = 0;
let score = 0;
let MAXsperf = 0;

btn.innerHTML = '<font face="あんずもじ2020">Start</font>';  // 「開始ボタン」に切り替え


//キーボード入力について
document.addEventListener('keydown', keydownEvent, false);
document.addEventListener('keyup', keyupEvent, false);

let rightPressed = false;
let leftPressed = false;

function keydownEvent(e) {
    if (e.code == "ArrowRight") { rightPressed = true; }
    if (e.code == "ArrowLeft") { leftPressed = true; }
    if (e.code == "Space") {PlayPause();}
}
function keyupEvent(e) {
    if (e.code == "ArrowRight") { rightPressed = false; }
    if (e.code == "ArrowLeft") { leftPressed = false; }
}


//左右ボタン
const btnL = document.querySelector("#btn-left");
const btnR = document.querySelector("#btn-right");

btnL.ontouchstart = function () { leftPressed = true; };
btnR.ontouchstart = function () { rightPressed = true; };
btnL.ontouchend = function () { leftPressed = false; };
btnR.ontouchend = function () { rightPressed = false; };


//ベクトルの定義
const vec = class {
    constructor(_x, _y) {
        this.x = _x
        this.y = _y
    }
    distance() { return (this.x ** 2 + this.y ** 2) ** (1 / 2); }
}
function add(vec0, vec1) { return new vec(vec0.x + vec1.x, vec0.y + vec1.y); }
function sub(vec0, vec1) { return new vec(vec0.x - vec1.x, vec0.y - vec1.y); }
function mul(vec0, r) { return new vec(vec0.x * r, vec0.y * r); }


function init() {
    btn.innerHTML = '<font face="あんずもじ2020">Start</font>';  // 「開始ボタン」に切り替え
    bgm0.pause();   //これがあった方が読み込みが速い気がする

    frame = 0;
    dispframe = 0;
    score = 0;
    MAXsperf = 0;

}

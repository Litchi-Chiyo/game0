document.addEventListener('keydown', keydownEvent, false);
document.addEventListener('keyup', keyupEvent, false);
function keydownEvent(e) {
	if (e.code == "ArrowRight") { rightPressed = true; }
	if (e.code == "ArrowLeft") { leftPressed = true; }
}

function keyupEvent(e) {
	if (e.code == "ArrowRight") { rightPressed = false; }
	if (e.code == "ArrowLeft") { leftPressed = false; }
}

let rightPressed = false;
let leftPressed = false;


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

let score = 0;

//キャンバス名"cvs"
const cvs = document.getElementById("myCanvas");

//キャンバスの内容名"ctx"
const ctx = cvs.getContext("2d");

//ゲームの横と縦
const width = cvs.width * 2 / 3;
const height = cvs.height;

//円の生成
const ballr = 10;							//半径
let ballp = new vec(width / 2, height / 2);	//座標
let ballv = new vec(0, 10);					//速度

//板の生成
const boardr = 50;		//板の半径
let boardp = new vec(width / 2, height);
let effect = 0;			//反射した時に出るエフェクトの不透明度

//箱について
let brickRowCount = 6;//行数
let brickColumnCount = 6;//列数
let brickWidth = 75;//横幅
let brickHeight = 20;//縦幅
let brickPadding = (width - brickWidth * brickColumnCount) / (brickColumnCount + 1);//箱間の隙間
let brickOffsetTop = brickPadding;//位置
let brickOffsetLeft = brickPadding;

//箱の生成
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	//bricksの[c]番目の[r]番目にxとして0、yとして0、statusとして1を代入
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { hide: Math.floor(Math.random() * 4), status: 1 };
	}

}

function play() {
	if (!bgm0.paused) {
		//板の移動
		if (rightPressed) {
			boardp.x += 8;
			if (width < boardp.x + boardr) { boardp.x = width - boardr; }
		}
		if (leftPressed) {
			boardp.x -= 8;
			if (boardp.x - boardr < 0) { boardp.x = boardr; }
		}

		//円の移動
		ballp = add(ballp, ballv);

		//箱との衝突
		for (let c = 0; c < brickColumnCount; c++) {
			for (let r = 0; r < brickRowCount; r++) {
				if (bricks[c][r].status == 1) {
					let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
					let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

					if (brickY - ballr <= ballp.y && ballp.y <= brickY + brickHeight + ballr && brickX - ballr <= ballp.x && ballp.x <= brickX + brickWidth + ballr) {
						bricks[c][r].status = 0;
						score++;
						new Audio("ひで" + Math.floor(Math.random() * 5) + ".wav").play();

						if (brickX <= ballp.x && ballp.x <= brickX + brickWidth) { ballv.y *= -1; }
						else if (brickY <= ballp.y && ballp.y <= brickY + brickHeight) { ballv.x *= -1; }
						else { ballv = mul(ballv, -1); }

					}
				}

			}
		}


		//反射
		if (ballp.x <= ballr) { ballv.x = -ballv.x; ballp.x = ballr + 1; }
		if (width - ballr <= ballp.x) { ballv.x = -ballv.x; ballp.x = width - ballr - 1; }


		if (ballp.y - ballr <= 0) { ballv.y = -ballv.y; ballp.y = ballr + 1; }
		//板との衝突
		let collisionjudge = boardr + ballr >= sub(ballp, boardp).distance();
		if (collisionjudge) {
			let direction = sub(ballp, boardp);
			ballv = mul(mul(direction, 1 / direction.distance()), ballv.distance());
			effect = 1;
			new Audio("バレーボール音3.wav").play();
		}

		draw();

		//落下した時
		if (height + ballr <= ballp.y) {

			bgm0.pause();

			new Audio("バレーボール男「あ」.wav").play();

			let v = document.getElementById('video0');
			v.addEventListener('ended', (event) => { alert(score + "点...普通だな！"); });
			v.play();

			//btn.innerHTML = 'Play';  // 「再生ボタン」に切り替え

			clearInterval(interval);
		}
	}
}

//描画
function draw() {


	//範囲内を消す
	ctx.clearRect(0, 0, cvs.width, height);

	//背景の描画
	ctx.beginPath();
	ctx.fillStyle = "rgba(240, 240, 240, 1)";	//白
	ctx.fillRect(0, 0, cvs.width, height);

	//バレー兄貴の描画
	let image0 = new Image();
	image0.src = "バレー兄貴.png";
	ctx.drawImage(image0, boardp.x - 60, boardp.y - 120);

	//バレーボールの描画
	let image1 = new Image();
	image1.src = "バレーボール.png";
	ctx.drawImage(image1, ballp.x - 20, ballp.y - 20);


	//板の描画
	ctx.beginPath();
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "rgba(0, 0, 0,1)";	//黒
	ctx.arc(boardp.x, boardp.y, boardr, 0, 2 * Math.PI);	//円
	ctx.fill();
	ctx.strokeStyle = "rgba(0, 0, 0, " + effect + ")";	//黒
	ctx.arc(boardp.x, boardp.y, boardr + ballr, 0, 2 * Math.PI);	//円
	ctx.stroke();
	ctx.globalAlpha = 1;

	if (effect != 0) {
		effect -= 0.02;
	}




	//円の描画
	ctx.beginPath();
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "rgba(255, 0, 0,1)";	//赤
	ctx.arc(ballp.x, ballp.y, ballr, 0, 2 * Math.PI);
	ctx.fill();
	ctx.globalAlpha = 1;

	//箱描画
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

				//ひでの描画
				let image2 = new Image();
				image2.src = "ひで" + bricks[c][r].hide + ".png";
				ctx.drawImage(image2, brickX, brickY - 20);

				ctx.beginPath();
				ctx.beginPath();
				ctx.globalAlpha = 0.8;
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "rgba(127,127,127,1)";
				ctx.fill();
				ctx.globalAlpha = 1;
			}
		}
	}

	//変数欄
	ctx.beginPath();
	ctx.fillStyle = "rgba(0, 0, 0, 1)";	//黒
	ctx.fillRect(width, 0, cvs.width, height);

	const fontSize = 60;

	ctx.beginPath();
	ctx.font = fontSize + "px 'あんずもじ2020'";
	ctx.fillStyle = "rgba(255, 255, 255, 1)";	//白
	ctx.fillText("x:" + Math.floor(ballp.x), width + 30, fontSize);
	ctx.fillText("y:" + Math.floor(ballp.y), width + 30, fontSize * 2);
	ctx.fillText("vx:" + Math.floor(ballv.x), width + 30, fontSize * 3);
	ctx.fillText("vy:" + Math.floor(ballv.y), width + 30, fontSize * 4);
	ctx.fillText("score:" + score, width + 30, fontSize * 5);

}

//60fpsで関数playを実行
const interval = setInterval(play, 1000 / 60);
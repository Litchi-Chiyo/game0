function setBB() {

	//入力から初速度を得る
	ballv = new vec(0, parseInt(document.getElementById("number2").value, 10));

	//箱について
	brickRowCount = parseInt(document.getElementById("number0").value, 10);			//行数
	brickColumnCount = parseInt(document.getElementById("number1").value, 10);		//列数
	brickPadding = (width - brickWidth * brickColumnCount) / (brickColumnCount + 1);//箱間の隙間
	brickOffsetTop = brickPadding;//左上の座標
	brickOffsetLeft = brickPadding;

	//全箱数
	brickLeft = brickColumnCount * brickRowCount;

	//bricksの初期化
	bricks = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		//bricksの[c]番目の[r]番目にstatusとして1を代入、hideはテクスチャの番号（0~3）
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { hide: Math.floor(Math.random() * 4), status: 1 };
		}
	}
}

//Play/Pauseボタン
btn.addEventListener("click", () => {
    PlayPause();
});

function PlayPause() {
    if (v.paused) {
        // pausedがtrue=>停止, false=>再生中
        if (!bgm0.paused) {
            btn.innerHTML = '<font face="あんずもじ2020">Play</font>';  // 「再生ボタン」に切り替え
            bgm0.pause();
        } else {
            btn.innerHTML = '<font face="あんずもじ2020">Pause</font>';  // 「一時停止ボタン」に切り替え
            bgm0.play();
            if(frame == 0){
                setBB();
            }
        }
    }
}

//円の生成
const ballr = 10;							//半径
let ballp = new vec(width / 2, height / 2);	//座標
let ballv = new vec(0, 10);					//速度

//板の生成
const boardr = 50;							//板の半径
let boardp = new vec(width / 2, height);	//板の位置
let effect = 0;								//反射した時に出るエフェクトの不透明度

//箱について
let brickRowCount = 1;
let brickColumnCount = 1;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 1
let brickOffsetTop = 1
let brickOffsetLeft = 1

let brickLeft = brickColumnCount * brickRowCount;

//箱の生成
let bricks = [];

//円と箱を初期化する
setBB();

init();

//60fpsで関数playを実行
const interval = setInterval(play, 1000 / 60);

//実行部分
function play() {
	//bgmがonなら
	if (!bgm0.paused) {
		//板の移動
		if (rightPressed) {
			boardp.x += 8;
			if (width < boardp.x + boardr) { boardp.x = width - boardr; }//右壁判定
		}
		if (leftPressed) {
			boardp.x -= 8;
			if (boardp.x - boardr < 0) { boardp.x = boardr; }//左壁判定
		}

		//円の移動
		ballp = add(ballp, ballv);

		//箱との衝突
		for (let c = 0; c < brickColumnCount; c++) {
			for (let r = 0; r < brickRowCount; r++) {
				if (bricks[c][r].status == 1) {
					let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
					let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

					//少なくともぶつかっているとき
					if (brickY - ballr <= ballp.y && ballp.y <= brickY + brickHeight + ballr && brickX - ballr <= ballp.x && ballp.x <= brickX + brickWidth + ballr) {
						bricks[c][r].status = 0;
						score++;
						new Audio("ひで" + Math.floor(Math.random() * 5) + ".wav").play();
						brickLeft--;

						if (brickX <= ballp.x && ballp.x <= brickX + brickWidth) { ballv.y *= -1; }			//上下から
						else if (brickY <= ballp.y && ballp.y <= brickY + brickHeight) { ballv.x *= -1; }	//左右から
						else { ballv = mul(ballv, -1); }													//斜めから

					}
				}

			}
		}


		//反射
		if (ballp.x <= ballr) { ballv.x = -ballv.x; ballp.x = ballr + 1; }					//左の壁、めり込み防止のため+1
		if (width - ballr <= ballp.x) { ballv.x = -ballv.x; ballp.x = width - ballr - 1; }	//右の壁、同じく
		if (ballp.y - ballr <= 0) { ballv.y = -ballv.y; ballp.y = ballr + 1; }				//天井、同じく


		//板との衝突
		let collisionjudge = boardr + ballr >= sub(ballp, boardp).distance();	//二つの円の半径の和>=二つの円の距離：接しているかめり込んでいる
		if (collisionjudge) {
			let direction = sub(ballp, boardp);		//法線ベクトル、大きさは適当
			ballv = mul(mul(direction, 1 / direction.distance()), ballv.distance());	//速度ベクトルを、法線ベクトルの向きで元の速度ベクトルの大きさを持つモノにする
			effect = 1;								//板のエフェクト
			new Audio("バレーボール音3.wav").play();
		}


		//時間を進める
		frame++;
		//箱が残ってたら更新
		if (0 < brickLeft) { dispframe = frame; }

		//描画
		draw();

		//落下した時
		if (height + ballr <= ballp.y) {

			bgm0.pause();

			new Audio("バレーボール男「あ」.wav").play();

			v.play();

			btn.innerHTML = '<font face="あんずもじ2020">Play</font>';  // 「再生ボタン」に切り替え

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

	if (MAXsperf < score / frame) {
		MAXsperf = score / frame;
	}

	//変数欄
	ctx.beginPath();
	ctx.fillStyle = "rgba(0, 0, 0, 1)";	//黒
	ctx.fillRect(width, 0, cvs.width, height);

	const fontSize = 50;

	ctx.beginPath();
	ctx.font = fontSize + "px 'あんずもじ2020'";
	ctx.fillStyle = "rgba(255, 255, 255, 1)";	//白
	ctx.fillText("x:" + Math.floor(ballp.x), width + 30, fontSize);
	ctx.fillText("y:" + Math.floor(ballp.y), width + 30, fontSize * 2);
	ctx.fillText("vx:" + Math.floor(ballv.x), width + 30, fontSize * 3);
	ctx.fillText("vy:" + Math.floor(ballv.y), width + 30, fontSize * 4);
	ctx.fillText("score:" + score, width + 30, fontSize * 5);
	ctx.fillText("frame:" + dispframe, width + 30, fontSize * 6);
	ctx.fillText("1000*s/f:", width + 30, fontSize * 7);
	ctx.fillText("" + Math.floor(1000 * score / dispframe), width + 30, fontSize * 8);
	ctx.fillText("MAX1000*s/f:", width + 30, fontSize * 9);
	ctx.fillText("" + Math.floor(1000 * MAXsperf), width + 30, fontSize * 10);

}

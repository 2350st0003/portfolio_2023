var FIELD_W = 300, FIELD_H = 600;
var COLS = 10, ROWS = 20;
var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
var current_mino;
var current_x = 3, current_y = 0;
var field = [];


//画面の作成

for (var y = 0; y < ROWS; y++) {
  field[y] = [];
  for (var x = 0; x < COLS; x++) {
    field[y][x] = 0;
  }
}

//ブロックの読み込み
current_mino = newMino();

//ブロックの表示
render();

setInterval(tick, 300);　// 500ミリ秒 = 0.5秒ごとに繰り返す

//ブロックの描画
function render() {
  ctx.clearRect(0, 0, FIELD_W, FIELD_H);
  //ctx.strokeStyle = "black";

  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      drawBlock(x, y, field[y][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      //ブロックの描画
	  drawBlock(current_x + x, current_y + y, current_mino[y][x]);
    }
  }
}

//ブロックの描画
function drawBlock(x, y, block) {
  if (block) {
    ctx.fillStyle = COLORS[block - 1];
    ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
  }
}


//動きの処理
function tick() {
  if (canMove(0, 1)) {
    current_y++;
  }else if(current_x == 3 && current_y == 0){
        document.getElementById("gemeover").style.display="block";
  } else {
    fix(); // canMove()がfalseならfix()する
    clearRows();
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
  }
  render();
}


function fix() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x  + x] = current_mino[y][x];
      }
    }
  }
}


// 下に動ける場合はtrue，動けない場合はfalseを返す関数

function canMove(move_x, move_y, move_mino) {
  var next_x = current_x + move_x; // 次に動こうとするx座標
  var next_y = current_y + move_y; // 次に動こうとするy座標
  var next_mino = move_mino || current_mino;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (next_mino[y][x]) {
		if (next_y + y >= ROWS // 下の枠を超えていたら
              || next_x + x < 0
              || next_x + x >= COLS
              || field[next_y + y][next_x + x]) { // すでにブロックがある
          return false;
        }
      }
    }
  }
  return true;
}


function clearRows() {
  for (var y = ROWS - 1; y >=0; y--) {
    var fill = true;
    for (var x = 0; x < COLS; x++) {
      if (field[y][x] == 0) {
        fill = false;
        break;
      }
    }
    if (fill) {
      for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < COLS; x++) {
          field[v + 1][x] = field[v][x];
        }
      }
        getPoint();
      y++;
    }
  }
}
var pv = 0;
function getPoint(){
    pv += 10;
    document.getElementById("point").innerHTML = pv;
}


// ブロックの操作
document.body.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      if (canMove(-1, 0)) {
        current_x--;
      }
      break;
    case 39:
      if (canMove(1, 0)) {
        current_x++;
      }
      break;
    case 40:
      if (canMove(0, 1)) {
        current_y++;
      }
      break;
    case 38:
    case 32:
      rotated = rotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
      }
      break;
  }
  render();
}

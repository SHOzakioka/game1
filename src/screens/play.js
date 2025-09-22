// 既存のgame.jsの内容をここに移動
// ゲーム関連の変数
let playerHealth = 100;
let gameLoop;

// プレイヤーの移動処理
function movePlayer(event) {
    const player = document.getElementById('player');
    const currentPosition = parseInt(player.style.left) || 375;
    const moveAmount = 20;

    if (event.key === 'ArrowLeft' && currentPosition > 0) {
        player.style.left = (currentPosition - moveAmount) + 'px';
    } else if (event.key === 'ArrowRight' && currentPosition < 750) {
        player.style.left = (currentPosition + moveAmount) + 'px';
    }
}

// 炎の生成
function createFire() {
    const fire = document.createElement('div');
    fire.className = 'fire';
    fire.style.left = Math.random() * 770 + 'px';
    fire.style.top = '0px';
    document.getElementById('game-area').appendChild(fire);

    const fallSpeed = 2;
    const fireInterval = setInterval(() => {
        const currentTop = parseInt(fire.style.top);
        if (currentTop > 600) {
            clearInterval(fireInterval);
            fire.remove();
        } else {
            fire.style.top = (currentTop + fallSpeed) + 'px';
            checkCollision(fire);
        }
    }, 16);
}

// 衝突判定
function checkCollision(fire) {
    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();
    const fireRect = fire.getBoundingClientRect();

    if (playerRect.left < fireRect.right &&
        playerRect.right > fireRect.left &&
        playerRect.top < fireRect.bottom &&
        playerRect.bottom > fireRect.top) {
        
        takeDamage();
        fire.remove();
    }
}

// ダメージ処理
function takeDamage() {
    playerHealth -= 10;
    updateHealthBar();

    if (playerHealth <= 0) {
        gameOver();
    }
}

// 体力ゲージの更新
function updateHealthBar() {
    const healthBar = document.querySelector('.hp-fill');
    healthBar.style.width = playerHealth + '%';
}

// ゲームオーバー処理
function gameOver() {
    clearInterval(gameLoop);
    document.removeEventListener('keydown', movePlayer);
    document.getElementById('game-over').classList.remove('hidden');
}

// ゲーム再スタート
function restartGame() {
    playerHealth = 100;
    updateHealthBar();
    document.getElementById('game-over').classList.add('hidden');
    startGame();
}

// ゲーム開始
function startGame() {
    // 既存のイベントリスナーとインターバルをクリア
    document.removeEventListener('keydown', movePlayer);
    if (gameLoop) clearInterval(gameLoop);

    // 初期化
    playerHealth = 100;
    updateHealthBar();
    document.getElementById('game-over').classList.add('hidden');

    // イベントリスナーの設定
    document.addEventListener('keydown', movePlayer);

    // 炎の生成を開始
    gameLoop = setInterval(createFire, 1000);
}

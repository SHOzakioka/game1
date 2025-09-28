document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const loadButton = document.getElementById('load-button');
    const topScreen = document.getElementById('top-screen');
    const playScreen = document.getElementById('play-screen');

    // PLAYボタンクリック時の処理
    playButton.addEventListener('click', () => {
        console.log('Play button clicked'); // デバッグ用
        topScreen.classList.add('hidden');
        playScreen.classList.remove('hidden');
        // グローバル関数としてstartGameを呼び出し
        window.startGame();
    });

    // LOADボタンクリック時の処理
    loadButton.addEventListener('click', () => {
        // TODO: セーブデータ読み込み処理
        console.log('Load game data');
    });
});
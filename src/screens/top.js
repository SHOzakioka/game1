document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const loadButton = document.getElementById('load-button');
    const topScreen = document.getElementById('top-screen');
    const playScreen = document.getElementById('play-screen');

    // PLAYボタンクリック時の処理
    playButton.addEventListener('click', () => {
        topScreen.classList.add('hidden');
        playScreen.classList.remove('hidden');
        // ゲーム開始処理を呼び出し
        if (typeof startGame === 'function') {
            startGame();
        }
    });

    // LOADボタンクリック時の処理
    loadButton.addEventListener('click', () => {
        // TODO: セーブデータ読み込み処理
        console.log('Load game data');
    });
});

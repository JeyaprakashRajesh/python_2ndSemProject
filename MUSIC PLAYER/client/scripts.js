document.addEventListener('DOMContentLoaded', function() {
    loadAllMusic();
    document.querySelector('.all').addEventListener('click', loadAllMusic);
    document.querySelector('.playlist').addEventListener('click', loadPlaylist);
    document.querySelector('.liked').addEventListener('click', loadLikedMusic);
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('seekBar').addEventListener('input', seekAudio);
    document.getElementById('audioPlayer').addEventListener('timeupdate', updateSeekBar);
    document.getElementById('prevBtn').addEventListener('click', playPrevSong);
    document.getElementById('nextBtn').addEventListener('click', playNextSong);
    document.getElementById('likeBtn').addEventListener('click', toggleLike);
    document.getElementById('addToPlaylistBtn').addEventListener('click', addToPlaylist);
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/login/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/client/index.html';
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error during login:', error));
    });
    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/signup/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/client/login.html';
            } else {
                alert('Error during signup');
            }
        })
        .catch(error => console.error('Error during signup:', error));
    });
});

let currentSongIndex = -1;
let musicList = [];

function loadAllMusic() {
    fetch('http://localhost:8000/api/all_music/')
    .then(response => response.json())
    .then(data => {
        musicList = data;
        displayMusicList(data);
    })
    .catch(error => console.error('Error loading all music:', error));
}
function loadLikedMusic() {
    fetch('http://localhost:8000/api/liked_music/1/')
    .then(response => response.json())
    .then(data => {
        musicList = data;
        displayMusicList(data);
    })
    .catch(error => console.error('Error loading liked music:', error));
}
function loadPlaylist() {
    fetch('http://localhost:8000/api/playlist/1/')
    .then(response => response.json())
    .then(data => {
        musicList = data;
        displayMusicList(data);
    })
    .catch(error => console.error('Error loading playlist:', error));
}
function displayMusicList(data) {
    const bottomRightSection = document.querySelector('.bottomRight');
    bottomRightSection.innerHTML = '';
    data.forEach(song => {
        const musicItemDiv = document.createElement('div');
        musicItemDiv.classList.add('musicItem');
        musicItemDiv.innerHTML = `
            <img src="../music_player_backend${song.poster}" alt="${song.title} poster">
            <div class="details">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `;
        musicItemDiv.addEventListener('click', function() {
            playMusic(song.audio_file, song.poster, song.title, song.artist);
            currentSongIndex = data.indexOf(song);
        });
        bottomRightSection.appendChild(musicItemDiv);
    });
}
function playMusic(audioSrc, poster, title, artist) {
    document.getElementById('currentPoster').src = `../music_player_backend${poster}`;
    document.getElementById('currentTitle').textContent = `Title : ${title}`;
    document.getElementById('currentArtist').textContent = `Artist : ${artist}`;
    const currentPoster = document.getElementById('currentPoster');
    const audioControls = document.querySelector('.audio-controls');
    const likeBtn = document.getElementById('likeBtn');
    const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
    if (currentPoster.style.display === 'none') {
        currentPoster.style.display = 'block';
    }
    if (audioControls.style.display === 'none') {
        audioControls.style.display = 'flex';
    }
    likeBtn.style.display = 'inline-block';
    addToPlaylistBtn.style.display = 'inline-block';
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = `../music_player_backend${audioSrc}`;
    audioPlayer.play();
    document.getElementById('playPauseBtn').style.backgroundImage = "url('../client/pics/pausebutton.png')";
}
function togglePlayPause() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (audioPlayer.src) {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.style.backgroundImage = "url('../client/pics/pausebutton.png')";
        } else {
            audioPlayer.pause();
            playPauseBtn.style.backgroundImage = "url('../client/pics/playbutton.png')";
        }
    } else {
        alert('Please select a song first');
    }
}
function seekAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    const seekBar = document.getElementById('seekBar');
    const seekTo = audioPlayer.duration * (seekBar.value / 100);
    audioPlayer.currentTime = seekTo;
}
function updateSeekBar() {
    const audioPlayer = document.getElementById('audioPlayer');
    const seekBar = document.getElementById('seekBar');
    if (!isNaN(audioPlayer.duration)) {
        const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekBar.value = value;
    }
}
function playPrevSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        const prevSong = musicList[currentSongIndex];
        playMusic(prevSong.audio_file, prevSong.poster, prevSong.title, prevSong.artist);
    }
}
function playNextSong() {
    if (currentSongIndex < musicList.length - 1) {
        currentSongIndex++;
        const nextSong = musicList[currentSongIndex];
        playMusic(nextSong.audio_file, nextSong.poster, nextSong.title, nextSong.artist);
    }
}
function toggleLike() {
    const likeBtn = document.getElementById('likeBtn');
    const song = musicList[currentSongIndex];
    if (likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        likeBtn.classList.add('defaultLike');
    } else {
        likeBtn.classList.remove('defaultLike');
        likeBtn.classList.add('liked');
    }
}
function addToPlaylist() {
    const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
    const song = musicList[currentSongIndex];
    if (addToPlaylistBtn.classList.contains('addedToPlaylist')) {
        addToPlaylistBtn.classList.remove('addedToPlaylist');
        addToPlaylistBtn.classList.add('defaultPlaylist');  
        addToPlaylistBtn.disabled = false;
    } else {
        addToPlaylistBtn.classList.remove('defaultPlaylist');
        addToPlaylistBtn.classList.add('addedToPlaylist');  
        addToPlaylistBtn.disabled = true;
    }
}
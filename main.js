const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Say",
            singer: "Lena, T.R.I",
            path: "./source/Say.mp3",
            image: "./source/Say.jpg",
            count: 0
        },
        {
            name: "Nắm Đôi Bàn Tay",
            singer: "Kay Trần",
            path: "./source/Nắm Đôi Bàn Tay.mp3",
            image: "./source/Nam doi ban tay.jpg",
            count: 0
        },
        {
            name: "Bắt Vía",
            singer: "Hoàng Thùy Linh, Wren Evans, Mew Amazing",
            path: "./source/Bắt Vía.mp3",
            image: "./source/link.jpg",
            count: 0
        },
        {
            name: "Đi Qua Cầu Vồng",
            singer: "Phúc Bồ, Kelie, Rick",
            path: "./source/Đi_Qua_Cầu_Vồng.mp3",
            image: "./source/di qua cau vong.jfif",
            count: 0
        },
        {
            name: "Every Summertime",
            singer: "Nikki",
            path: "./source/Every Summertime.mp3",
            image: "./source/every summer.jpg",
            count: 0
        },
        {
            name: "Feels",
            singer: "Calvin Harris, Pharrell Williams, Katy Perry & Big Sean",
            path: "./source/Feels.mp3",
            image: "./source/feels.jfif",
            count: 0
        },
        {
            name: "One Kiss",
            singer: "Calvin Harris, Dua Lipa",
            path: "./source/One Kiss.mp3",
            image: "./source/one kiss.jfif",
            count: 0
        },
    ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    ${song.count}
                </div>
            </div>
            `
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function( ){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lí quay CD
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'} 
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimation.pause();

        // Xử lí phóng to, thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // Xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Khi bài hát được chạy
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            app.currentSong.count++;
            cdThumbAnimation.play();
        }
        // Khi bài hát dừng
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }
        // Xử lí khi tua
        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration /100;
            audio.currentTime = seekTime;
        }
        // Chuyển bài hát
        nextBtn.onclick = function(){
            if (_this.isRandom){
                app.playRandomSong();
            }
            else app.nextSong();
            _this.render();
            audio.play();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function(){
            if (_this.isRandom){
                app.playRandomSong();
            }
            else app.prevSong();
            _this.render();
            audio.play();
            _this.scrollToActiveSong();
        }
        // Random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }

        // Khi bài hát kết thúc
        audio.onended = function(){
            nextBtn.click();
            audio.play();
        }
        // Lặp
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        audio.onened = function(){
            if (_this.isRepeat){
                audio.play();
            }
            else nextBtn.click();
        }
        // Khi click vào playlist
        playlist.onclick = function(e){
            const songNotActive = e.target.closest('.song:not(.active)');
            if( songNotActive || e.target.closest('option')) {
                // Click vào bài hát
                if(songNotActive){
                    _this.currentIndex = Number(songNotActive.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        },300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex === this.songs.length)
            this.currentIndex = 0;
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = 0;
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do {
            newIndex= Math.floor(Math.random()*this.songs.length);
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Định nghĩa thuộc tính object
        this.defineProperties();

        // Lắng nghe, xử lí sự kiện
        this.handleEvents();

        // Tải thông tin bài hát
        this.loadCurrentSong();

        // Render playlist
        this.render();

    }
}

app.start();


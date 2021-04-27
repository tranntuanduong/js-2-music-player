/**
 * 1. Render songs --> OK
 * 2. Scroll top --> OK
 * 3. Play / pause / seek --> OK
 * 4. CD rotate --> OK
 * 5. Next / prev --> OK
 * 6. Random
 * 7. Next / repeat  when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click  
 */


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('.dashboard__header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress');
const nextBtn = $('.btn-forward');
const prevBtn = $('.btn-backward');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');



const cd = $('.cd');

const playBtn = $('.btn-play');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Ocean ",
            singer: "Martin Garrix,Khalid",
            path: "./music/song1.mp3",
            image:  "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "SonWho Do You Loveg2",
            singer: "The Chainsmokers,5 Seconds Of Summer",
            path: "./music/song2.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Lost Control",
            singer: "Alan Walker,Sorana",
            path: "./music/song3.mp3",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "Fly Away",
            singer: "TheFatRat,Anjulie",
            path: "./music/song4.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2017/09/12/b/f/0/6/1505189629603.jpg"
        },
        {
            name: "Different World - Alan Walker,K-391,Sofia Carson,CORSAK",
            singer: "Alan Walker,K-391,Sofia Carson,CORSAK",
            path: "./music/song5.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2018/11/28/0/3/4/b/1543395088992.jpg"
        },
        {
            name: "Burn Out",
            singer: "Martin Garrix,Justin Mylo,Dewain Whitmore",
            path: "./music/song6.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2018/09/13/9/1/0/f/1536850928647.jpg"
        },
        {
            name: "Move Your Body",
            singer: "Sia",
            path: "./music/song7.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2018/06/23/2/e/9/c/1529742904738.jpg"
        },
        {
            name: "Diamond Heart",
            singer: "Sophia Somajo",
            path: "./music/song8.mp3",
            image: "https://avatar-nct.nixcdn.com/song/2018/09/27/d/c/3/0/1538059705399.jpg"
        },
       
    ],   

    render: function() {
        
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <div class="body__title">${song.name}</div>
                        <div class="body__singer">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 250)
    },

    handleEvents: function() {
        const _this = this;
        // Xu ly phong to thu nho CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xu li khi click play
        playBtn.onclick = function(e) { 
            if (_this.isPlaying) {
                audio.pause(); 
            } else {
                audio.play();
            } 
        }

        // Thay doi trang thai nut khi click vao nut play
        audio.onplay = function() {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Tien do bai hat
        audio.ontimeupdate = function() {
            if (this.duration) {
                var progessPercent = this.currentTime * 100 / this.duration;
                progress.value = progessPercent;
            }
        }

        // xu li khi tua
        progress.onchange = function(e) {
            audio.currentTime = e.target.value * audio.duration / 100;
        }

        // Xu li quay dia CD
        // Element animate js
        const cdThumbAnimate = cdThumb.animate(
            // Keyframe
            [
                {
                    transform: 'rotate(360deg)'
                }
            ],
            // Option
            {
                duration: 10000,
                iterations: Infinity
            }   
        )
        cdThumbAnimate.pause()

        // Xu li khi next song
        nextBtn.onclick = function(e) {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        // Xu li khi lui bai hat
        prevBtn.onclick = function(e) {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        // Xu li khi nhan random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active');      
        }

        // Xu li khi het bai hat
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xu li khi nhan repeat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }

        // Xu li khi click vao bai hat
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if (e.target.closest('.option')) {
                    alert('chua lam chuc nang nay')
                } else if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();  
                    audio.play();
                }       
            }
        }

        // Xu li scroll into view
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        // update song active
        $('.song.active').classList.remove('active')
        var currentSongIndex = this.songs.findIndex((song) => {
            return song.name === this.currentSong.name;
        });
        var songElement = $(`[data-index='${currentSongIndex}']`);
        songElement.classList.add('active')  
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    start: function() {
        this.defineProperties();

        this.render();

        this.loadCurrentSong();

        this.handleEvents();
    }
}

app.start();


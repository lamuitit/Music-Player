const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2')
const cd_thumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-play')
const player = $('.player')
const progress = $('#progress')


const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRepeat = $('.btn-repeat')
const btnRandom = $('.btn-random')

const playList = $('.playlist')


const app = {
    currentIndex: 0,
    isRandom: false,
    isPlaying : false,
    songs: [
        {
            name: 'Classic love',
            singer: 'TayNguyenSound',
            path:'./assets/music/song1.mp3',
            image: './assets/music/img/song1.png',
        },
        {
            name: 'Sống cho hết đời thanh xuân',
            singer: 'Dick, Tuyết, Xám',
            path:'./assets/music/song2.mp3',
            image: './assets/music/img/song2.jpg',
        },
        {
            name: 'Đi qua hoa cúc',
            singer: 'TayNguyenSound',
            path:'./assets/music/song3.mp3',
            image: './assets/music/img/song3.jpg',
        },
        {
            name: 'Em của ngày hôm qua',
            singer: 'Sơn Tùng MTP',
            path:'./assets/music/song4.mp3',
            image: './assets/music/img/song4.jpg',
        },
        {
            name: 'Già cùng nhau là được',
            singer: 'Tea, PC',
            path:'./assets/music/song5.mp3',
            image: './assets/music/img/song5.jpg',
        },
        {
            name: 'Hẹn một mai',
            singer: 'Bùi Anh Tuấn',
            path:'./assets/music/song6.mp3',
            image: './assets/music/img/song6.jpg',
        },
        {
            name: 'Đã từng',
            singer: 'Bùi Anh Tuấn',
            path:'./assets/music/song7.mp3',
            image: './assets/music/img/song7.jpg',
        },
        {
            name: 'Nếu lúc đó',
            singer: 'tlinh',
            path:'./assets/music/song8.mp3',
            image: './assets/music/img/song8.jpg',
        },
        {
            name: 'À lôi',
            singer: 'Double2T, Masew',
            path:'./assets/music/song9.mp3',
            image: './assets/music/img/song9.jpg',
        },
        {
            name: 'Khóa ly biệt',
            singer: 'Voi bản đôn',
            path:'./assets/music/song10.mp3',
            image: './assets/music/img/song10.jpg',
        },
    ],
    renderSongs: function (){
        const html = this.songs.map ( function (song, index) {
            return `
            <div class="song ${index === app.currentIndex ? 'active': ''}" data-index = ${index}>
                <div class="thumb"
                style="background-image: url(${song.image});">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = html.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', { //thêm thuộc tính currentSong vào object hiện tại là app
            get: function(){ // lấy bài hát đầu tiên của playlist
                return this.songs[this.currentIndex];
            }
        })
    },

    //Cách này để lấy ra bài hát hiện tại cũng được nha, dùng cách trên tiện hơn khi gọi tới 1 phương thức của đối tượng
    // cách trên vì định nghĩa nó là 1 thuộc tính nên mỗi lần gọi chỉ cần .currentSong
    // còn cách dưới này là 1 phương thức nên khi gọi .currentSong()
    // currentSong : function () {
    //     return app.songs[app.currentIndex];
    // },

    handleEvents: function(){

        // Scroll top
        let cd =  $('.cd-thumb') 
        let cdheight = cd.offsetHeight; // muốn xem thuộc tính offsetHeight thì cho cd vào 1 mảng
        let cdwidth = cd.offsetWidth;

        //bắt sự kiện scroll
        document.onscroll = function () {
            const scrolltop = window.scrollY || document.documentElement.scrollTop // lấy chiều dọc khi scroll
            const cdheightNew = cdheight - scrolltop // scroll bao nhiêu thì giảm height bấy nhiêu
            const cdwidthNew = cdwidth -  scrolltop 
            cd.style.height = cdheightNew > 0 ? cdheightNew  + 'px' : 0 ; // đặt điều kiện ở đây để xử lý trường hợp mà khi scroll quá nhanh thì làm cho giá trị sau khi trừ bị âm vì không bắt kịp sự kiện scroll vì thế khi nó âm ta set cho nó bằng 0
            cd.style.width = cdwidthNew  > 0 ? cdwidthNew + 'px' : 0;
            cd.style.opacity = cdheightNew / cdheight;
        }
    
        // Xử lý khi playing
        const _this= this;
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
            
            // khi thấy bài hát đang play (biết được sự kiện đang onplay) khi click thì sẽ thực hiện câu lệnh bên trong hàm
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdAnimation.play(); 
            }

            // bắt được sự kiện pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdAnimation.pause();
            }
        }
        
        //Khi tiến độ bài hát thay đổi thì thanh progress thay đổi theo
        audio.ontimeupdate = function(){
            let progressPercent = Math.floor(audio.currentTime *100 / audio.duration) // phần trăm chạy đc của bài nhạc đang phát

            progress.value = progressPercent;

            // tự đông phát bài tiếp theo sau khi hết 1 bài hát
            //dưới này là 1 ý tưởng nhưng hay hơn ta dùng onended
            // if( progressPercent === 100) {
            //     _this.nextSong();
            //     audio.play();
            // }
        }

        // Khi kết thúc bài hát, bắt được sự kiện kết thúc 1 bài
        audio.onended = function(){
            btnNext.onclick(); // tự động click btn luôn nha :))
        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e){
           audio.currentTime= (e.target.value/100)*audio.duration // e.target.value : lấy được giá trị %  trên thanh progress giá trị đã định nghĩa ở trên là từ 0-100, từ đó tỉm ra được thời gian hiện tại đang phát nhạc là bao nhiêu.
        }

        // Xử lý đĩa CD quay và dừng
            /**dùng animate method
             * nó sẽ return về đối tượng chứa animation
             * cấu trúc: animate(keyframes, option)
                keyframes: 1 mảng các đối tượng hoặc 1 đối tượng keyframe có thuộc tính là các giá trị lặp lại để tạo animation
                option: một số nguyên biểu thị thời lượng (mili second) của animation hoặc là một đối tượng chứa nhiều thuộc tính thời gian   
             * */ 
        let cdAnimation = cd_thumb.animate(
            {
                transform: 'rotate(360deg)' // quay 360 độ
            },
            {
                duration: 10000, //thời lượng quay 10a
                iterations: Infinity // lặp lại vô hạn
            })

        cdAnimation.pause(); // đầu tiên vào là phải pause lại khi phát mới cho chạy

        // next song
        btnNext.onclick = function() {
            if(_this.isRandom) _this.randomSong();
            else  _this.nextSong();
            audio.play();
            // thêm cái dưới này để fix bug thì vừa mới truy cập mà chưa ấn nút play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdAnimation.play(); 
            }

            _this.renderSongs(); // render lại để hiện thực active vừa thêm vào nhưng quá nhiều bài dễ bị lag
            _this.scrollToActiveSong(); // sau khi render lại bài hát thì scroll bài hát này vào khung nhìn
        }

        //prev song
        btnPrev.onclick = function() {
            if(_this.isRandom) _this.randomSong();
            else  _this.prevSong();
            audio.play();
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdAnimation.play(); 
            }
            _this.renderSongs();
            _this.scrollToActiveSong();
        }

        // repseat song
        btnRepeat.onclick = function() {
            progress.value = 0; // thanh progress về 0
            audio.currentTime = 0; // thời gian phát nhạc hiện tại về 0
            audio.play(); // và phát nhạc
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdAnimation.play(); 
            }
        }

        //random song 
        btnRandom.onclick = function(){
            _this.isRandom =  !_this.isRandom;
            btnRandom.classList.toggle('active', _this.isRandom);
        }

        playList.onclick = function(e) {
            //closest method là từ gốc tìm ra mãi tới cha của nó nếu thỏa thì trả về giá trị đó, còn không thì trả về NULL
            let songNode = e.target.closest('.song:not(.active)') //có song nhưng không có active

            if(songNode && !e.target.closest('.option')) //hoặc là không có option thì mới thực hiện
            {
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index); // console.log ra để nhìn các thuộc tính của songNode 
                    _this.loadCurrentSong();
                    audio.play();
                    audio.onplay = function(){
                        _this.isPlaying = true;
                        player.classList.add('playing');
                        cdAnimation.play(); 
                    }
                    _this.renderSongs(); // render lại để hiện thực active vừa thêm vào nhưng quá nhiều bài dễ bị lag
                    _this.scrollToActiveSong(); // sau khi render lại bài hát thì scroll bài hát này vào khung nhìn

                }
            }
            
        }

    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name; // cập nhập text h2
        cd_thumb.style.backgroundImage = `url(${this.currentSong.image})`; // cập nhập url 
        audio.src = this.currentSong.path;
    },

    // method next song
    nextSong: function() {
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // method pre song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0) this.currentIndex = this.songs.length-1;
        this.loadCurrentSong();
    },

    // random song
    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while( newIndex === this.currentIndex );
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        // dùng settime out để tạo độ trễ khi chuyển sang bài hát khác
        setTimeout( function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth', //  smooth: animate smoothly ; instant: nhảy tới đối tượng ấn
                block: 'end', // xác định theo chiều thẳng đứng có 3 thuộc tính: end, start, nearest
                // inline // xác định theo chiều ngang
                // ở đây ta dùng end vì nó sẽ đẩy đối tượng này xuống cuối, nếu không thấy thì nó sẽ tự động đẩy lên
            });
        }, 300)
        

    },

    start: function () {
        this.defineProperties(); // định nghĩa các thuộc tính cho đối tượng app
        this.renderSongs();
        this.handleEvents();
        this.loadCurrentSong(); // tải bài hát hiện tại
    }

}

app.start();
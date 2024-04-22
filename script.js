// Variabel untuk kecepatan gerakan dan gravitasi
let move_speed = 3;
let gravity = 0.5;

// Mendapatkan elemen burung dan gambar burung
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

// Suara poin dan game over
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Mendapatkan properti elemen burung
let bird_props = bird.getBoundingClientRect();

// Mendapatkan properti latar belakang
let background = document.querySelector('.background').getBoundingClientRect();

// Mendapatkan elemen skor, pesan, dan judul skor
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Status permainan (Start, Play, End)
let game_state = 'Start';

// Menyembunyikan gambar burung saat awal
img.style.display = 'none';

// Menambahkan gaya untuk pesan
message.classList.add('messageStyle');

// Variabel untuk menyimpan skor awal sebelum menjawab pertanyaan
let initial_score = 0;

// Variabel untuk menyimpan skor saat permainan berlangsung
let current_score = 0;

// Fungsi untuk menampilkan pop-up pertanyaan
function showQuestionPopup() {
    let questionPopup = document.querySelector('.question-popup');
    questionPopup.style.display = 'block';

    // Menangani klik pilihan
    let options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            if (option.value === 'C') {
                // Jawaban benar, tambahkan poin
                current_score += 10;
                score_val.innerHTML = current_score + initial_score;
                sound_point.play();
                // Sembunyikan pop-up soal
                questionPopup.style.display = 'none';
                // Tampilkan pesan "Game Over" setelah sedikit waktu
                setTimeout(() => {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                }, 500);
            } else {
                // Jawaban salah, game over
                game_state = 'End';
                // Sembunyikan pop-up soal
                questionPopup.style.display = 'none';
                // Tampilkan pesan "Game Over" setelah sedikit waktu
                setTimeout(() => {
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                }, 500);
            }
        });
    });
}

// Mendengarkan tombol Enter untuk memulai permainan
document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && game_state != 'Play'){
        if(game_state === 'End') {
            // Reset skor saat game over
            current_score = 0;
            score_val.innerHTML = current_score;
        }
        // Menghapus semua pipa saat restart
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // Menampilkan gambar burung
        img.style.display = 'block';
        bird.style.top = '40vh';
        // Mengubah status permainan menjadi "Play"
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        message.classList.remove('messageStyle');
        // Memulai permainan
        bird_dy = 0; // Setel ulang kecepatan vertikal burung saat memulai kembali
        play();
    }
});

// Fungsi utama untuk permainan
function play(){
    // Fungsi untuk menggerakkan pipa
    function movePipes(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Menghapus pipa yang sudah melewati layar
            if(pipe_sprite_props.right <= 0){
                element.remove();
            } else {
                // Deteksi tabrakan burung dengan pipa
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    showQuestionPopup(); // Menampilkan pop-up pertanyaan saat tabrakan
                    return;
                } else {
                    // Menghitung skor saat melewati pipa
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        current_score++;
                        score_val.innerHTML = current_score + initial_score;
                        sound_point.play();
                    }
                    // Menggerakkan pipa ke kiri
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(movePipes);
    }
    requestAnimationFrame(movePipes);

    // Fungsi untuk menggerakkan burung dan menerapkan gravitasi
    let bird_dy = 0;
    function applyGravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        // Menggerakkan burung ke atas ketika tombol panah atas atau spasi ditekan
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                if (game_state === 'Play') {
                    img.src = 'images/bird-2.png';
                    bird_dy = -7.6;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                if (game_state === 'Play') {
                    img.src = 'images/bird.png';
                }
            }
        });

        // Deteksi tabrakan burung dengan atas dan bawah layar
        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(applyGravity);
    }
    requestAnimationFrame(applyGravity);

    // Fungsi untuk membuat pipa secara acak
    let pipe_separation = 0;
    let pipe_gap = 35;

    function createPipe(){
        if(game_state != 'Play') return;

        if(pipe_separation > 115){
            pipe_separation = 0;

            let pipe_position = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_position - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_position + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(createPipe);
    }
    requestAnimationFrame(createPipe);
}

// Memanggil fungsi play saat memulai permainan
play();

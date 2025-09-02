console.log("Anubhav");
import { lyricsMusic } from "./SongLyrics.js";

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let playBtn, prevBtn, nextBtn;

const $ = (sel) => document.querySelector(sel);

// sec → mm:ss
function secondsToMinutesSeconds(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function getSongs(folder) {
    currFolder = folder;
    const res = await fetch(`http://127.0.0.1:3000/${folder}/`);
    const html = await res.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    const as = div.getElementsByTagName("a");

    songs = [];
    for (let i = 0; i < as.length; i++) {
        const a = as[i];
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href.split(`/${folder}/`)[1]); // encoded name (e.g., Aima%20Baig.mp3)
        }
    }

    // render list
    const ul = $(".songList ul");
    ul.innerHTML = "";
    for (const song of songs) {
        ul.innerHTML += `
      <li>
        <img class="invert" src="Music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Anubhav</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div>
      </li>`;
    }

    // click to play
    Array.from($(".songList").getElementsByTagName("li")).forEach((li) => {
        li.addEventListener("click", () => {
            const name = li.querySelector(".info").firstElementChild.textContent.trim();
            playMusic(name); // name is decoded text; engine will re-encode correctly via track from songs array
        });
    });

    return songs;
}

// helper: current encoded file name from audio src
function currentEncoded() {
    return currentSong.src.split("/").pop(); // e.g., Aima%20Baig.mp3
}

// core: play + lyrics
const playMusic = (track, pause = false) => {
    // Accept either encoded ("Aima%20Baig.mp3") or decoded ("Aima Baig.mp3")
    const encodedTrack = track.includes("%") ? track : encodeURIComponent(track);
    currentSong.src = `/${currFolder}/` + encodedTrack;

    const decodedName = decodeURIComponent(currentSong.src.split("/").pop()).trim();

    // lyrics lookup by decoded file name (keys in SongLyrics.js are decoded)
    const lyrics = lyricsMusic[decodedName];
    if (lyrics) {
        $(".lyrics-container").innerHTML = `<b>Lyrics for <u>${decodedName}</u><br><br>${lyrics.replace(/\n/g, "<br>")}<br><br><font color="red">(Lyrics AI-generated for educational and personal use only.)</font></b>`;
    } else {
        $(".lyrics-container").innerHTML =
            `Lyrics for ${decodedName}<br><br>(No lyrics available for this track)`;
    }

    if (!pause) {
        currentSong.play().catch(console.error);
        if (playBtn) playBtn.src = "img/pause.svg";
    }

    $(".songinfo").textContent = decodedName;
    $(".songtime").textContent = "00:00 / 00:00";
};

// ===== Skip =====
function skipForward() {
    if (Number.isFinite(currentSong.duration)) {
        currentSong.currentTime = Math.min(currentSong.currentTime + 10, currentSong.duration);
    }
}
function skipBackward() {
    currentSong.currentTime = Math.max(currentSong.currentTime - 10, 0);
}

async function main() {
    // buttons (make them visible to playMusic via top-level vars)
    playBtn = document.getElementById("play");
    prevBtn = document.getElementById("previous");
    nextBtn = document.getElementById("next");

    // load first playlist
    await getSongs("songs/ncs");
    if (songs.length) playMusic(songs[0], true);

    // play/pause
    playBtn?.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play().catch(console.error);
            playBtn.src = "img/pause.svg";
        } else {
            currentSong.pause();
            playBtn.src = "img/play.svg";
        }
    });

    // time + seek circle
    currentSong.addEventListener("timeupdate", () => {
        const t = secondsToMinutesSeconds(currentSong.currentTime);
        const d = secondsToMinutesSeconds(currentSong.duration);
        $(".songtime").textContent = `${t} / ${d}`;

        if (Number.isFinite(currentSong.duration) && currentSong.duration > 0) {
            $(".circle").style.left =
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    // seekbar
    $(".seekbar")?.addEventListener("click", (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        $(".circle").style.left = percent * 100 + "%";
        if (Number.isFinite(currentSong.duration))
            currentSong.currentTime = currentSong.duration * percent;
    });

    // sidebar
    $(".hamburger")?.addEventListener("click", () => { $(".left").style.left = "0"; });
    $(".close")?.addEventListener("click", () => { $(".left").style.left = "-120%"; });

    // toggle lyrics
    $(".toggle-lyrics")?.addEventListener("click", () => {
        $(".lyrics-container").classList.toggle("hidden");
    });

    // prev/next (use ENCODED name for index lookups)
    prevBtn?.addEventListener("click", () => {
        const i = songs.indexOf(currentEncoded());
        if (i > 0) playMusic(songs[i - 1]);
    });
    nextBtn?.addEventListener("click", () => {
        const i = songs.indexOf(currentEncoded());
        if (i !== -1 && i + 1 < songs.length) playMusic(songs[i + 1]);
    });

    // volume
    $(".range input")?.addEventListener("input", (e) => {
        currentSong.volume = Number(e.target.value) / 100;
    });

    // load playlist on card
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        card.addEventListener("click", async (item) => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            if (songs.length) playMusic(songs[0]);
        });
    });

    // auto next
    currentSong.addEventListener("ended", () => {
        const i = songs.indexOf(currentEncoded());
        if (i !== -1 && i + 1 < songs.length) playMusic(songs[i + 1]);
    });

    // ===== Modal + Popup =====
    const modal = document.getElementById("authModal");
    const loginBtn = document.querySelector(".loginbtn");
    const signupBtn = document.querySelector(".signupbtn");
    const closeModal = document.querySelector(".closeModal");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");
    const closePopup = document.getElementById("closePopup");

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 5000);
    }
    closePopup?.addEventListener("click", () => popup.classList.remove("show"));

    function showLogin() {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
    }
    function showSignup() {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    }

    loginBtn?.addEventListener("click", () => { modal.style.display = "flex"; showLogin(); });
    signupBtn?.addEventListener("click", () => { modal.style.display = "flex"; showSignup(); });
    closeModal?.addEventListener("click", () => { modal.style.display = "none"; });
    loginTab?.addEventListener("click", showLogin);
    signupTab?.addEventListener("click", showSignup);

    loginForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (loginForm.checkValidity()) {
            showPopup("✅ Login successful! Welcome back 🎶");
            modal.style.display = "none";
            loginForm.reset();
        }
    });
    signupForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (signupForm.checkValidity()) {
            showPopup("🎉 Signup successful! Enjoy your music journey 🎧");
            modal.style.display = "none";
            signupForm.reset();
        }
    });

    // search
    const searchInput = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".card");
    searchInput?.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase();
        cards.forEach((card) => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            const desc = card.querySelector("p").textContent.toLowerCase();
            card.style.display = (title.includes(q) || desc.includes(q)) ? "" : "none";
        });
    });

    // home
    document.getElementById("homeBtn")?.addEventListener("click", () => {
        if (!searchInput) return;
        searchInput.value = "";
        cards.forEach((card) => (card.style.display = ""));
    });

    // skip buttons
    document.getElementById("forward")?.addEventListener("click", skipForward);
    document.getElementById("backward")?.addEventListener("click", skipBackward);
}

main();

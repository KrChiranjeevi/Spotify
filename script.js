console.log('lets write javascript');
let currentSong = new Audio();

let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0.01) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Always return two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }


    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Arjit Singh</div>
                            </div>
                            <span class="playnow">Play Now</span>
                            <img class="invert" src="play.svg" alt="">
                            </li>`;
    }


    //Attched eventlistener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

       return songs;  // so the caller gets the array


}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = " 00:00 / 00:00"


}

// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`)
//     let response = await a.text();
//     console.log(response)
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     Array.from(anchors).forEach(async e => {
//         if (e.href.includes("/songs")) {
//             // let folder=e.href.split("/").slice(-2)[0]
//             // let folder = e.href.split("/songs/").pop().replace("/", "");

//         let path = new URL(e.href).pathname;       // only /songs/player/
//         let folder = path.split('/songs/')[1].replace('/', '');


//             //Get the metadata of the folder

//             // let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)

//             let a = await fetch(`/songs/${folder}/info.json`);

//             // let res = await fetch(`/songs/${folder}/info.json`);
//             // if (!res.ok) {
//             //     console.error("info.json missing for", folder);
//             //     return;
//             // }
//             // let info = await res.json();


//             let response = await a.json();
//             console.log(response)

//             cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="Album" class="card">


//                         <div  class="Green">
//                             <button class="spotify-play-btn">
//                                 <svg viewBox="0 0 24 24">
//                                     <path d="M8 5v14l11-7z"></path>
//                                 </svg>
//                             </button>
//                         </div>

//                         <img src ="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//     });
//     // console.log(anchors)
// }











async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let cardContainer = document.querySelector(".cardContainer");

   let array = Array.from(anchors)
            for(let index = 0; index < array.length; index++){
                const e = array[index]
            

        // make sure it’s a folder inside /songs/
        if (e.href.includes("/songs/")) {
            let path = new URL(e.href).pathname;  // /songs/player/ etc
            let folderPart = path.split('/songs/')[1]; // player/ or undefined
            if (!folderPart) return; // skip invalid links

            let folder = folderPart.replace('/', ''); // "player"

            try {
                let res = await fetch(`/songs/${folder}/info.json`);
                if (!res.ok) {
                    console.error("info.json missing for", folder);
                    return;
                }
                let info = await res.json();
                console.log(info)

                // add card with correct folder
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="Green">
                            <button class="spotify-play-btn">
                                <svg viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"></path>
                                </svg>
                            </button>
                        </div>
                        <img class="first" src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
            } catch (err) {
                console.error(err);
            }
        }
    }

     // load the playlist whnever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}


async function main() {
    // get  the list of song
    await getSongs("songs/player")
    // console.log(songs)
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()


    //Attached an event listner to play, next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })


    // time update

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.
            duration) * 100 + "%";


    })

    //add event listerner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hambuger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for closs button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    })


    // Add an event listner pervous and next

    previous.addEventListener("click", () => {
        // console.log("Previous clicked")
        currentSong.pause()
        // console.log("Previous clicked") 
        // console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    next.addEventListener("click", () => {
        currentSong.pause()
        // console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event  to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
    })


    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        console.log("changing", e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume=.10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;

        }
            
    })
 
}
main()
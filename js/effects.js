const coffeeMoments = [
    {
        title: "Morning latte",
        date: "Photo coming soon",
        image: ""
    },
    {
        title: "Hand brewed coffee",
        date: "Photo coming soon",
        image: ""
    },
    {
        title: "A quiet cup",
        date: "Photo coming soon",
        image: ""
    }
];

const recordTracks = [
    {
        title: "Song not chosen yet",
        artist: "Our Story",
        src: ""
    }
];

function createObjectModal(){
    const modal = document.createElement("div");
    modal.className = "object-modal";
    modal.hidden = true;
    modal.innerHTML = `
        <div class="object-modal__backdrop" data-close-modal></div>
        <section class="object-modal__panel" role="dialog" aria-modal="true" aria-labelledby="objectModalTitle">
            <button class="object-modal__close" type="button" aria-label="關閉" data-close-modal>×</button>
            <p class="object-modal__eyebrow" id="objectModalEyebrow"></p>
            <h2 class="object-modal__title" id="objectModalTitle"></h2>
            <div class="object-modal__body" id="objectModalBody"></div>
        </section>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if(event.target.closest("[data-close-modal]")){
            closeObjectModal(modal);
        }
    });

    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && !modal.hidden){
            closeObjectModal(modal);
        }
    });

    return modal;
}

function createPolaroidSpread(){
    const spread = document.createElement("div");
    spread.className = "polaroid-spread";
    spread.hidden = true;
    spread.innerHTML = `
        <button class="polaroid-spread__close" type="button" aria-label="收起咖啡照片">×</button>
        <div class="polaroid-spread__photos">
            ${coffeeMoments.map((item, index) => `
                <article class="polaroid-card polaroid-card--${index + 1}">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.title}">`
                        : `<div class="polaroid-card__placeholder" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span></div>`
                    }
                    <h3>${item.title}</h3>
                    <p>${item.date}</p>
                </article>
            `).join("")}
        </div>
    `;

    document.querySelector(".desk").appendChild(spread);

    spread.querySelector(".polaroid-spread__close").addEventListener("click", () => {
        closePolaroids(spread);
    });

    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" && !spread.hidden){
            closePolaroids(spread);
        }
    });

    return spread;
}

function openObjectModal(modal, { eyebrow, title, body }){
    modal.querySelector("#objectModalEyebrow").textContent = eyebrow;
    modal.querySelector("#objectModalTitle").textContent = title;
    modal.querySelector("#objectModalBody").innerHTML = body;
    modal.hidden = false;
    document.body.classList.add("modal-open");
}

function closeObjectModal(modal){
    modal.hidden = true;
    document.body.classList.remove("modal-open");
}

function openPolaroids(spread){
    spread.hidden = false;
    requestAnimationFrame(() => {
        spread.classList.add("is-visible");
    });
}

function closePolaroids(spread){
    spread.classList.remove("is-visible");

    setTimeout(() => {
        spread.hidden = true;
    }, 280);
}

function togglePolaroids(spread){
    if(spread.hidden){
        openPolaroids(spread);
    }else{
        closePolaroids(spread);
    }
}

function renderRecordPlayer(){
    const track = recordTracks[0];
    return `
        <div class="record-panel">
            <div class="record-panel__disc" aria-hidden="true"></div>
            <div class="record-panel__info">
                <p>${track.artist}</p>
                <h3>${track.title}</h3>
                ${track.src
                    ? `<audio class="record-audio" controls src="${track.src}"></audio>`
                    : `<div class="record-panel__empty">Music coming soon</div>`
                }
            </div>
        </div>
    `;
}

const objectModal = createObjectModal();
const polaroidSpread = createPolaroidSpread();
const coffeeCup = document.getElementById("coffeeCup");
const recordPlayer = document.getElementById("recordPlayer");

if(coffeeCup){
    coffeeCup.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePolaroids(polaroidSpread);
    });
}

if(recordPlayer){
    recordPlayer.addEventListener("click", (event) => {
        event.stopPropagation();
        openObjectModal(objectModal, {
            eyebrow: "Vinyl player",
            title: "Music for this story",
            body: renderRecordPlayer()
        });

        const audio = objectModal.querySelector(".record-audio");

        if(audio){
            audio.addEventListener("play", () => {
                recordPlayer.classList.add("is-playing");
                objectModal.querySelector(".record-panel__disc")?.classList.add("is-playing");
            });

            audio.addEventListener("pause", () => {
                recordPlayer.classList.remove("is-playing");
                objectModal.querySelector(".record-panel__disc")?.classList.remove("is-playing");
            });

            audio.addEventListener("ended", () => {
                recordPlayer.classList.remove("is-playing");
                objectModal.querySelector(".record-panel__disc")?.classList.remove("is-playing");
            });
        }
    });
}

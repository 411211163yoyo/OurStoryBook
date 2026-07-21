const coffeeMoments = [
    {
        title: "Coffee 01",
        date: "",
        image: "assets/coffee/coffee-01.jpg"
    },
    {
        title: "Coffee 02",
        date: "",
        image: "assets/coffee/coffee-02.jpg"
    },
    {
        title: "Coffee 03",
        date: "",
        image: "assets/coffee/coffee-03.jpg"
    },
    {
        title: "Coffee 04",
        date: "",
        image: "assets/coffee/coffee-04.jpg"
    },
    {
        title: "Coffee 05",
        date: "",
        image: "assets/coffee/coffee-05.jpg"
    },
    {
        title: "Coffee 06",
        date: "",
        image: "assets/coffee/coffee-06.jpg"
    },
    {
        title: "Coffee 07",
        date: "",
        image: "assets/coffee/coffee-07.jpg"
    },
    {
        title: "Coffee 08",
        date: "",
        image: "assets/coffee/coffee-08.jpg"
    },
    {
        title: "Coffee 09",
        date: "",
        image: "assets/coffee/coffee-09.jpg"
    },
    {
        title: "Coffee 10",
        date: "",
        image: "assets/coffee/coffee-10.jpg"
    },
    {
        title: "Coffee 11",
        date: "",
        image: "assets/coffee/coffee-11.jpg"
    },
    {
        title: "Coffee 12",
        date: "",
        image: "assets/coffee/coffee-12.jpg"
    },
    {
        title: "Coffee 13",
        date: "",
        image: "assets/coffee/coffee-13.jpg"
    },
    {
        title: "Coffee 14",
        date: "",
        image: "assets/coffee/coffee-14.jpg"
    }
];

const snackMoments = [
    {
        title: "Late Night 01",
        date: "",
        image: "assets/snack/snack-01.jpg"
    },
    {
        title: "Late Night 02",
        date: "",
        image: "assets/snack/snack-02.jpg"
    },
    {
        title: "Late Night 03",
        date: "",
        image: "assets/snack/snack-03.jpg"
    },
    {
        title: "Late Night 04",
        date: "",
        image: "assets/snack/snack-04.jpg"
    },
    {
        title: "Late Night 05",
        date: "",
        image: "assets/snack/snack-05.jpg"
    },
    {
        title: "Late Night 06",
        date: "",
        image: "assets/snack/snack-06.jpg"
    }
];

const recordTracks = [
    {
        title: "A Million Dreams",
        artist: "Piano version",
        src: "assets/music/a-million-dreams-piano.mp3",
        note: "請把合法取得的鋼琴版音檔放在 assets/music/a-million-dreams-piano.mp3"
    }
];

const recordReflection = "以前，我常用這首歌提醒自己要撐住、要繼續往前走。那時候我以為努力就是一個人咬牙撐過去。後來才發現，原來也可以有人陪我一起面對、一起變好。現在再聽見它，想到的不是孤單奮戰，而是我們一起往夢想靠近的感覺。";

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

function createPolaroidSpread({ items, className = "", closeLabel }){
    const spread = document.createElement("div");
    spread.className = `polaroid-spread ${className}`.trim();
    spread.hidden = true;
    spread.innerHTML = `
        <button class="polaroid-spread__close" type="button" aria-label="${closeLabel}">×</button>
        <div class="polaroid-spread__photos">
            ${items.map((item, index) => `
                <article class="polaroid-card polaroid-card--${index + 1}">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.title}">`
                        : `<div class="polaroid-card__placeholder" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span></div>`
                    }
                    <h3>${item.title}</h3>
                    ${item.date ? `<p>${item.date}</p>` : ""}
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
    modal.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
    });
    document.getElementById("recordPlayer")?.classList.remove("is-playing");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
}

function openPolaroids(spread, trigger){
    document.querySelectorAll(".polaroid-spread").forEach((item) => {
        if(item !== spread && !item.hidden){
            closePolaroids(item, document.querySelector(`[aria-controls="${item.id}"]`));
        }
    });

    document.querySelectorAll(".photo-stack").forEach((stack) => {
        stack.classList.add("is-hidden");
    });

    spread.hidden = false;
    requestAnimationFrame(() => {
        spread.classList.add("is-visible");
    });
}

function closePolaroids(spread, trigger){
    spread.classList.remove("is-visible");

    setTimeout(() => {
        spread.hidden = true;

        if(!document.querySelector(".polaroid-spread.is-visible")){
            document.querySelectorAll(".photo-stack").forEach((stack) => {
                stack.classList.remove("is-hidden");
            });
        }
    }, 280);
}

function togglePolaroids(spread, trigger){
    if(spread.hidden){
        openPolaroids(spread, trigger);
    }else{
        closePolaroids(spread, trigger);
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
                    ? `
                        <audio class="record-audio" controls src="${track.src}" preload="metadata"></audio>
                        <p class="record-panel__hint">${track.note}</p>
                    `
                    : `<div class="record-panel__empty">Music coming soon</div>`
                }
            </div>
            <aside class="record-message" aria-live="polite">
                <button class="record-message__close" type="button" aria-label="關閉音樂小卡">×</button>
                <p>${recordReflection}</p>
            </aside>
        </div>
    `;
}

function bindRecordPanel(modal){
    const audio = modal.querySelector(".record-audio");
    const panelDisc = modal.querySelector(".record-panel__disc");
    const message = modal.querySelector(".record-message");
    const messageClose = modal.querySelector(".record-message__close");

    messageClose?.addEventListener("click", () => {
        message?.classList.remove("is-visible");
    });

    if(!audio) return;

    audio.addEventListener("playing", () => {
        recordPlayer?.classList.add("is-playing");
        panelDisc?.classList.add("is-playing");
        message?.classList.add("is-visible");
    });

    audio.addEventListener("pause", () => {
        recordPlayer?.classList.remove("is-playing");
        panelDisc?.classList.remove("is-playing");
    });

    audio.addEventListener("ended", () => {
        recordPlayer?.classList.remove("is-playing");
        panelDisc?.classList.remove("is-playing");
    });
}

const objectModal = createObjectModal();
const polaroidSpread = createPolaroidSpread({
    items: coffeeMoments,
    closeLabel: "收起咖啡照片"
});
const snackSpread = createPolaroidSpread({
    items: snackMoments,
    className: "polaroid-spread--snack",
    closeLabel: "收起 Late Night 照片"
});
const coffeeCup = document.getElementById("coffeeCup");
const snackPlate = document.getElementById("snackPlate");
const recordPlayer = document.getElementById("recordPlayer");

polaroidSpread.id = "coffeePolaroids";
snackSpread.id = "snackPolaroids";
coffeeCup?.setAttribute("aria-controls", polaroidSpread.id);
snackPlate?.setAttribute("aria-controls", snackSpread.id);

if(coffeeCup){
    coffeeCup.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePolaroids(polaroidSpread, coffeeCup);
    });
}

if(snackPlate){
    snackPlate.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePolaroids(snackSpread, snackPlate);
    });
}

if(recordPlayer){
    recordPlayer.addEventListener("click", (event) => {
        event.stopPropagation();
        openObjectModal(objectModal, {
            eyebrow: "Vinyl player",
            title: "A Million Dreams",
            body: renderRecordPlayer()
        });
        bindRecordPanel(objectModal);
    });
}

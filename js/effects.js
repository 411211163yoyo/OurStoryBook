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
        artist: "For the days we keep going",
        src: "assets/music/a-million-dreams-piano.aac",
        startAt: 0,
        note: "It keeps playing while you read."
    }
];

const recordReflection = "以前聽這首歌的時候，我總是在心裡替自己留一點光，提醒自己還可以再往前一點。那時候我以為努力是把害怕和疲憊都藏好，一個人慢慢撐過去。後來才發現，原來也可以有人陪我一起面對、一起變好。現在再聽見它，想到的不是孤單奮戰，而是我們一起往夢想靠近的感覺。";
const recordAudio = new Audio(recordTracks[0].src);
let hasRecordStarted = false;

recordAudio.preload = "auto";

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
    recordPlayer?.setAttribute("aria-expanded", "true");
    modal.querySelector(".object-modal__close")?.focus();
}

function closeObjectModal(modal){
    if(recordAudio.paused){
        document.getElementById("recordPlayer")?.classList.remove("is-playing");
    }

    modal.hidden = true;
    document.body.classList.remove("modal-open");
    recordPlayer?.setAttribute("aria-expanded", "false");
    recordPlayer?.focus();
}

function getPolaroidTrigger(spread){
    return document.querySelector(`[aria-controls="${spread.id}"]`);
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
    trigger?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
        spread.classList.add("is-visible");
    });
}

function closePolaroids(spread, trigger){
    spread.classList.remove("is-visible");
    (trigger || getPolaroidTrigger(spread))?.setAttribute("aria-expanded", "false");

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
                <button class="record-play" type="button">${recordAudio.paused ? "Play music" : "Pause music"}</button>
                <p class="record-panel__hint">${track.note}</p>
            </div>
            <aside class="record-message" aria-live="polite">
                <button class="record-message__close" type="button" aria-label="關閉音樂小卡">×</button>
                <p>${recordReflection}</p>
            </aside>
        </div>
    `;
}

function bindRecordPanel(modal){
    const panelDisc = modal.querySelector(".record-panel__disc");
    const message = modal.querySelector(".record-message");
    const messageClose = modal.querySelector(".record-message__close");
    const playButton = modal.querySelector(".record-play");
    const hint = modal.querySelector(".record-panel__hint");
    const track = recordTracks[0];

    function syncRecordButton(){
        if(!playButton) return;

        playButton.textContent = recordAudio.paused
            ? "Play music"
            : "Pause music";
        playButton.setAttribute("aria-pressed", String(!recordAudio.paused));
    }

    messageClose?.addEventListener("click", () => {
        message?.classList.remove("is-visible");
    });

    recordAudio.onplaying = () => {
        recordPlayer?.classList.add("is-playing");
        panelDisc?.classList.add("is-playing");
        message?.classList.add("is-visible");
        syncRecordButton();
    };

    recordAudio.onpause = () => {
        recordPlayer?.classList.remove("is-playing");
        panelDisc?.classList.remove("is-playing");
        syncRecordButton();
    };

    recordAudio.onended = () => {
        hasRecordStarted = false;
        recordPlayer?.classList.remove("is-playing");
        panelDisc?.classList.remove("is-playing");
        syncRecordButton();
    };

    recordAudio.onerror = () => {
        hasRecordStarted = false;
        recordPlayer?.classList.remove("is-playing");
        panelDisc?.classList.remove("is-playing");
        if(hint){
            hint.textContent = "音樂載入失敗，請重新整理後再試一次。";
        }
        syncRecordButton();
    };

    playButton?.addEventListener("click", async () => {
        if(recordAudio.paused){
            if(!hasRecordStarted || recordAudio.ended){
                recordAudio.currentTime = track.startAt;
            }

            hasRecordStarted = true;

            try{
                await recordAudio.play();
            }catch(error){
                hasRecordStarted = false;
                if(hint){
                    hint.textContent = "如果音樂沒有開始，請再點一次播放。";
                }
            }
        }else{
            recordAudio.pause();
        }

        syncRecordButton();
    });

    if(!recordAudio.paused){
        recordPlayer?.classList.add("is-playing");
        panelDisc?.classList.add("is-playing");
        message?.classList.add("is-visible");
    }

    syncRecordButton();
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
coffeeCup?.setAttribute("aria-expanded", "false");
snackPlate?.setAttribute("aria-controls", snackSpread.id);
snackPlate?.setAttribute("aria-expanded", "false");
recordPlayer?.setAttribute("aria-expanded", "false");

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
            eyebrow: "A quiet song for us",
            title: "The song feels different now",
            body: renderRecordPlayer()
        });
        bindRecordPanel(objectModal);
    });
}

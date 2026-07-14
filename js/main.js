// =====================================================
// 故事內容
// 之後想加頁，只要在這個陣列裡繼續新增物件就好
// =====================================================

const storyPages = [

    {
        type: "opening",
        title: "For Harrods",
        text: "Thank you for every ordinary day that quietly became something unforgettable.",
        year: "Since 2026"
    },

    {
        id: "beginning",
        type: "chapter",
        date: "March 18, 2026",
        title: "The Beginning",
        bookmark: "Beginning",
        image: "",
        music: "",
        text: "..."
    }

    // 之後要加頁，複製這個格式貼上就好：
    // ,{
    //     id: "...",
    //     type: "chapter",
    //     date: "月 日, 2026",
    //     title: "章節標題",
    //     bookmark: "書籤上顯示的字",
    //     text: "章節內文……"
    // }

];


// =====================================================
// DOM 參照
// =====================================================

const book = document.getElementById("book");
const pagesContainer = document.querySelector(".pages");
const bookmarksContainer = document.getElementById("bookmarks");

let currentPage = 0;
let isBookOpen = false;


// =====================================================
// 依 storyPages 動態產生每一頁的 DOM
// =====================================================

function renderPages(){

    // 清空，避免跟 HTML 裡殘留的內容疊在一起
    pagesContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    storyPages.forEach((page, index) => {

        const section = document.createElement("section");
        section.className = "page";
        section.style.zIndex = storyPages.length - index;

        const front = document.createElement("div");
        front.className = "page-front";

        if(page.type === "opening"){

            front.innerHTML = `
                <div class="opening-content">
                    <p class="opening-title">${page.title}</p>
                    <p class="opening-text">${page.text}</p>
                    <p class="opening-year">${page.year}</p>
                </div>
            `;

        }else{

            front.innerHTML = `
                <div class="chapter-content">
                    <p class="chapter-date">${page.date}</p>
                    <h2 class="chapter-title">${page.title}</h2>
                    <p class="chapter-text">${page.text || ""}</p>
                </div>
            `;

        }

        // 除了最後一頁，其餘每頁都自動加上翻頁折角
        if(index < storyPages.length - 1){
            const corner = document.createElement("div");
            corner.className = "page-corner";
            front.appendChild(corner);
        }

        const back = document.createElement("div");
        back.className = "page-back";

        section.appendChild(front);
        section.appendChild(back);
        fragment.appendChild(section);

    });

    pagesContainer.appendChild(fragment);

}

function getPageElements(){
    return document.querySelectorAll(".page");
}


// =====================================================
// 書籤導覽（依 storyPages 裡的 bookmark 欄位產生）
// =====================================================

function renderBookmarks(){

    if(!bookmarksContainer) return;

    bookmarksContainer.innerHTML = "";

    storyPages.forEach((page, index) => {

        if(page.type !== "chapter") return;

        const btn = document.createElement("button");
        btn.className = "bookmark";
        btn.textContent = page.bookmark || page.title;
        btn.dataset.page = index;

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if(!isBookOpen) openBook();
            goToPage(index);
        });

        bookmarksContainer.appendChild(btn);

    });

}

renderPages();
renderBookmarks();


// =====================================================
// 打開 / 關閉書
// =====================================================

book.addEventListener("click", (e) => {

    if(e.target.closest(".page-corner")) return;
    if(e.target.closest(".bookmark")) return;

    // 已翻開那頁的背面，交給下面 pagesContainer 的監聽器處理「往回翻一頁」
    if(e.target.closest(".page.flipped")) return;

    if(!isBookOpen){
        openBook();
    }else{
        // 不管翻到第幾頁，點書本都直接關閉並重置回封面
        closeBook();
    }

});

function openBook(){

    book.classList.add("open");

    setTimeout(() => {
        book.classList.add("opened");
    }, 400);

    isBookOpen = true;

}

function closeBook(){

    const pages = [...getPageElements()].reverse();

    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.remove("flipped");
        }, index * 180);
    });

    setTimeout(() => {
        book.classList.remove("opened");
    }, 200);

    setTimeout(() => {
        book.classList.remove("open");
    }, 700);

    currentPage = 0;
    isBookOpen = false;

}


// =====================================================
// 翻頁（事件委派，因為頁面是動態產生的）
// =====================================================

pagesContainer.addEventListener("click", (e) => {

    if(e.target.classList.contains("page-corner")){

        e.stopPropagation();

        const pages = getPageElements();

        if(currentPage < pages.length - 1){
            pages[currentPage].classList.add("flipped");
            currentPage++;
        }

        return;

    }

    const flippedPage = e.target.closest(".page.flipped");

    if(flippedPage && currentPage > 0){

        e.stopPropagation();

        currentPage--;
        getPageElements()[currentPage].classList.remove("flipped");

    }

});


// =====================================================
// 直接跳到指定頁（書籤點擊會用到）
// =====================================================

function goToPage(target){

    const pages = getPageElements();

    if(target === currentPage) return;

    if(target > currentPage){

        while(currentPage < target){
            pages[currentPage].classList.add("flipped");
            currentPage++;
        }

    }else{

        while(currentPage > target){
            currentPage--;
            pages[currentPage].classList.remove("flipped");
        }

    }

}
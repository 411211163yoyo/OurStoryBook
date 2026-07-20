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
    },

    {
        id: "coffee-days",
        type: "chapter",
        date: "Chapter 02",
        title: "Coffee Days",
        bookmark: "Coffee",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "small-things",
        type: "chapter",
        date: "Chapter 03",
        title: "Small Things",
        bookmark: "Small",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "walks",
        type: "chapter",
        date: "Chapter 04",
        title: "Walks",
        bookmark: "Walks",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "music",
        type: "chapter",
        date: "Chapter 05",
        title: "Music",
        bookmark: "Music",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "ordinary-days",
        type: "chapter",
        date: "Chapter 06",
        title: "Ordinary Days",
        bookmark: "Days",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "photos",
        type: "chapter",
        date: "Chapter 07",
        title: "Photos",
        bookmark: "Photos",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "letters",
        type: "chapter",
        date: "Chapter 08",
        title: "Letters",
        bookmark: "Letters",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "promise",
        type: "chapter",
        date: "Chapter 09",
        title: "Promise",
        bookmark: "Promise",
        image: "",
        music: "",
        text: "..."
    },

    {
        id: "forever",
        type: "chapter",
        date: "Chapter 10",
        title: "Forever",
        bookmark: "Forever",
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

function renderPageContent(page){

    if(!page){
        return `
            <div class="page-note">
                <p>More pages soon</p>
            </div>
        `;
    }

    if(page.type === "opening"){
        return `
            <div class="opening-content">
                <p class="opening-title">${page.title}</p>
                <p class="opening-text">${page.text}</p>
                <p class="opening-year">${page.year}</p>
            </div>
        `;
    }

    return `
        <div class="chapter-content">
            <p class="chapter-date">${page.date}</p>
            <h2 class="chapter-title">${page.title}</h2>
            <p class="chapter-text">${page.text || ""}</p>
        </div>
    `;

}


// =====================================================
// DOM 參照
// =====================================================

const book = document.getElementById("book");
const pagesContainer = document.querySelector(".pages");
const bookmarksContainer = document.getElementById("bookmarks");

let pageTurn;


// =====================================================
// 依 storyPages 動態產生信紙頁面
// =====================================================

function renderPages(){

    pagesContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    storyPages.forEach((page, index) => {

        const section = document.createElement("section");
        section.className = `page${index === 0 ? " active" : ""}`;
        section.dataset.page = index;

        section.innerHTML = renderPageContent(page);
        fragment.appendChild(section);

    });

    pagesContainer.appendChild(fragment);
    pagesContainer.insertAdjacentHTML("beforeend", `
        <button class="reader-close" type="button" aria-label="關閉閱讀頁">×</button>
        <div class="page-controls" aria-label="切換故事頁">
            <button class="page-nav page-nav--prev" type="button" aria-label="上一頁">‹</button>
            <p class="page-count" aria-live="polite">1 / ${storyPages.length}</p>
            <button class="page-nav page-nav--next" type="button" aria-label="下一頁">›</button>
        </div>
    `);

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
        btn.style.setProperty("--bookmark-index", index);

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if(!pageTurn.isBookOpen()) pageTurn.openBook();
            pageTurn.goToPage(index);
        });

        bookmarksContainer.appendChild(btn);

    });

}

function updateBookmarkState(currentPage){

    if(!bookmarksContainer) return;

    bookmarksContainer.querySelectorAll(".bookmark").forEach((bookmark) => {
        const page = Number(bookmark.dataset.page);
        const isActive = page === currentPage;

        bookmark.classList.toggle("active", isActive);
        bookmark.setAttribute("aria-current", isActive ? "page" : "false");
    });

}


// =====================================================
// 初始化
// =====================================================

renderPages();

pageTurn = initPageTurn({
    book,
    pagesContainer,
    onPageChange: updateBookmarkState
});

renderBookmarks();
updateBookmarkState(0);

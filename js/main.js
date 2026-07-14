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

function renderPageContent(page, face = "front"){

    if(!page){
        return `
            <div class="page-note">
                <p>More pages soon</p>
            </div>
        `;
    }

    if(page.type === "opening"){
        return `
            <div class="opening-content ${face === "back" ? "page-back-preview" : ""}">
                <p class="opening-title">${page.title}</p>
                <p class="opening-text">${page.text}</p>
                <p class="opening-year">${page.year}</p>
            </div>
        `;
    }

    return `
        <div class="chapter-content ${face === "back" ? "page-back-preview" : ""}">
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

        front.innerHTML = renderPageContent(page);

        // 除了最後一頁，其餘每頁都自動加上翻頁折角
        if(index < storyPages.length - 1){
            const corner = document.createElement("div");
            corner.className = "page-corner";
            front.appendChild(corner);
        }

        const back = document.createElement("div");
        back.className = "page-back";
        back.innerHTML = renderPageContent(storyPages[index + 1], "back");

        section.appendChild(front);
        section.appendChild(back);
        fragment.appendChild(section);

    });

    pagesContainer.appendChild(fragment);

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
            if(!pageTurn.isBookOpen()) pageTurn.openBook();
            pageTurn.goToPage(index);
        });

        bookmarksContainer.appendChild(btn);

    });

}


// =====================================================
// 初始化
// =====================================================

renderPages();

pageTurn = initPageTurn({
    book,
    pagesContainer
});

renderBookmarks();

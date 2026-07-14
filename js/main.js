// =====================================================
// 故事內容
// 之後想加頁，只要在這個陣列裡繼續新增物件就好，
// 不用去改任何翻頁邏輯或 CSS 的 z-index
// =====================================================

const storyPages = [

    {
        type: "opening",
        title: "For Harrods",
        text: "Thank you for every ordinary day that quietly became something unforgettable.",
        year: "Since 2026"
    },

    {

    id:"beginning",

    type:"chapter",

    date:"March 18, 2026",

    title:"The Beginning",

    bookmark:"Beginning",

    image:"",

    music:"",

    text:"..."

}

    // 範例：之後要加第三頁，複製貼上這個格式就好
    // ,{
    //     type: "chapter",
    //     date: "月 日, 2026",
    //     title: "章節標題",
    //     text: "章節內文……"
    // }

];


// =====================================================
// DOM 參照
// =====================================================

const book = document.getElementById("book");
const pagesContainer = document.querySelector(".pages");

let currentPage = 0;
let isBookOpen = false;


// =====================================================
// 依 storyPages 動態產生每一頁的 DOM
// =====================================================

function renderPages(){

    const fragment = document.createDocumentFragment();

    storyPages.forEach((page, index) => {

        const section = document.createElement("section");
        section.className = "page";
        // 越前面的頁 z-index 越高，疊在最上面
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
        pagesContainer.appendChild(section);

    });

}

renderPages();

function getPageElements(){
    return document.querySelectorAll(".page");
}


// =====================================================
// 打開 / 關閉書
// =====================================================

book.addEventListener("click", (e) => {

    // 折角、頁面內容的點擊不觸發開闔書
    if(e.target.closest(".page-corner")) return;

    if(!isBookOpen){
        openBook();
    }else if(currentPage === 0){
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

    pages.forEach((page,index)=>{

        setTimeout(()=>{

            page.classList.remove("flipped");

        },index*180);

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
// 翻頁（事件委派：因為頁面是動態產生的，
// 不能在建立當下直接綁 addEventListener）
// =====================================================

pagesContainer.addEventListener("click", (e) => {

    // 點折角 -> 往下一頁
    if(e.target.classList.contains("page-corner")){

        e.stopPropagation();

        const pages = getPageElements();

        if(currentPage < pages.length - 1){
            pages[currentPage].classList.add("flipped");
            currentPage++;
        }

        return;

    }

    // 點已經翻開的那一頁背面 -> 往回翻一頁
    const flippedPage = e.target.closest(".page.flipped");

    if(flippedPage && currentPage > 0){

        e.stopPropagation();

        currentPage--;
        getPageElements()[currentPage].classList.remove("flipped");

    }

});

function goToPage(target){

    const pages = getPageElements();

    if(target === currentPage) return;

    if(target > currentPage){

        while(currentPage < target){

            pages[currentPage].classList.add("flipped");

            currentPage++;

        }

    }

    else{

        while(currentPage > target){

            currentPage--;

            pages[currentPage].classList.remove("flipped");

        }

    }

}

storyPages.forEach((page,index)=>{

    if(page.type==="chapter"){

        const bookmark=document.createElement("button");

        bookmark.className="bookmark";

        bookmark.textContent=page.bookmark;

        bookmark.dataset.page=index;

        bookmarks.appendChild(bookmark);

    }

});

bookmark.onclick=()=>{

    goToPage(index);

}
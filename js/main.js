const book = document.getElementById("book");

const firstPage = document.querySelector(".page-1");
const secondPage = document.querySelector(".page-2");

const pageCorner = document.querySelector(".page-corner");

let isBookOpen = false;
let currentPage = 1;


// ======================
// 打開 / 關閉書
// ======================

book.addEventListener("click", () => {

    if (!isBookOpen) {

        openBook();

    } else {

        closeBook();

    }

});


// ======================
// 打開
// ======================

function openBook(){

    book.classList.add("open");

    setTimeout(()=>{

        book.classList.add("opened");

    },400);

    isBookOpen = true;

}


// ======================
// 關閉
// ======================

function closeBook(){

    firstPage.classList.remove("flipped");

    setTimeout(()=>{

        book.classList.remove("opened");

    },200);

    setTimeout(()=>{

        book.classList.remove("open");

    },700);

    currentPage = 1;

    isBookOpen = false;

}


// ======================
// 第一頁翻頁
// ======================

pageCorner.addEventListener("click",(e)=>{

    e.stopPropagation();

    firstPage.classList.add("flipped");

    currentPage = 2;

});
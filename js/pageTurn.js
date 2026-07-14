function initPageTurn({ book, pagesContainer }){

    let currentPage = 0;
    let isBookOpen = false;

    function getPageElements(){
        return document.querySelectorAll(".page");
    }

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

    book.addEventListener("click", (e) => {

        if(e.target.closest(".page-corner")) return;
        if(e.target.closest(".bookmark")) return;

        // 已翻開那頁的背面，交給 pagesContainer 的監聽器處理「往回翻一頁」
        if(e.target.closest(".page.flipped")) return;

        if(!isBookOpen){
            openBook();
        }else{
            // 不管翻到第幾頁，點書本都直接關閉並重置回封面
            closeBook();
        }

    });

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

    return {
        openBook,
        closeBook,
        goToPage,
        isBookOpen: () => isBookOpen
    };

}

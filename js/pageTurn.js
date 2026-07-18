function initPageTurn({ book, pagesContainer, onPageChange = () => {} }){

    let currentPage = 0;
    let isBookOpen = false;
    let transitionState = "closed";
    let scheduledTimers = [];

    function schedule(callback, delay){
        const timer = setTimeout(() => {
            scheduledTimers = scheduledTimers.filter((item) => item !== timer);
            callback();
        }, delay);

        scheduledTimers.push(timer);
        return timer;
    }

    function clearScheduledTimers(){
        scheduledTimers.forEach((timer) => clearTimeout(timer));
        scheduledTimers = [];
    }

    function getPageElements(){
        return document.querySelectorAll(".page");
    }

    function updateBookDepthState(){
        book.classList.toggle("has-flipped-pages", currentPage > 0);
    }

    function openBook(){

        if(transitionState === "opening" || transitionState === "open") return;

        clearScheduledTimers();
        transitionState = "opening";

        book.classList.remove("closing");
        book.classList.add("open");

        schedule(() => {
            book.classList.add("opened");
            transitionState = "open";
        }, 400);

        isBookOpen = true;

    }

    function closeBook(){

        if(transitionState === "closing" || transitionState === "closed") return;

        clearScheduledTimers();
        transitionState = "closing";
        book.classList.add("closing");
        book.classList.remove("opened");

        schedule(() => {
            getPageElements().forEach((page) => {
                page.classList.remove("flipped");
            });

            currentPage = 0;
            updateBookDepthState();
            book.classList.remove("open");
            book.classList.remove("closing");
            transitionState = "closed";
            onPageChange(currentPage);
        }, 880);

        isBookOpen = false;

    }

    function goToPage(target){

        if(transitionState === "closing") return;

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

        onPageChange(currentPage);
        updateBookDepthState();

    }

    book.addEventListener("click", (e) => {

        if(e.target.closest(".page-corner")) return;
        if(e.target.closest(".bookmark")) return;

        // 已翻開那頁的背面，交給 pagesContainer 的監聽器處理「往回翻一頁」
        if(e.target.closest(".page.flipped")) return;

        if(!isBookOpen){
            openBook();
        }else if(transitionState === "open"){
            // 不管翻到第幾頁，點書本都直接關閉並重置回封面
            closeBook();
        }

    });

    pagesContainer.addEventListener("click", (e) => {

        if(e.target.classList.contains("page-corner")){

            e.stopPropagation();

            const pages = getPageElements();

            if(transitionState === "open" && currentPage < pages.length - 1){
                pages[currentPage].classList.add("flipped");
                currentPage++;
                onPageChange(currentPage);
                updateBookDepthState();
            }

            return;

        }

        const flippedPage = e.target.closest(".page.flipped");

        if(transitionState === "open" && flippedPage && currentPage > 0){

            e.stopPropagation();

            currentPage--;
            getPageElements()[currentPage].classList.remove("flipped");
            onPageChange(currentPage);
            updateBookDepthState();

        }

    });

    return {
        openBook,
        closeBook,
        goToPage,
        isBookOpen: () => isBookOpen
    };

}

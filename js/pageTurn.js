function initPageTurn({ book, pagesContainer, onPageChange = () => {} }){

    let currentPage = 0;
    let isBookOpen = false;
    let transitionState = "closed";
    let openTimer;
    let touchStartX = 0;
    let touchStartY = 0;

    const pageCount = pagesContainer.querySelector(".page-count");
    const prevButton = pagesContainer.querySelector(".page-nav--prev");
    const nextButton = pagesContainer.querySelector(".page-nav--next");
    const closeButton = pagesContainer.querySelector(".reader-close");

    function getPageElements(){
        return [...pagesContainer.querySelectorAll(".page")];
    }

    function setActivePage(target, direction = "forward"){
        const pages = getPageElements();
        const nextPage = Math.max(0, Math.min(target, pages.length - 1));

        if(nextPage === currentPage && pages[nextPage]?.classList.contains("active")) return;

        pagesContainer.dataset.direction = direction;
        currentPage = nextPage;

        pages.forEach((page, index) => {
            page.classList.toggle("active", index === currentPage);
        });

        if(pageCount){
            pageCount.textContent = `${currentPage + 1} / ${pages.length}`;
        }

        if(prevButton){
            prevButton.disabled = currentPage === 0;
        }

        if(nextButton){
            nextButton.disabled = currentPage === pages.length - 1;
        }

        onPageChange(currentPage);
    }

    function openBook(){
        if(transitionState === "opening" || transitionState === "open") return;

        clearTimeout(openTimer);
        transitionState = "opening";
        isBookOpen = true;

        setActivePage(0, "backward");
        document.body.classList.add("reader-open");
        book.classList.remove("closing");
        book.classList.add("open");

        openTimer = setTimeout(() => {
            book.classList.add("opened");
            transitionState = "open";
        }, 360);
    }

    function closeBook(){
        if(transitionState === "closing" || transitionState === "closed") return;

        clearTimeout(openTimer);
        transitionState = "closing";
        isBookOpen = false;

        book.classList.add("closing");
        book.classList.remove("opened");

        openTimer = setTimeout(() => {
            setActivePage(0, "backward");
            book.classList.remove("open");
            book.classList.remove("closing");
            document.body.classList.remove("reader-open");
            transitionState = "closed";
        }, 420);
    }

    function goToPage(target){
        if(transitionState === "closing") return;

        const direction = target >= currentPage ? "forward" : "backward";

        if(!isBookOpen){
            openBook();
        }

        setActivePage(target, direction);
    }

    function nextPage(){
        goToPage(currentPage + 1);
    }

    function previousPage(){
        goToPage(currentPage - 1);
    }

    book.addEventListener("click", (event) => {
        if(event.target.closest(".pages")) return;
        if(event.target.closest(".bookmark")) return;

        if(!isBookOpen){
            openBook();
        }
    });

    prevButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        previousPage();
    });

    nextButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        nextPage();
    });

    closeButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        closeBook();
    });

    pagesContainer.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive:true });

    pagesContainer.addEventListener("touchend", (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if(Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;

        if(deltaX < 0){
            nextPage();
        }else{
            previousPage();
        }
    });

    document.addEventListener("keydown", (event) => {
        if(!isBookOpen) return;
        if(event.key === "ArrowRight") nextPage();
        if(event.key === "ArrowLeft") previousPage();
        if(event.key === "Escape") closeBook();
    });

    setActivePage(0);

    return {
        openBook,
        closeBook,
        goToPage,
        isBookOpen: () => isBookOpen
    };

}

const book = document.getElementById("book");

let isOpen = false;

function openBook(){

    book.classList.add("open");

    setTimeout(() => {

        book.classList.add("opened");

    },400);

    isOpen = true;

}

function closeBook(){

    book.classList.remove("opened");

    setTimeout(() => {

        book.classList.remove("open");

    },400);

    isOpen = false;

}

book.addEventListener("click", () => {

    if(isOpen){

        closeBook();

    }else{

        openBook();

    }

});
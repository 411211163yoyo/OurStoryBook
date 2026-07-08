const book = document.getElementById("book");

let isOpen = false;

book.addEventListener("click", () => {

    if(!isOpen){

        book.classList.add("open");

        setTimeout(() => {

            book.classList.add("opened");

        },400);

        isOpen = true;

    }

    else{

        book.classList.remove("opened");

        setTimeout(() => {

            book.classList.remove("open");

        },400);

        isOpen = false;

    }

});
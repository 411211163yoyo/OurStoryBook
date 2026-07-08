const book = document.getElementById("book");

book.addEventListener("click", () => {

    book.classList.add("open");

    setTimeout(() => {

        book.classList.add("opened");

    }, 400);

});
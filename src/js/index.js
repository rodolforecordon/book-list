const addBtn = document.querySelector('#add-book');
const addDialog = document.querySelector('#add-dialog');
const addBook = document.querySelector('#confirm-btn');

// EVENT LISTENERS
// Open dialog
addBtn.addEventListener('click', () => {
  if (typeof addDialog.showModal === "function") {
    addDialog.showModal();
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
})

const books = [];

// Create new book instance
addBook.addEventListener('click', () => {
  const inputs = document.querySelectorAll('form > p > input');
  const selector = document.querySelector('form > p > select');
  const newBook = new Book(inputs[0].value, inputs[1].value, inputs[2].value, selector.value);
  newBook.addBookRow();
  books.push(newBook);
  localStorage.books = JSON.stringify(books);
  inputs.forEach(element => element.value = '');
  selector.value = 'Yes';
})

// Load books in localStorage
window.addEventListener('load', () => {
  if (localStorage.books) {
    const storedBooks = JSON.parse(localStorage.books);

    storedBooks.forEach(element => {
      const newBook = new Book(element.title, element.author, element.pages, element.read);
      newBook.addBookRow();
      books.push(newBook);
    })
  }
});

// Listening click on page to get EDIT and DELETE
document.addEventListener('click', e => {
  const matIconsClass = e.target.classList.value.includes('material-icons');
  const iconName = e.target.innerHTML;
  
  if (matIconsClass && iconName === 'edit') {
    // open and fill dialog
    if (typeof addDialog.showModal === "function") {
      let eBookId = e.target.classList[0];
      eBookId = eBookId.substring(eBookId.lastIndexOf('-') + 1, eBookId.length);
      eBookId = Number(eBookId);
      const eBook = books.filter(el => el.bookId === eBookId);
      console.log(eBook)

      const inputs = document.querySelectorAll('form > p > input');
      const selector = document.querySelector('form > p > select');

      inputs[0].value = eBook[0].title;
      inputs[1].value = eBook[0].author;
      inputs[2].value = eBook[0].pages; 
      selector.value = eBook[0].read;

      addDialog.showModal();
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
  } else if (matIconsClass && iconName === 'delete') {
    let eBookId = e.target.classList[0];
    eBookId = eBookId.substring(eBookId.lastIndexOf('-') + 1, eBookId.length);
    let bookIndex = eBookId - 1;
    books.splice(bookIndex, 1);

    document.querySelector('table').remove();
    Book.prototype.bookId = 1;
    books.forEach(element => {
      const newBook = new Book(element.title, element.author, element.pages, element.read);
      newBook.addBookRow();
    })
    localStorage.books = JSON.stringify(books);
  }


})

// BOOK CONSTRUCTOR
function Book(title, author, pages, read) {
  this.bookId = Book.prototype.bookId++;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function() {
    return `${this.bookId}) ${title} by ${author}, ${pages} pages, ${read ? 'already read' : 'not read yet'}.`;
  }
}

// Start enumarating the instances
Book.prototype.bookId = 1;

// Create elements using the DOM
Book.prototype.newElement = function (elType, elText, elClass, elLocation) {
  const el = document.createElement(elType);
  const text = document.createTextNode(elText);
  
  elClass.forEach(element => el.classList.add(element))

  el.appendChild(text);
  document.querySelector(elLocation).appendChild(el);
}

Book.prototype.addBooksTable = function () {
  this.newElement('table', '', ['books-table'], 'section');
  this.newElement('tr', '', ['t-head'], '.books-table');
  this.newElement('th', 'My Reading List', [], '.t-head');
}

Book.prototype.addBookRow = function () {
  let table = document.querySelector('.books-table');
  let singleId = `${this.title.replace(/ /g, '')}-${this.bookId}`;
  console.log(singleId);
  if (!table) {
    this.addBooksTable();
    this.newElement('tr', '', [singleId], '.books-table');
    this.newElement('td', this.info(), [], `.${singleId}`);
    this.newElement('div', '', [], `.${singleId} > td`);
    this.newElement('span', 'edit', [singleId, 'material-icons', 'pointer'], `.${singleId} > td > div`);
    this.newElement('span', 'delete', [singleId, 'material-icons', 'pointer'], `.${singleId} > td > div`);
  } else {
    this.newElement('tr', '', [singleId], '.books-table');
    this.newElement('td', this.info(), [], `.${singleId}`);
    this.newElement('div', '', [], `.${singleId} > td`);
    this.newElement('span', 'edit', [singleId, 'material-icons', 'pointer'], `.${singleId} > td > div`);
    this.newElement('span', 'delete', [singleId, 'material-icons', 'pointer'], `.${singleId} > td > div`);
  }
}

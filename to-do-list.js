const form = document.querySelector("#to-do-form");
const toDoInput = document.querySelector("#to-do");
const toDoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-to-do-list");


eventListeners();

function eventListeners() {   //  tüm event listener'lar
  form.addEventListener("submit", addToDo);
  document.addEventListener("DOMContentLoaded", loadAllToDosToUserInterface);
  secondCardBody.addEventListener("click", deleteToDo);
  filter.addEventListener("keyup", filterToDos);
  clearButton.addEventListener("click", clearAllToDos);
};


function addToDo(e) {
  const newToDo = toDoInput.value.trim();
  if (newToDo === "") {
    showAlert("danger", "Lütfen yapmayı planladığınız bir iş yazın.");
  } else {
    addToDoToUserInterface(newToDo);
    addToDoToStorage(newToDo);
    showAlert("success", "Yapılacak iş eklendi.");
  }
  e.preventDefault();   //  submit'e tıklanıldığında sayfa yenilenmesin.
}

function showAlert(type, message) {
//  <div class="alert alert-danger" role="alert">
//  This is a danger alert—check it out!
//  </div>
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);
//  setTimeout
  setTimeout(function() {alert.remove();}, 2000);
}

function addToDoToUserInterface(newToDo) {
//  List Item Oluşturma
//  <ul class="list-group">
//    <li class="list-group-item d-flex justify-content-between">
//      Text
//      <a href = "#" class ="delete-item">
//        <i class = "fa fa-remove"></i>
//      </a>
//    </li>
//  </ul>
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between";
//  Text node ekleme
  listItem.appendChild(document.createTextNode(newToDo));
//  Link oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";
  listItem.appendChild(link);
//  ToDo List'e List Item'ı ekleme
  toDoList.appendChild(listItem);
}

function getToDosFromStorage() {  // Storage'tan ToDos'ı alma
  let toDos;
  if (localStorage.getItem("toDos") === null) {
    toDos = [];
  } else {
    toDos = JSON.parse(localStorage.getItem("toDos"));
  }
  return toDos;
}

function addToDoToStorage(newToDo) {
  let toDos = getToDosFromStorage();
  toDos.push(newToDo);
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function loadAllToDosToUserInterface() {
  let toDos = getToDosFromStorage();
  toDos.forEach(
    function(toDo) {
      addToDoToUserInterface(toDo);
    }
  );
}

function deleteToDo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteToDoFromLocalStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "İş silindi.");
  }
}

function deleteToDoFromLocalStorage(deleteToDo) {
  let toDos = getToDosFromStorage();
  toDos.forEach(function (toDo, index) {
    if (toDo === deleteToDo) {
      toDos.splice(index, 1);
    }
  })
  localStorage.setItem("toDos", JSON.stringify(toDos));
}

function filterToDos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");
  listItems.forEach(function(listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {   //  indexOf değer bulamazsa -1 verir.
      listItem.setAttribute("style", "display: none!important")
    } else {
      listItem.setAttribute("style", "display: block")
    }
  });
}

function clearAllToDos() {
  if (confirm("Tüm yapılacakları silmek istediğinizden emin misiniz?")) {
    while (toDoList.firstElementChild != null) {  //  firstElementChild bulunamazsa null değeri verir.
      toDoList.removeChild(toDoList.firstElementChild);
    }
  }
  localStorage.removeItem("toDos");
}
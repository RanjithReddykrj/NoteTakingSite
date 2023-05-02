
// document.addEventListener('DOMContentLoaded', () => {
//   const add = document.querySelector("#add");
//   const remove = document.getElementById("remove");
//   const popupBox = document.querySelector(".popup-box");
//   const crossmark = popupBox.querySelector("header i");

//   add.addEventListener('click', () => {
//     popupBox.classList.add("show");
//   });

//   crossmark.addEventListener('click', () => {
//     console.log("clicked");
//     popupBox.classList.remove("show");
//   });
// });
const notes=JSON.parse(localStorage.getItem("notes") ||"[]");
let isUpdate = false,
  updateId;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const add = document.querySelector("#add"),
  remove = document.getElementById("remove"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button"),
  activemsg=document.querySelector(".message"),
  ptag=document.querySelector(".message p");


add.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Task";
  addBtn.innerText = "Add Task";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  titleTag.focus();
});
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

//add to local storage


addBtn.addEventListener('click',()=>{
  let title=titleTag.value.trim(),
    description=descTag.value.trim();
 

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo);
      activateMsg("Task added");
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
      activateMsg("Task updated");
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});
//display from local storage


function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", "<br/>");
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    add.insertAdjacentHTML("afterend", liTag);
  });
};
showNotes();
//showing menue when you clik on settings
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  activateMsg("Task deleted")
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  add.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}
remove.addEventListener('click',()=>{
  localStorage.clear();
  location.reload();
  showNotes();
  activateMsg("Cleared all")
})
function activateMsg(msg){
  ptag.innerHTML=msg;
  activemsg.classList.add("activemsg");
  setTimeout(()=>{
    activemsg.classList.remove("activemsg")
  },1500)
}
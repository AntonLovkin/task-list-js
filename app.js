import './style.css';
import { data } from './data';
// import { addNote, createNote, deleteNote } from './api';
import { v4 as uuidv4 } from 'uuid';

let notesData = data;


renderNotesList(notesData);

const createNote = (name, content, category) => {
    const id = uuidv4();
    return { id, name, content, category, createdAt: new Date().toISOString(), isArchived: false };
};

const addNote = (note, list) => {
    list.push(note)
};

const deleteNote = (list, id) => {
    const noteIndex = list.findIndex((note) => note.id == id);

    if (noteIndex !== -1) {
        list.splice(noteIndex, 1);
        console.log(`Note with ID ${id} is deleted.`);
    } else {
        console.log(`Note with ID ${id} not found.`);
    }
};

const archiveNote = (list, id) => {
  const notesList = list.map((note) => {
    if (note.id == id) {
      return {...note, isArchived: !note.isArchived}
    }
    return note;
  });
  return notesList;
};

// Function to show the edit form with existing note content
function showEditForm(note) {
  const editForm = document.createElement('form');
  editForm.setAttribute("id",'editForm' )
  editForm.innerHTML = `
      <label for="editName">Note Name:</label>
      <input type="text" id="editName" required value="${note.name}">
      <label for="editContent">Note Content:</label>
      <input type="text" id="editContent" required value="${note.content}">
      <label for="editCategory">Category:</label>
      <select id="editCategory" required>
        <option value="Task">Task</option>
        <option value="Random Thought">Random Thought</option>
        <option value="Idea">Idea</option>
      </select>
      <button type="submit">Save</button>
      <button type="button" onclick="cancelEdit()">Cancel</button>
  `;

  editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const editName = document.getElementById('editName').value;
    const editContent = document.getElementById('editContent').value;
    const editCategory = document.getElementById('editCategory').value;
    
    if (editContent.trim() !== '') {
      editNoteContent(note.id, { editName, editContent, editCategory });
      closeEditForm();
    }
  });

  const existingEditForm = document.getElementById('editForm');
  console.log(existingEditForm)
  if (existingEditForm) {
    existingEditForm.replaceWith(editForm);
  } else {
    document.body.appendChild(editForm);
  }
}

// Function to update the note's content
function editNoteContent(noteId, editedContent) {
  const note = notesData.find((note) => note.id === noteId);
  if (note) {
    const { editName, editContent, editCategory } = editedContent;
    note.name = editName;
    note.content = editContent;
    note.category = editCategory;
    console.log(`Note with ID ${noteId} is edited.`);
    renderNotesList(notesData);
  } else {
    console.log(`Note with ID ${noteId} not found.`);
  }
}

// Function to close the edit form
function closeEditForm() {
  const editForm = document.getElementById('editForm');
  console.log(editForm)
  if (editForm) {
    editForm.remove();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  addEventListenersToButtons();
  renderNotesList(notesData);
});


const formEl = document.getElementById('addNoteForm');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit (event) {
  event.preventDefault();

  const noteName = document.getElementById('noteName').value;
  const noteContent = document.getElementById('noteContent').value;
  const noteCategory = document.getElementById('noteCategory').value;
  
  const newNote = createNote(noteName, noteContent, noteCategory);

  addNote(newNote, notesData);

  renderNotesList(notesData);
  
  console.log(notesData)
  
  document.getElementById('noteName').value = ''
  document.getElementById('noteContent').value = '';
  document.getElementById('noteCategory').value = 'Task';
};

// ------------------------------------
function addEventListenersToButtons() {
  const listEl = document.getElementById('notesList');

  listEl.addEventListener('click', function (event) {
    const target = event.target;
    const noteId = target.parentElement.getAttribute('id');

    if (target.classList.contains('archiveButton')) {
      // console.log('before --', notesData)
      notesData = archiveNote(notesData, noteId);
      // console.log('after --',notesData)
      renderNotesList(notesData);
      console.log(`Archive Button clicked for note ID: ${noteId}`);

    } else if (target.classList.contains('deleteButton')) {
      deleteNote(notesData, noteId);
      renderNotesList(notesData);
      console.log(`Delete Button clicked for note ID: ${noteId}`);

    } else if (target.classList.contains('editButton')) {
      const note = notesData.find((note) => note.id == noteId);
      if (note) {
        showEditForm(note);
      }
      console.log(`Edit Button clicked for note ID: ${noteId}`);
    }
  });
};

function renderNotesList(data) {
  const listEl = document.getElementById('notesList');
  listEl.innerHTML = ''
  // console.log(listEl)
  const activeNotes = data.filter(note => !note.isArchived)

  const notesListMarkup = activeNotes.map(note => {
    const { id, createdAt, content, category, name } = note;
    return `<li id="${id}">
              <span>${name}</span>
              <span>${createdAt}</span>
              <span>${category}</span>
              <span>${content}</span>
              <span>Dates</span>
              <button class="editButton">Edit</button>
              <button class="archiveButton">Archive</button>
              <button id="delete-btn" class="deleteButton">Delete</button>
            </li>`
  });

  listEl.innerHTML = notesListMarkup.join();
  // addEventListenersToButtons();
};

//-------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  addEventListenersToButtons();
  // renderNotesList(notesData)
});

import './style.css';
import { notesData } from './data';
// import { addNote, createNote, deleteNote } from './api';
import { v4 as uuidv4 } from 'uuid';

const createNote = (name, content, category) => {
    const id = uuidv4();
    return { id, name, content, category, createdAt: new Date().toISOString(), isActive: true };
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

const formEl = document.getElementById('addNoteForm');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit (event) {
  event.preventDefault();
  const noteName = document.getElementById('noteName').value;
  const noteContent = document.getElementById('noteContent').value;
  const noteCategory = document.getElementById('noteCategory').value;
  
  const newNote = createNote(noteName, noteContent, noteCategory);
  console.log(newNote)
  addNote(newNote, notesData);

  renderNotesList(notesData);
  
  console.log(notesData)
  
  document.getElementById('noteName').value = ''
  document.getElementById('noteContent').value = '';
  document.getElementById('noteCategory').value = 'Task';
}

// ------------------------------------

function renderNotesList(data) {
  const listEl = document.getElementById('notesList');
  // console.log(listEl)

  const notesListMarkup = data.map(note => {
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
};

//-------------------------------------------------

function addEventListenersToButtons() {
  const listEl = document.getElementById('notesList');

  listEl.addEventListener('click', function(event) {
    const target = event.target;
    const noteId = target.parentElement.getAttribute('id');

    if (target.classList.contains('archiveButton')) {
      console.log(`Archive Button clicked for note ID: ${noteId}`);

    } else if (target.classList.contains('deleteButton')) {
      deleteNote(notesData, noteId);
      renderNotesList(notesData);
      console.log(`Delete Button clicked for note ID: ${noteId}`);
    } else if (target.classList.contains('editButton')) {
      deleteNote(notesData, noteId);
      renderNotesList(notesData);
      console.log(`Edit Button clicked for note ID: ${noteId}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  addEventListenersToButtons();
  renderNotesList(notesData)
});

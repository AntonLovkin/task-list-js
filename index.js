import './style.css';
// import { data } from './data';
import { v4 as uuidv4 } from 'uuid';

import {
    renderApp,
    getDatesFromNote
    // showCreateNoteForm,
    // showEditForm,
} from './utils';

let notesData = [
    {
        id: 1,
        createdAt: new Date().toISOString(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Idea',
        name: 'Books',
        isArchived: false,
    },
    {
        id: 2,
        createdAt: new Date('2023-07-20').toISOString(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
    {
        id: 3,
        createdAt: new Date('2023-07-20').toISOString(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
    {
        id: 4,
        createdAt: new Date('2023-07-20').toISOString(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
    {
        id: 5,
        createdAt: new Date('2023-07-20').toISOString(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
];

// let notesData = data;

renderApp(notesData);

const createNoteBtnEl = document.getElementById('create-note-btn');

createNoteBtnEl.addEventListener('click', () => showCreateNoteForm(createNoteBtnEl));

function closeAddForm() {
  const addNoteFormEl = document.getElementById('addNoteForm');
  if (addNoteFormEl) {
    addNoteFormEl.remove();
  }
};

function addEventListenersToButtons() {
  const listEl = document.getElementById('notesList');

  listEl.addEventListener('click', function (event) {
    const target = event.target;
    const noteId = target.parentElement.getAttribute('id');

    if (target.classList.contains('archiveButton')) {
      notesData = archiveNote(notesData, noteId);
    //   renderNotesList(notesData);
        renderApp(notesData);

    } else if (target.classList.contains('deleteButton')) {
        deleteNote(notesData, noteId);
        renderApp(notesData);
    //   renderNotesList(notesData);

    } else if (target.classList.contains('editButton')) {
      const note = notesData.find((note) => note.id == noteId);
      if (note) {
        showEditForm(note);
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', function() {
  addEventListenersToButtons();
});

const deleteNote = (list, id) => {
    const noteIndex = list.findIndex((note) => note.id == id);

    if (noteIndex !== -1) {
        list.splice(noteIndex, 1);
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

export function editNoteContent(noteId, editedContent) {
  const note = notesData.find((note) => note.id === noteId);
  if (note) {
    const { editName, editContent, editCategory } = editedContent;
    note.name = editName;
    note.content = editContent;
    note.category = editCategory;
    console.log(`Note with ID ${noteId} is edited.`);
    // renderNotesList(notesData);
      renderApp(notesData);
  } else {
    console.log(`Note with ID ${noteId} not found.`);
  }
}

export function showCreateNoteForm(element) {
    element.setAttribute('disabled', "true");
    
    const createNoteForm = document.createElement('form');
    createNoteForm.setAttribute("id", "addNoteForm");
    createNoteForm.innerHTML = `
      <label for="noteName">Note Name:</label>
      <input type="text" id="noteName" required value="New">
      <label for="noteContent">Note Content:</label>
      <input type="text" id="noteContent" required value="Buy new plate">
      <label for="noteCategory">Category:</label>
      <select id="noteCategory" required>
        <option value="Task">Task</option>
        <option value="Random Thought">Random Thought</option>
        <option value="Idea">Idea</option>
      </select>
      <button type="submit">Add Note</button>
      <button type="button" onclick="closeAddForm()">Cancel</button>
  `;

  // const formEl = document.getElementById('addNoteForm');

    createNoteForm.addEventListener('submit', onFormSubmit);

    function onFormSubmit (event) {
        event.preventDefault();

        const noteName = document.getElementById('noteName').value;
        const noteContent = document.getElementById('noteContent').value;
        const noteCategory = document.getElementById('noteCategory').value;
    
        const newNote = createNote(noteName, noteContent, noteCategory);

        addNote(newNote, notesData);

        // renderNotesList(notesData);
        renderApp(notesData);
    
        document.getElementById('noteName').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteCategory').value = 'Task';

        createNoteForm.remove();
        element.removeAttribute('disabled');
    };
  
  document.body.appendChild(createNoteForm);
};

export function showEditForm(note) {
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
      <button type="button">Cancel</button>
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
  if (existingEditForm) {
    existingEditForm.replaceWith(editForm);
  } else {
    document.body.appendChild(editForm);
  }
}

const createNote = (name, content, category) => {
    const id = uuidv4();
    const dates = getDatesFromNote(content);
    return { id, name, content, category, dates, createdAt: new Date().toISOString(), isArchived: false };
};

const addNote = (note, list) => {
    list.push(note)
};

function closeEditForm() {
  const editForm = document.getElementById('editForm');
  console.log(editForm)
  if (editForm) {
    editForm.remove();
  }
}
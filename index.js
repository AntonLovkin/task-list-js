import './style.css';
import { v4 as uuidv4 } from 'uuid';

import {
  renderApp,
  getDatesFromNote,
  getCurrentDateTime,
  formMarkup,
} from './utils';

let notesData = [
    {
        id: uuidv4(),
        createdAt: getCurrentDateTime(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Idea',
        name: 'Books',
        dates: '3/5/2023',
        isArchived: true,
    },
    {
        id: uuidv4(),
        createdAt: getCurrentDateTime(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
      name: 'Books',
        dates: '3/5/2023',
        isArchived: false,
    },
    {
        id: uuidv4(),
        createdAt: getCurrentDateTime(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
    {
        id: uuidv4(),
        createdAt: getCurrentDateTime(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
    {
        id: uuidv4(),
        createdAt: getCurrentDateTime(),
        content: "I'm gonna have a dentist appointment on the 3/5/2023, I moved it from 5/5/2023",
        category: 'Task',
        name: 'Books',
        isArchived: false,
    },
];

// let notesData = data;

renderApp(notesData);

document.addEventListener('DOMContentLoaded', function() {
  addEventListenersToNoteButtons('notesList');
  addEventListenersToNoteButtons('archivedNotesList');
});

const createNoteBtnEl = document.getElementById('create-note-btn');

createNoteBtnEl.addEventListener('click', () => showCreateNoteForm(createNoteBtnEl));

function addEventListenersToNoteButtons(id) {
  const listEl = document.getElementById(id);

  listEl.addEventListener('click', function (event) {
    const target = event.target;
    const noteId = target.parentElement.getAttribute('id');

     if (target.classList.contains('editButton')) {
      const note = notesData.find((note) => note.id === noteId);
      if (note) {
        showEditForm(note);
      }
    }

    if (target.classList.contains('archiveButton')) {
      notesData = archiveNote(notesData, noteId);
      renderApp(notesData);
    }

    if (target.classList.contains('deleteButton')) {
      notesData = deleteNote(notesData, noteId);
      renderApp(notesData);
    }
  });
};

function deleteNote (list, id) {
  return list.filter((note) => note.id !== id)
};

function archiveNote (list, id) {
  const notesList = list.map((note) => {
    if (note.id === id) {
      return {...note, isArchived: !note.isArchived}
    }
    return note;
  });
  return notesList;
};

function editNoteContent(noteId, editedContent) {
  const note = notesData.find((note) => note.id === noteId);
  if (note) {
    const { editName, editContent, editCategory } = editedContent;
    note.name = editName;
    note.content = editContent;
    note.category = editCategory;
    
    renderApp(notesData);
  } 
}

function showCreateNoteForm(addBtnEl) {
  addBtnEl.setAttribute('disabled', "true"); 
    
  const createNoteForm = document.createElement('form');
  createNoteForm.setAttribute("id", "addNoteForm");
  const props = { type: 'note', name: '', content: '' };
  createNoteForm.innerHTML = formMarkup(props);

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
        addBtnEl.removeAttribute('disabled');
  };

  const cancelButton = createNoteForm.querySelector('#cancel-btn');
  cancelButton.addEventListener('click', function (event) {
    event.preventDefault();
    // closeEditForm();
    addBtnEl.removeAttribute('disabled');
    createNoteForm.remove();
  });
  
  document.body.appendChild(createNoteForm);
};

function showEditForm(note) {
  const editForm = document.createElement('form');
  editForm.setAttribute("id", 'editForm');
  const props = { type: 'edit', name: note.name, content: note.content };
  editForm.innerHTML = formMarkup(props);

  editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const editName = document.getElementById('editName').value;
    const editContent = document.getElementById('editContent').value;
    const editCategory = document.getElementById('editCategory').value;
    
    if (editContent.trim() !== '') {
      editNoteContent(note.id, { editName, editContent, editCategory });
      // closeEditForm();
      editForm.remove();
    }
  });

  const cancelButton = editForm.querySelector('#cancel-btn');
  cancelButton.addEventListener('click', function (event) {
    event.preventDefault();
    // closeEditForm();
    editForm.remove();
  });

  const existingEditForm = document.getElementById('editForm');
  if (existingEditForm) {
    existingEditForm.replaceWith(editForm);
  } else {
    document.body.appendChild(editForm);
  }
}

// function closeForm(element, htmlId) {
//   const formEl = document.getElementById(htmlId);
//   if (formEl) {
//     formEl.remove();
//   }
// }

function createNote (name, content, category) {
    const id = uuidv4();
    const dates = getDatesFromNote(content);
    return { id, name, content, category, dates, createdAt: getCurrentDateTime(), isArchived: false };
};

function addNote (note, list) {
    list.push(note)
};


export const renderApp = (data) => {
  renderNotesList(data);
  renderSummaryList(data);
  renderArchivedNotesList(data);
};

function renderNotesList(data) {
  const listEl = document.getElementById('notesList');
  listEl.innerHTML = ''
  const activeNotes = data.filter(note => !note.isArchived)

  const notesListMarkup = activeNotes.map(note => {
    return listMarkup(note, 'archive', "./icons/archive.svg")
  });

  listEl.innerHTML = notesListMarkup.join('');
};

function renderArchivedNotesList(data) {
  const listEl = document.getElementById('archivedNotesList');
  listEl.innerHTML = ''
  const archivedNotes = data.filter(note => note.isArchived);
  
  const notesListMarkup = archivedNotes.map(note => {
    return listMarkup(note, 'unarchive', "./icons/unarchive.svg")
  });
  // console.log(notesListMarkup)
  listEl.innerHTML = notesListMarkup.join('');
};

function renderSummaryList(data) {
  const summaryEl = document.getElementById('summary');
  summaryEl.innerHTML = ''
 
  const summaryList = separateAndCountByCategory(data);

  const summaryListMarkup = summaryList.map(note => {
    const { category, active, archived } = note;
    return `<li class="note-summary">
              <span class="category">${category}</span>
              <span class="active">${active}</span>
              <span class="archived">${archived}</span>
            </li>`
  });

  summaryEl.innerHTML = summaryListMarkup.join('');
};

function separateAndCountByCategory(data) {
  const categoryCounts = data.reduce((acc, item) => {
    const { category, isArchived } = item;
    const existingCategory = acc.find((c) => c.category === category);

    if (existingCategory) {
      if (isArchived) {
        existingCategory.archived++;
      } else {
        existingCategory.active++;
      }
    } else {
      const newCategory = {
        category,
        active: isArchived ? 0 : 1,
        archived: isArchived ? 1 : 0,
      };
      acc.push(newCategory);
    }

    return acc;
  }, []);
   return categoryCounts;
};

export function getDatesFromNote(string) {
    const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;
    return string.match(datePattern)?.join(',');
};

export function getCurrentDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  
  const formattedDate = `${day}.${month}.${year}`;

  return `${formattedDate}`;
};

export function formMarkup({type, name, content}) {
  return `
            <label for="${type}Name">Note Name:</label>
            <input type="text" id="${type}Name" required value="${name}">
            <label for="${type}Content">Note Content:</label>
            <input type="text" id="${type}Content" required value="${content}">
            <label for="${type}Category">Category:</label>
            <select id="${type}Category" required>
              <option value="Task">Task</option>
              <option value="Random Thought">Random Thought</option>
              <option value="Idea">Idea</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>
        `
};

function listMarkup(note, typeBtn = 'archive', iconSrc = "./icons/archive.svg") {
  const { id, createdAt, content, dates = '', category, name } = note;
  return `<li id="${id}">
              <span class="name">${name}</span>
              <span class="created">${createdAt}</span>
              <span class="category">${category}</span>
              <span class="content">${content}</span>
              <span class="dates">${dates}</span>
              <img class="editButton edit" src="./icons/edit.svg" alt="edit button">
              <img class="archiveButton archive" src=${iconSrc} alt="${typeBtn} button">
              <img id="delete-btn" class="deleteButton delete" src="./icons/delete.png" alt="delete button">
            </li>`
};
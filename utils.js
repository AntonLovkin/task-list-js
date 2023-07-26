export const renderApp = (data) => {
    renderNotesList(data);
    renderSummaryList(data)
};

function renderNotesList(data) {
  const listEl = document.getElementById('notesList');
  listEl.innerHTML = ''
  const activeNotes = data.filter(note => !note.isArchived)

  const notesListMarkup = activeNotes.map(note => {
    const { id, createdAt, content, dates = '', category, name } = note;
    return `<li id="${id}">
              <span>${name}</span>
              <span>${createdAt}</span>
              <span>${category}</span>
              <span>${content}</span>
              <span>${dates}</span>
              <button class="editButton">Edit</button>
              <button class="archiveButton">Archive</button>
              <button id="delete-btn" class="deleteButton">Delete</button>
            </li>`
  });

  listEl.innerHTML = notesListMarkup.join();
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

  summaryEl.innerHTML = summaryListMarkup.join();
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
    return string.match(datePattern).join(',');
};
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const papersContainer = document.getElementById('papers');

  const resultsPerPage = 5;
  let allPapers = [];     // will hold all parsed papers
  let filteredPapers = []; // will hold filtered papers after search
  let currentPage = 1;
  
  // Load CSV and initialize
  Papa.parse('papers-2206.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      allPapers = results.data;
      shuffleArray(allPapers);
      filteredPapers = allPapers;
      renderPage(currentPage);
      setupFiltering();
    }
  });

  function renderPage(page) {
    papersContainer.innerHTML = ''; // Clear current papers

    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const pageItems = filteredPapers.slice(start, end);

    pageItems.forEach(paper => {
      const paperDiv = document.createElement('div');
      paperDiv.className = 'paper';
      paperDiv.dataset.title = paper.Title || '';
      paperDiv.dataset.authors = paper.Authors || '';
      paperDiv.dataset.tags = paper.Tags || '';

      const tagHTML = (paper.Tags || '').split(/[,;]/).map(tag => 
        `<span class="tag">${tag.trim()}</span>`).join(' ');

      paperDiv.innerHTML = `
        <div class="paper-title"><a href="${paper.Link}" target="_blank">${paper.Title}</a></div>
        <div class="authors">${paper.Authors}</div>
        <div class="tags">${tagHTML}</div>
      `;
      papersContainer.appendChild(paperDiv);
    });

    renderPagination();
  }

  function renderPagination() {
    // Remove old pagination if any
    let oldPagination = document.getElementById('pagination');
    if (oldPagination) oldPagination.remove();

    const totalPages = Math.ceil(filteredPapers.length / resultsPerPage);
    if (totalPages <= 1) return; // no need for pagination

    const paginationDiv = document.createElement('div');
    paginationDiv.id = 'pagination';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });
    paginationDiv.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.disabled = true;
        pageBtn.style.fontWeight = 'bold';
      }
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderPage(currentPage);
      });
      paginationDiv.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });
    paginationDiv.appendChild(nextBtn);

    papersContainer.after(paginationDiv);
  }

  function setupFiltering() {
    const updateSearch = () => {
      const query = searchInput.value.toLowerCase();

      filteredPapers = allPapers.filter(paper => {
        const title = (paper.Title || '').toLowerCase();
        const authors = (paper.Authors || '').toLowerCase();
        const tags = (paper.Tags || '').toLowerCase();
        return title.includes(query) || authors.includes(query) || tags.includes(query);
      });

      currentPage = 1; // reset to first page on new search
      renderPage(currentPage);
    };

    searchInput.addEventListener('input', updateSearch);

    // Event delegation for tag clicks
    document.getElementById('papers').addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) {
        searchInput.value = e.target.textContent;
        updateSearch();
      }
    });
  }
});

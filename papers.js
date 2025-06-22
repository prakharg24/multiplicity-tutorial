document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const papersContainer = document.getElementById('papers');

  // Load CSV and render papers
  Papa.parse('papers-2206.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      results.data.forEach(paper => {
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

      setupFiltering(); // Setup search and tag filters
    }
  });

  function setupFiltering() {
    const updateSearch = () => {
      const query = searchInput.value.toLowerCase();
      const papers = document.querySelectorAll('.paper');

      papers.forEach(paper => {
        const title = paper.dataset.title.toLowerCase();
        const authors = paper.dataset.authors.toLowerCase();
        const tags = paper.dataset.tags.toLowerCase();
        const match = title.includes(query) || authors.includes(query) || tags.includes(query);
        paper.style.display = match ? '' : 'none';
      });
    };

    // Setup input search
    searchInput.addEventListener('input', updateSearch);

    // Use event delegation to handle tag clicks (works for dynamic content)
    document.getElementById('papers').addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) {
        searchInput.value = e.target.textContent;
        updateSearch();
      }
    });
  }
});

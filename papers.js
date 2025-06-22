document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const papersContainer = document.getElementById('papers');

  // Load CSV and render papers
  Papa.parse('papers.csv', {
    download: true,
    header: true,
    complete: function(results) {
      results.data.forEach(paper => {
        const paperDiv = document.createElement('div');
        paperDiv.className = 'paper';
        paperDiv.dataset.title = paper.Title;
        paperDiv.dataset.authors = paper.Authors;
        paperDiv.dataset.tags = paper.Tags;

        paperDiv.innerHTML = `
          <div class="paper-title"><a href="${paper.Link}" target="_blank">${paper.Title}</a></div>
          <div class="authors">${paper.Authors}</div>
          <div class="tags">
            ${paper.Tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join(' ')}
          </div>
        `;

        papersContainer.appendChild(paperDiv);
      });

      setupFiltering(); // After DOM is populated
    }
  });

  function setupFiltering() {
    const papers = document.querySelectorAll('.paper');
    const tags = document.querySelectorAll('.tag');

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      papers.forEach(paper => {
        const title = paper.dataset.title.toLowerCase();
        const authors = paper.dataset.authors.toLowerCase();
        const tags = paper.dataset.tags.toLowerCase();
        if (title.includes(query) || authors.includes(query) || tags.includes(query)) {
          paper.style.display = '';
        } else {
          paper.style.display = 'none';
        }
      });
    });

    tags.forEach(tag => {
      tag.addEventListener('click', function () {
        searchInput.value = tag.textContent;
        searchInput.dispatchEvent(new Event('input'));
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const papersContainer = document.getElementById('papers');

  // Load CSV and render papers
  Papa.parse('papers.csv', {
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

      setupFiltering(); // Now that papers exist
    },
    error: function(err) {
      console.error("CSV Load Error:", err);
    }
  });

  function setupFiltering() {
    const papers = document.querySelectorAll('.paper');

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      papers.forEach(paper => {
        const title = paper.dataset.title.toLowerCase();
        const authors = paper.dataset.authors.toLowerCase();
        const tags = paper.dataset.tags.toLowerCase();
        const match = title.includes(query) || authors.includes(query) || tags.includes(query);
        paper.style.display = match ? '' : 'none';
      });
    });

    // Add click listeners after rendering
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', function () {
        searchInput.value = tag.textContent;
        searchInput.dispatchEvent(new Event('input'));
      });
    });
  }
});

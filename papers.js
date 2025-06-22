document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
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
});
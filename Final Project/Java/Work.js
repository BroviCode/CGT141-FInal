const searchBox = document.getElementById('searchBox');
const images = document.querySelectorAll('#imagecontainer img');

if (searchBox) {
  const onInput = () => {
    const searchText = (searchBox.value || '').toLowerCase().trim();
    let visibleOrder = 0;

    images.forEach(img => {
      let matchesSearch = false;
      
      if (searchText === '') {
        matchesSearch = true;
      } else {
        const name = (img.dataset.name || '').toLowerCase();
        const category = (img.dataset.category || '').toLowerCase();
        const medium = (img.dataset.medium || '').toLowerCase();
        const altText = (img.alt || '').toLowerCase();
        
        matchesSearch = name.includes(searchText) || 
                       category.includes(searchText) || 
                       medium.includes(searchText) || 
                       altText.includes(searchText);
      }
      
      img.style.display = matchesSearch ? '' : 'none';
      
      const column = img.closest('.column');
      if (column) {
        if (matchesSearch) {
          column.style.order = visibleOrder++;
        } else {
          column.style.order = 1000 + visibleOrder; // push hidden to end
        }
      }
      
      const description = img.nextElementSibling;
      if (description && description.classList.contains('imgDescription')) {
        description.style.display = matchesSearch ? '' : 'none';
      }
    });
   
    try {
      const noResults = document.getElementById('noResults');
      if (noResults) {
        const anyVisible = Array.from(images).some(img => window.getComputedStyle(img).display !== 'none');
        noResults.style.display = anyVisible ? 'none' : 'block';
      }
    } catch (e) {
      console.warn('Error toggling #noResults:', e);
    }
  };

  searchBox.addEventListener('input', onInput);
  searchBox.addEventListener('keyup', onInput);
} else {
  console.warn('Search input with id "searchBox" not found.');
}
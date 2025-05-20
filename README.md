document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('sortableTable');
  const headers = table.querySelectorAll('th[data-sort]');
  let sortDirection = 1; // 1: по возрастанию, -1: по убыванию

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const type = header.getAttribute('data-sort');
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      sortDirection = sortDirection * -1; // Переключаем направление

      // Сортировка строк
      rows.sort((rowA, rowB) => {
        let valueA = rowA.cells[index].textContent.trim();
        let valueB = rowB.cells[index].textContent.trim();

        // Обработка чисел
        if (type === 'number') {
          valueA = parseFloat(valueA) || 0;
          valueB = parseFloat(valueB) || 0;
          return (valueA - valueB) * sortDirection;
        }

        // Обработка текста
        return valueA.localeCompare(valueB) * sortDirection;
      });

      // Перестраиваем таблицу
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';
      rows.forEach(row => tbody.appendChild(row));

      // Показываем направление сортировки (опционально)
      headers.forEach(h => h.textContent = h.textContent.replace(' ↑', '').replace(' ↓', ''));
      header.textContent += sortDirection === 1 ? ' ↑' : ' ↓';
    });
  });
});

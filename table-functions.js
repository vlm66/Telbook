function updateSortConfig(key) {
    if (sortConfig.key === key) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.key = key;
        sortConfig.direction = 'asc';
    }
}

let sortConfig = {
    key: null,
    direction: 'asc'
};
let currentCard = null; // Для хранения текущей открытой карточки

function fillTableAbon(jsonData, filter = '') {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    const table = document.getElementById('tableAbon');
    if (!table) {
        console.error('Таблица с id="tableAbon" не найдена');
        return;
    }

    // Очищаем таблицу
    table.innerHTML = '';

    // Создаём заголовки таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Штатная единица', 'ФИО', 'Телефон', 'Штатная единица руководителя', 'Действия'];

    Object.keys(data[0]).slice(0, 4).forEach((key, index) => {
        const th = document.createElement('th');
        th.textContent = headers[index];
        th.dataset.sortKey = key;
        th.addEventListener('click', () => {
            updateSortConfig(key);
            fillTableAbon(jsonData, filter);
        });
        if (sortConfig.key === key) {
            th.classList.add(sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
        headerRow.appendChild(th);
    });

    // Добавляем последний заголовок для действий
    const thActions = document.createElement('th');
    thActions.textContent = headers[4];
    headerRow.appendChild(thActions);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Фильтруем данные
    const filteredData = data.filter(entry => {
        const fullName = entry.Employee.FullName.toLowerCase();
        const phone = entry.Employee.Phone.toLowerCase();
        const search = filter.toLowerCase();
        return fullName.includes(search) || phone.includes(search);
    });

    // Сортируем данные
    const sortedData = [...filteredData];
    if (sortConfig.key) {
        sortedData.sort((a, b) => {
            let valA, valB;

            if (sortConfig.key === 'Employee') {
                valA = a.Employee.FullName.toLowerCase();
                valB = b.Employee.FullName.toLowerCase();
            } else if (sortConfig.key === 'StaffUnit' || sortConfig.key === 'ManagerStaffUnit') {
                valA = a[sortConfig.key];
                valB = b[sortConfig.key];
            } else if (sortConfig.key === 'Phone') {
                valA = a.Employee.Phone.toLowerCase();
                valB = b.Employee.Phone.toLowerCase();
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Заполняем тело таблицы
    const tbody = document.createElement('tbody');
    sortedData.forEach(entry => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${entry.StaffUnit}</td>
            <td>${entry.Employee.FullName}</td>
            <td>${entry.Employee.Phone}</td>
            <td>${entry.ManagerStaffUnit}</td>
            <td>
                <button class="btn btn-sm btn-info show-card-btn">Показать</button>
            </td>
        `;

        // Добавляем обработчик клика
        row.querySelector('.show-card-btn').addEventListener('click', () => {
            if (currentCard && currentCard.parentNode === row.nextElementSibling) {
                currentCard.remove();
                currentCard = null;
            } else {
                if (currentCard) currentCard.remove();
        
                const card = createCard(entry);
                row.insertAdjacentElement('afterend', card);
                currentCard = card;
            }
        });
        

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
}

// Функция создания карточки
function createCard(employee) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '5'); // если в таблице 5 столбцов

    const card = document.createElement('div');
    card.className = 'card mt-2';
    card.style.width = '100%'; // ширина на всю строку
    card.style.padding = '10px';
    card.style.backgroundColor = '#f9f9f9';
    card.innerHTML = `
        <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h5 class="card-title">${employee.Employee.FullName}</h5>
                <button class="btn btn-sm btn-secondary close-card-btn">Закрыть</button>
            </div>
            <p class="card-text"><strong>Штатная единица:</strong> ${employee.StaffUnit}</p>
            <p class="card-text"><strong>Телефон:</strong> ${employee.Employee.Phone}</p>
            <p class="card-text"><strong>Руководитель (штатная единица):</strong> ${employee.ManagerStaffUnit}</p>
        </div>
    `;

    // Обработчик клика на кнопке "Закрыть"
    card.querySelector('.close-card-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // предотвращаем повторный клик по строке
        tr.remove();
        currentCard = null;
    });

    td.appendChild(card);
    tr.appendChild(td);
    return tr;
}
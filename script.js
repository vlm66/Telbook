

const treeData = [
    {
        "Code": "1",
        "ParentCode": "",
        "Name": "Отдел продаж",
        "StaffUnit": 20,
        "Email": "sales@example.com"
    },
    {
        "Code": "2",
        "ParentCode": "1",
        "Name": "Группа маркетинга",
        "StaffUnit": 10,
        "Email": "marketing@example.com"
    },
    {
        "Code": "3",
        "ParentCode": "1",
        "Name": "Группа поддержки",
        "StaffUnit": 15,
        "Email": "support@example.com"
    },
    {
        "Code": "4",
        "ParentCode": "2",
        "Name": "Команда рекламы",
        "StaffUnit": 5,
        "Email": "advertising@example.com"
    },
    {
        "Code": "5",
        "ParentCode": "2",
        "Name": "Команда аналитики",
        "StaffUnit": 3,
        "Email": "analytics@example.com"
    },
    {
        "Code": "6",
        "ParentCode": "3",
        "Name": "Техническая поддержка",
        "StaffUnit": 8,
        "Email": "techsupport@example.com"
    },
    {
        "Code": "7",
        "ParentCode": "3",
        "Name": "Клиентский сервис",
        "StaffUnit": 7,
        "Email": "customer.service@example.com"
    },
    {
        "Code": "8",
        "ParentCode": "4",
        "Name": "Подразделение цифровой рекламы",
        "StaffUnit": 2,
        "Email": "digitalads@example.com"
    },
    {
        "Code": "9",
        "ParentCode": "4",
        "Name": "Подразделение печатной рекламы",
        "StaffUnit": 3,
        "Email": "printads@example.com"
    },
    {
        "Code": "10",
        "ParentCode": "5",
        "Name": "Аналитики данных",
        "StaffUnit": 2,
        "Email": "data.analytics@example.com"
    },
    {
        "Code": "11",
        "ParentCode": "5",
        "Name": "Аналитики рынка",
        "StaffUnit": 1,
        "Email": "market.analytics@example.com"
    },
    {
        "Code": "12",
        "ParentCode": "6",
        "Name": "Поддержка ПО",
        "StaffUnit": 4,
        "Email": "software.support@example.com"
    },
    {
        "Code": "13",
        "ParentCode": "6",
        "Name": "Поддержка оборудования",
        "StaffUnit": 4,
        "Email": "hardware.support@example.com"
    },
    {
        "Code": "14",
        "ParentCode": "7",
        "Name": "Сервис по работе с VIP клиентами",
        "StaffUnit": 3,
        "Email": "vip.service@example.com"
    },
    {
        "Code": "15",
        "ParentCode": "7",
        "Name": "Сервис по работе с корпоративными клиентами",
        "StaffUnit": 4,
        "Email": "corporate.service@example.com"
    },
    {
        "Code": "16",
        "ParentCode": "14",
        "Name": "Личные менеджеры VIP",
        "StaffUnit": 2,
        "Email": "vip.managers@example.com"
    },
    {
        "Code": "17",
        "ParentCode": "14",
        "Name": "Консьерж сервис VIP",
        "StaffUnit": 1,
        "Email": "vip.concierge@example.com"
    },
    {
        "Code": "18",
        "ParentCode": "15",
        "Name": "Менеджеры по корп. клиентам",
        "StaffUnit": 3,
        "Email": "corporate.managers@example.com"
    },
    {
        "Code": "19",
        "ParentCode": "15",
        "Name": "Отдел крупных сделок",
        "StaffUnit": 1,
        "Email": "big.deals@example.com"
    }
];

function buildTree(data, parentCode = "") {
    const nodes = [];
    data.filter(item => item.ParentCode === parentCode).forEach(item => {
        const node = { ...item, children: buildTree(data, item.Code) };
        nodes.push(node);
    });
    return nodes;
}

function createTreeList(data, parentElement) {
    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        if (item.children && item.children.length) {
            const toggleButton = document.createElement('span');
            toggleButton.className = 'toggle-icon';
            toggleButton.setAttribute('data-bs-toggle', 'collapse');
            toggleButton.setAttribute('data-bs-target', `#collapse-${item.Code}`);
            toggleButton.setAttribute('aria-expanded', 'true');
            toggleButton.setAttribute('aria-controls', `collapse-${item.Code}`);
            li.appendChild(toggleButton);
        } else {
            li.innerHTML = '&nbsp;&nbsp;&nbsp;';
        }
        li.append(item.Name);
        li.dataset.name = item.Name.toLowerCase(); // Сохраняем имя для поиска
        
        li.addEventListener('click', (e) => {
            document.querySelectorAll('#treeList .list-group-item').forEach(el => {
                el.classList.remove('active');
            });
            li.classList.add('active');
            filterTableAbonByManager(item.StaffUnit);
            document.querySelectorAll("#filterInput").textContent="ппп";
            e.stopPropagation();
        });
        parentElement.appendChild(li);
        if (item.children && item.children.length) {
            const ul = document.createElement('ul');
            ul.className = 'list-group collapse show';
            ul.id = `collapse-${item.Code}`;
            createTreeList(item.children, ul);
            parentElement.appendChild(ul);
        }
    });
}

// Функция для фильтрации дерева
function filterTree(searchTerm) {
    const treeList = document.getElementById('treeList');
    const items = treeList.querySelectorAll('li.list-group-item');
    searchTerm = searchTerm.toLowerCase();

    items.forEach(item => {
        const name = item.dataset.name;
        const ul = item.nextElementSibling; // Следующий <ul> (если есть дети)
        const isMatch = name.includes(searchTerm);

        // Показываем/скрываем элемент
        item.style.display = isMatch || searchTerm === '' ? '' : 'none';

        // Если есть дочерний ul, показываем его, если родитель соответствует
        if (ul && ul.classList.contains('list-group')) {
            ul.style.display = isMatch || searchTerm === '' ? '' : 'none';
        }
    });

    // Дополнительно: показываем родителей для видимых элементов
    items.forEach(item => {
        const ul = item.nextElementSibling;
        if (ul && ul.querySelector('li:not([style*="display: none"])')) {
            item.style.display = '';
            ul.style.display = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const treeList = document.getElementById('treeList');
    const hierarchicalData = buildTree(treeData);
    createTreeList(hierarchicalData, treeList);
    fillTableAbon(jsonData);

    // Обработчик поиска
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        filterTree(searchInput.value);
    });
    
});










function fillTableAbon(jsonData, filter = '') {
    // Парсим JSON, если передан как строка
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Находим таблицу в DOM
    const table = document.getElementById('tableAbon');
    if (!table) {
        console.error('Таблица с id="tableAbon" не найдена');
        return;
    }

    // Очищаем содержимое таблицы
    table.innerHTML = `
        <tr>
            <th>Штатная единица</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Штатная единица руководителя</th>
        </tr>
    `;

    // Фильтруем данные
    const filteredData = data.filter(entry => {
        const fullName = entry.Employee.FullName.toLowerCase();
        const phone = entry.Employee.Phone.toLowerCase();
        const search = filter.toLowerCase();
        return fullName.includes(search) || phone.includes(search);
    });

    // Заполняем таблицу отфильтрованными данными
    filteredData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.StaffUnit}</td>
            <td>${entry.Employee.FullName}</td>
            <td>${entry.Employee.Phone}</td>
            <td>${entry.ManagerStaffUnit}</td>
        `;
        table.appendChild(row);
    });
}

// Пример использования:
const jsonData = [
    {
        "StaffUnit": 1,
        "Employee": {
            "FullName": "Иванов Иван Иванович",
            "Phone": "+7 (495) 123-45-67"
        },
        "ManagerStaffUnit": 1
    },
    {
        "StaffUnit": 2,
        "Employee": {
            "FullName": "Петров Петр Петрович",
            "Phone": "+7 (495) 234-56-78"
        },
        "ManagerStaffUnit": 1
    },
    {
        "StaffUnit": 3,
        "Employee": {
            "FullName": "Сидорова Анна Сергеевна",
            "Phone": "+7 (495) 345-67-89"
        },
        "ManagerStaffUnit": 2
    },
    {
        "StaffUnit": 4,
        "Employee": {
            "FullName": "Кузнецов Алексей Михайлович",
            "Phone": "+7 (495) 456-78-90"
        },
        "ManagerStaffUnit": 2
    },
    {
        "StaffUnit": 5,
        "Employee": {
            "FullName": "Смирнова Елена Владимировна",
            "Phone": "+7 (495) 567-89-01"
        },
        "ManagerStaffUnit": 3
    },
    {
        "StaffUnit": 6,
        "Employee": {
            "FullName": "Васильев Дмитрий Александрович",
            "Phone": "+7 (495) 678-90-12"
        },
        "ManagerStaffUnit": 3
    },
    {
        "StaffUnit": 7,
        "Employee": {
            "FullName": "Николаев Никита Олегович",
            "Phone": "+7 (495) 789-01-23"
        },
        "ManagerStaffUnit": 4
    },
    {
        "StaffUnit": 8,
        "Employee": {
            "FullName": "Морозова Ольга Игоревна",
            "Phone": "+7 (495) 890-12-34"
        },
        "ManagerStaffUnit": 4
    },
    {
        "StaffUnit": 9,
        "Employee": {
            "FullName": "Федоров Андрей Викторович",
            "Phone": "+7 (495) 901-23-45"
        },
        "ManagerStaffUnit": 5
    },
    {
        "StaffUnit": 10,
        "Employee": {
            "FullName": "Гончарова Мария Николаевна",
            "Phone": "+7 (495) 012-34-56"
        },
        "ManagerStaffUnit": 5
    },
    {
        "StaffUnit": 11,
        "Employee": {
            "FullName": "Белов Артем Сергеевич",
            "Phone": "+7 (495) 123-45-78"
        },
        "ManagerStaffUnit": 6
    },
    {
        "StaffUnit": 12,
        "Employee": {
            "FullName": "Крылова Виктория Дмитриевна",
            "Phone": "+7 (495) 234-56-89"
        },
        "ManagerStaffUnit": 6
    },
    {
        "StaffUnit": 13,
        "Employee": {
            "FullName": "Тимофеев Игорь Борисович",
            "Phone": "+7 (495) 345-67-90"
        },
        "ManagerStaffUnit": 7
    },
    {
        "StaffUnit": 14,
        "Employee": {
            "FullName": "Савельева Анастасия Павловна",
            "Phone": "+7 (495) 456-78-01"
        },
        "ManagerStaffUnit": 7
    },
    {
        "StaffUnit": 15,
        "Employee": {
            "FullName": "Григорьев Максим Андреевич",
            "Phone": "+7 (495) 567-89-12"
        },
        "ManagerStaffUnit": 8
    },
    {
        "StaffUnit": 16,
        "Employee": {
            "FullName": "Мельникова Ксения Валерьевна",
            "Phone": "+7 (495) 678-90-23"
        },
        "ManagerStaffUnit": 8
    },
    {
        "StaffUnit": 17,
        "Employee": {
            "FullName": "Комаров Владислав Игоревич",
            "Phone": "+7 (495) 789-01-34"
        },
        "ManagerStaffUnit": 9
    },
    {
        "StaffUnit": 18,
        "Employee": {
            "FullName": "Орлова Дарья Сергеевна",
            "Phone": "+7 (495) 890-12-45"
        },
        "ManagerStaffUnit": 9
    },
    {
        "StaffUnit": 19,
        "Employee": {
            "FullName": "Егоров Станислав Олегович",
            "Phone": "+7 (495) 901-23-56"
        },
        "ManagerStaffUnit": 10
    },
    {
        "StaffUnit": 20,
        "Employee": {
            "FullName": "Зайцева Екатерина Александровна",
            "Phone": "+7 (495) 012-34-67"
        },
        "ManagerStaffUnit": 10
    },
    {
        "StaffUnit": 21,
        "Employee": {
            "FullName": "Соколов Артем Викторович",
            "Phone": "+7 (495) 123-45-89"
        },
        "ManagerStaffUnit": 11
    },
    {
        "StaffUnit": 22,
        "Employee": {
            "FullName": "Волкова Юлия Игоревна",
            "Phone": "+7 (495) 234-56-90"
        },
        "ManagerStaffUnit": 11
    },
    {
        "StaffUnit": 23,
        "Employee": {
            "FullName": "Павлов Антон Дмитриевич",
            "Phone": "+7 (495) 345-67-01"
        },
        "ManagerStaffUnit": 12
    },
    {
        "StaffUnit": 24,
        "Employee": {
            "FullName": "Семенова Ольга Владимировна",
            "Phone": "+7 (495) 456-78-12"
        },
        "ManagerStaffUnit": 12
    },
    {
        "StaffUnit": 25,
        "Employee": {
            "FullName": "Гусев Денис Сергеевич",
            "Phone": "+7 (495) 567-89-23"
        },
        "ManagerStaffUnit": 13
    },
    {
        "StaffUnit": 26,
        "Employee": {
            "FullName": "Ковалева Анна Михайловна",
            "Phone": "+7 (495) 678-90-34"
        },
        "ManagerStaffUnit": 13
    },
    {
        "StaffUnit": 27,
        "Employee": {
            "FullName": "Ильин Роман Андреевич",
            "Phone": "+7 (495) 789-01-45"
        },
        "ManagerStaffUnit": 14
    },
    {
        "StaffUnit": 28,
        "Employee": {
            "FullName": "Новикова Татьяна Николаевна",
            "Phone": "+7 (495) 890-12-56"
        },
        "ManagerStaffUnit": 14
    },
    {
        "StaffUnit": 29,
        "Employee": {
            "FullName": "Максимов Евгений Валерьевич",
            "Phone": "+7 (495) 901-23-67"
        },
        "ManagerStaffUnit": 15
    },
    {
        "StaffUnit": 30,
        "Employee": {
            "FullName": "Лебедева Надежда Петровна",
            "Phone": "+7 (495) 012-34-78"
        },
        "ManagerStaffUnit": 15
    },
    {
        "StaffUnit": 31,
        "Employee": {
            "FullName": "Соловьев Кирилл Алексеевич",
            "Phone": "+7 (495) 123-45-90"
        },
        "ManagerStaffUnit": 16
    },
    {
        "StaffUnit": 32,
        "Employee": {
            "FullName": "Ефимова Вероника Сергеевна",
            "Phone": "+7 (495) 234-56-01"
        },
        "ManagerStaffUnit": 16
    },
    {
        "StaffUnit": 33,
        "Employee": {
            "FullName": "Баранов Александр Игоревич",
            "Phone": "+7 (495) 345-67-12"
        },
        "ManagerStaffUnit": 17
    },
    {
        "StaffUnit": 34,
        "Employee": {
            "FullName": "Романова Елизавета Дмитриевна",
            "Phone": "+7 (495) 456-78-23"
        },
        "ManagerStaffUnit": 17
    },
    {
        "StaffUnit": 35,
        "Employee": {
            "FullName": "Воробьев Павел Андреевич",
            "Phone": "+7 (495) 567-89-34"
        },
        "ManagerStaffUnit": 18
    },
    {
        "StaffUnit": 36,
        "Employee": {
            "FullName": "Антонова Марина Викторовна",
            "Phone": "+7 (495) 678-90-45"
        },
        "ManagerStaffUnit": 18
    },
    {
        "StaffUnit": 37,
        "Employee": {
            "FullName": "Артемьев Дмитрий Олегович",
            "Phone": "+7 (495) 789-01-56"
        },
        "ManagerStaffUnit": 19
    },
    {
        "StaffUnit": 38,
        "Employee": {
            "FullName": "Михайлова Светлана Александровна",
            "Phone": "+7 (495) 890-12-67"
        },
        "ManagerStaffUnit": 19
    },
    {
        "StaffUnit": 39,
        "Employee": {
            "FullName": "Тарасов Виталий Сергеевич",
            "Phone": "+7 (495) 901-23-78"
        },
        "ManagerStaffUnit": 20
    },
    {
        "StaffUnit": 40,
        "Employee": {
            "FullName": "Фролова Алина Игоревна",
            "Phone": "+7 (495) 012-34-89"
        },
        "ManagerStaffUnit": 20
    },
    {
        "StaffUnit": 41,
        "Employee": {
            "FullName": "Данилов Артур Викторович",
            "Phone": "+7 (495) 123-45-01"
        },
        "ManagerStaffUnit": 21
    },
    {
        "StaffUnit": 42,
        "Employee": {
            "FullName": "Жукова Валерия Дмитриевна",
            "Phone": "+7 (495) 234-56-12"
        },
        "ManagerStaffUnit": 21
    },
    {
        "StaffUnit": 43,
        "Employee": {
            "FullName": "Савин Константин Андреевич",
            "Phone": "+7 (495) 345-67-23"
        },
        "ManagerStaffUnit": 22
    },
    {
        "StaffUnit": 44,
        "Employee": {
            "FullName": "Герасимова Оксана Владимировна",
            "Phone": "+7 (495) 456-78-34"
        },
        "ManagerStaffUnit": 22
    },
    {
        "StaffUnit": 45,
        "Employee": {
            "FullName": "Горбунов Илья Сергеевич",
            "Phone": "+7 (495) 567-89-45"
        },
        "ManagerStaffUnit": 23
    },
    {
        "StaffUnit": 46,
        "Employee": {
            "FullName": "Кузьмина Ангелина Игоревна",
            "Phone": "+7 (495) 678-90-56"
        },
        "ManagerStaffUnit": 23
    },
    {
        "StaffUnit": 47,
        "Employee": {
            "FullName": "Кудрявцев Владимир Алексеевич",
            "Phone": "+7 (495) 789-01-67"
        },
        "ManagerStaffUnit": 24
    },
    {
        "StaffUnit": 48,
        "Employee": {
            "FullName": "Осипова Дарья Павловна",
            "Phone": "+7 (495) 890-12-78"
        },
        "ManagerStaffUnit": 24
    },
    {
        "StaffUnit": 49,
        "Employee": {
            "FullName": "Лазарев Алексей Дмитриевич",
            "Phone": "+7 (495) 901-23-89"
        },
        "ManagerStaffUnit": 25
    },
    {
        "StaffUnit": 50,
        "Employee": {
            "FullName": "Фомина Елена Витальевна",
            "Phone": "+7 (495) 012-34-90"
        },
        "ManagerStaffUnit": 25
    },
    {
        "StaffUnit": 51,
        "Employee": {
            "FullName": "Матвеев Сергей Олегович",
            "Phone": "+7 (495) 123-45-12"
        },
        "ManagerStaffUnit": 26
    },
    {
        "StaffUnit": 52,
        "Employee": {
            "FullName": "Игнатьева Виктория Андреевна",
            "Phone": "+7 (495) 234-56-23"
        },
        "ManagerStaffUnit": 26
    },
    {
        "StaffUnit": 53,
        "Employee": {
            "FullName": "Родионов Артем Игоревич",
            "Phone": "+7 (495) 345-67-34"
        },
        "ManagerStaffUnit": 27
    },
    {
        "StaffUnit": 54,
        "Employee": {
            "FullName": "Тихонова Анастасия Сергеевна",
            "Phone": "+7 (495) 456-78-45"
        },
        "ManagerStaffUnit": 27
    },
    {
        "StaffUnit": 55,
        "Employee": {
            "FullName": "Калинин Денис Владимирович",
            "Phone": "+7 (495) 567-89-56"
        },
        "ManagerStaffUnit": 28
    },
    {
        "StaffUnit": 56,
        "Employee": {
            "FullName": "Шестакова Ирина Николаевна",
            "Phone": "+7 (495) 678-90-67"
        },
        "ManagerStaffUnit": 28
    },
    {
        "StaffUnit": 57,
        "Employee": {
            "FullName": "Гаврилов Михаил Андреевич",
            "Phone": "+7 (495) 789-01-78"
        },
        "ManagerStaffUnit": 29
    },
    {
        "StaffUnit": 58,
        "Employee": {
            "FullName": "Денисова Кристина Викторовна",
            "Phone": "+7 (495) 890-12-89"
        },
        "ManagerStaffUnit": 29
    },
    {
        "StaffUnit": 59,
        "Employee": {
            "FullName": "Ермаков Иван Сергеевич",
            "Phone": "+7 (495) 901-23-90"
        },
        "ManagerStaffUnit": 30
    },
    {
        "StaffUnit": 60,
        "Employee": {
            "FullName": "Сорокина Алена Дмитриевна",
            "Phone": "+7 (495) 012-34-01"
        },
        "ManagerStaffUnit": 30
    }
];

function filterTableAbonByManager(managerStaffUnit) {

    const table = document.getElementById('tableAbon');
    if (!table) {
        console.error('Таблица с id="tableAbon" не найдена');
        return;
    }

    
    const rows = table.querySelectorAll('tr:not(:first-child)');

    
    rows.forEach(row => {
        const managerCell = row.cells[3]; 
        if (managerCell) {
            const managerValue = managerCell.textContent.trim();
            
            row.style.display = managerValue === managerStaffUnit.toString() ? '' : 'none';
        }
    });
}

function applyFilter() {
    const filterValue = document.getElementById('filterInput').value;
    fillTableAbon(jsonData, filterValue);
}

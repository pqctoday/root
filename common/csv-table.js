let tableData = [];
let currentSortColumn = '';
let ascending = true;
let currentTableSelector = '';

function loadAndRenderTable({csvPath, category, tableSelector}) {
    currentTableSelector = tableSelector;
    Papa.parse(csvPath, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            tableData = results.data.map(row => {
                const normalized = {};
                Object.keys(row).forEach(key => {
                    normalized[key.trim().toLowerCase()] = row[key];
                });
                return normalized;
            });
            if (category) {
                tableData = filterCSVByCategory(tableData, category);
            }
            renderTable();
        },
        error: function(err) {
            console.error('Error loading CSV:', err);
        }
    });
}

function filterCSVByCategory(data, category) {
    return data.filter(row =>
        row.category && row.category.toLowerCase() === category.toLowerCase()
    );
}

function renderTable() {
    const tbody = document.querySelector(`${currentTableSelector} tbody`);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (tableData.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 8;
        td.textContent = 'No records found.';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    tableData.forEach(row => {
        const tr = document.createElement('tr');
        ['title','date','url','author','country','category','reference','type'].forEach(column => {
            const td = document.createElement('td');
            if (column === 'url') {
                const link = document.createElement('a');
                link.href = row[column];
                link.textContent = 'Link';
                link.target = '_blank';
                td.appendChild(link);
            } else {
                td.textContent = row[column] || '';
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function sortTable(column) {
    if (currentSortColumn === column) {
        ascending = !ascending;
    } else {
        ascending = true;
        currentSortColumn = column;
    }

    tableData.sort((a, b) => {
        const valueA = a[column] || '';
        const valueB = b[column] || '';
        if (column === 'date') {
            return ascending ? new Date(valueA) - new Date(valueB)
                              : new Date(valueB) - new Date(valueA);
        }
        return ascending ? valueA.localeCompare(valueB)
                          : valueB.localeCompare(valueA);
    });

    renderTable();
}


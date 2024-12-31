let tableData = []; // To hold the parsed and filtered data for reuse
let currentSortColumn = ''; // To track the currently sorted column
let ascending = true; // To toggle ascending/descending order

function filterCSVByCategory(filePath, category) {
    Papa.parse(filePath, {
        download: true, // Fetch file from server
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            // Normalize headers (trim and lowercase)
            tableData = results.data.map(row => {
                const normalizedRow = {};
                Object.keys(row).forEach(key => {
                    normalizedRow[key.trim().toLowerCase()] = row[key];
                });
                return normalizedRow;
            }).filter(row => row.category && row.category.toLowerCase() === category.toLowerCase());

            renderTable(); // Render the table with initial data
        },
        error: function(err) {
            console.error("Error loading CSV:", err);
        }
    });
}

function renderTable() {
    const tbody = document.querySelector('#outputTable tbody');
    tbody.innerHTML = ''; // Clear previous rows

    if (tableData.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 8;
        td.textContent = "No records found for the selected category.";
        td.style.textAlign = "center";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    tableData.forEach(row => {
        const tr = document.createElement('tr');
        ['title', 'date', 'url', 'author', 'country', 'category', 'reference', 'type'].forEach(column => {
            const td = document.createElement('td');
            if (column === 'url') {
                const link = document.createElement('a');
                link.href = row[column];
                link.textContent = "Link";
                link.target = "_blank";
                td.appendChild(link);
            } else {
                td.textContent = row[column] || ''; // Handle missing fields
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function sortTable(column) {
    // Determine sort order
    if (currentSortColumn === column) {
        ascending = !ascending; // Toggle order if sorting the same column
    } else {
        ascending = true; // Default to ascending for new column
        currentSortColumn = column;
    }

    tableData.sort((a, b) => {
        const valueA = a[column] || '';
        const valueB = b[column] || '';
        
        // Compare dates if the column is "date"
        if (column === 'date') {
            return ascending
                ? new Date(valueA) - new Date(valueB)
                : new Date(valueB) - new Date(valueA);
        }

        // Compare strings for other columns
        return ascending
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    });

    renderTable(); // Re-render the table with sorted data
}

// Automatically load and process the CSV file on page load
document.addEventListener('DOMContentLoaded', () => {
    const filePath = '../../../references.csv'; // Correct relative path
    const category = 'Government'; // Hardcoded category to filter by
    filterCSVByCategory(filePath, category);
});

let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const transactionTableBody = document.getElementById('transaction-table-body');
const totalAmountCell = document.getElementById('total-amount');

function updateTotalAmount() {
    totalAmountCell.textContent = totalAmount.toFixed(2);
}

function createTableRow(expense) {
    const newRow = transactionTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        const index = expenses.indexOf(expense);
        if (index > -1) {
            expenses.splice(index, 1);
            if (expense.category === 'Income') {
                totalAmount -= expense.amount;
            } else {
                totalAmount += expense.amount;
            }
            updateTotalAmount();
            transactionTableBody.removeChild(newRow);
        }
    });

    deleteCell.appendChild(deleteBtn);
}

addBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value;
    const date = dateInput.value;

    if (!category) {
        alert('Please select a category.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    if (!info) {
        alert('Please enter valid info.');
        return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const newExpense = { category, amount, info, date };

    // Send data to server
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            expenses.push(newExpense);

            if (category === 'Income') {
                totalAmount += amount;
            } else {
                totalAmount -= amount;
            }

            updateTotalAmount();
            createTableRow(newExpense);

            categorySelect.value = '';
            amountInput.value = '';
            infoInput.value = '';
            dateInput.value = '';
        } else {
            alert('Error saving data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving data. Please try again.');
    });
});

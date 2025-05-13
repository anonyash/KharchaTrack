// Global variables
let accounts = [];
let transactions = [];
let userId = localStorage.getItem('userId');

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

// Fetch data from backend
async function fetchData() {
    try {
        // Fetch accounts
        const accountsResponse = await fetch(`http://localhost:3000/api/accounts?user_id=${userId}`);
        if (!accountsResponse.ok) throw new Error('Failed to fetch accounts');
        accounts = await accountsResponse.json();

        // Fetch account summary
        const summaryResponse = await fetch(`http://localhost:3000/api/account-summary?user_id=${userId}`);
        if (!summaryResponse.ok) throw new Error('Failed to fetch account summary');
        const summary = await summaryResponse.json();

        // Fetch recent transactions
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const transactionsResponse = await fetch(`http://localhost:3000/api/transaction?month=${month}&year=${year}&user_id=${userId}`);
        if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
        transactions = await transactionsResponse.json();

        // Update UI with fetched data
        updateAccountSummary(summary);
        renderAccountsList();
        renderTransactions();
        initializeCharts();
    } catch (error) {
        console.error('Error fetching data:', error);
        // alert('Failed to load data. Please try again later.');
    }
}

// Update account summary cards
function updateAccountSummary(summary) {
    document.getElementById('totalBalance').textContent = formatCurrency(summary.totalBalance);
    document.getElementById('totalIncome').textContent = formatCurrency(summary.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(summary.totalExpenses);
    document.getElementById('totalSavings').textContent = formatCurrency(summary.savings);

    // Update change indicators (example with previous month's data)
    const previousMonthData = {
        income: summary.totalIncome * 0.9, // Example: 10% less than current
        expenses: summary.totalExpenses * 0.95, // Example: 5% less than current
        savings: summary.savings * 0.85 // Example: 15% less than current
    };

    updateChangeIndicator('incomeChange', summary.totalIncome, previousMonthData.income);
    updateChangeIndicator('expensesChange', summary.totalExpenses, previousMonthData.expenses);
    updateChangeIndicator('savingsChange', summary.savings, previousMonthData.savings);
}

function updateChangeIndicator(elementId, current, previous) {
    const element = document.getElementById(elementId);
    const change = calculatePercentageChange(current, previous);
    const icon = element.querySelector('.change-icon');
    const value = element.querySelector('.change-value');

    icon.textContent = change >= 0 ? '↑' : '↓';
    value.textContent = `${Math.abs(change).toFixed(1)}%`;
    element.className = `account-change ${change >= 0 ? 'positive' : 'negative'}`;
}

// Render accounts list with transaction count
function renderAccountsList() {
    const accountsList = document.getElementById('accountsList');
    accountsList.innerHTML = accounts.map(account => `
        <div class="account-item" data-id="${account.id}">
            <div class="account-info">
                <h4>${account.name}</h4>
                <p class="account-balance ${account.balance >= 0 ? 'money-plus' : 'money-minus'}">
                    ${formatCurrency(account.balance)}
                </p>
                <p class="account-type">${account.type}</p>
            </div>
            <div class="account-actions">
                <button class="view-transactions" onclick="viewAccountTransactions(${account.id})">View Transactions</button>
                <button class="edit-account" onclick="editAccount(${account.id})">Edit</button>
                <button class="delete-account" onclick="deleteAccount(${account.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// View transactions for a specific account
async function viewAccountTransactions(accountId) {
    try {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        const response = await fetch(`http://localhost:3000/api/account-transactions/${accountId}?month=${month}&year=${year}`);
        if (!response.ok) throw new Error('Failed to fetch account transactions');
        
        const accountTransactions = await response.json();
        const account = accounts.find(acc => acc.id === accountId);
        
        // Update transaction list with account-specific transactions
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = `
            <h4>Transactions for ${account.name}</h4>
            ${accountTransactions.map(transaction => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <h4>${transaction.text}</h4>
                        <p class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <p class="transaction-amount ${transaction.amount >= 0 ? 'money-plus' : 'money-minus'}">
                        ${formatCurrency(transaction.amount)}
                    </p>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error fetching account transactions:', error);
    }
}

// Add transaction to specific account
async function addTransaction(accountId) {
    const amount = parseFloat(prompt('Enter transaction amount:'));
    if (isNaN(amount)) return;

    const text = prompt('Enter transaction description:');
    if (!text) return;

    const type = confirm('Is this an income transaction?') ? 'income' : 'expense';
    const transactionAmount = type === 'income' ? amount : -amount;

    try {
        const transaction = {
            id: generateID(),
            user_id: userId,
            account_id: accountId,
            amount: transactionAmount,
            sig: type === 'income' ? '+' : '-',
            currency: 'INR',
            text,
            note: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0]
        };

        const response = await fetch('http://localhost:3000/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) throw new Error('Failed to add transaction');

        // Refresh data to show updated balances
        await fetchData();
        alert('Transaction added successfully!');
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
}

// Update account management functions to handle transactions
async function deleteAccount(id) {
    if (!confirm('Are you sure you want to delete this account? All associated transactions will be deleted.')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete account');

        // Update local accounts array
        accounts = accounts.filter(acc => acc.id !== id);
        
        // Update localStorage
        const localStorageTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const updatedTransactions = localStorageTransactions.filter(t => t.account_id !== id);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

        // Update UI
        renderAccountsList();
        initializeCharts();
        await fetchData(); // Refresh all data including account summary
        
        // Reload the page to ensure all data is in sync
        location.reload();
    } catch (error) {
        console.error('Error deleting account:', error);
    }
}

// Render recent transactions
function renderTransactions() {
    const transactionList = document.getElementById('transactionList');
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    transactionList.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${transaction.text}</h4>
                <p class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <p class="transaction-amount ${transaction.amount >= 0 ? 'money-plus' : 'money-minus'}">
                ${formatCurrency(transaction.amount)}
            </p>
        </div>
    `).join('');
}

// Initialize charts
function initializeCharts() {
    // Account Distribution Chart
    const distributionCtx = document.getElementById('accountDistributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: accounts.map(acc => acc.name),
            datasets: [{
                data: accounts.map(acc => Math.abs(acc.balance)),
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Monthly Overview Chart
    const overviewCtx = document.getElementById('monthlyOverviewChart').getContext('2d');
    const monthlyData = {
        income: transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
        expenses: Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0))
    };

    new Chart(overviewCtx, {
        type: 'line',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [
                {
                    label: 'Monthly Overview',
                    data: [monthlyData.income, monthlyData.expenses],
                    borderColor: '#2ecc71',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Account management functions
async function addAccount() {
    const name = prompt('Enter account name:');
    if (!name) return;

    const type = prompt('Enter account type (cash/bank/credit):');
    if (!type) return;

    const balance = parseFloat(prompt('Enter initial balance:'));
    if (isNaN(balance)) return;

    try {
        const response = await fetch('http://localhost:3000/api/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                name,
                balance,
                type
            })
        });

        if (!response.ok) throw new Error('Failed to create account');

        const data = await response.json();
        accounts.push({ id: data.id, name, balance, type });
        renderAccountsList();
        initializeCharts();

        // // Update total balance in index.html
        // const balanceElement = document.getElementById('balance');
        // if (balanceElement) {
        //     const currentBalance = parseFloat(balanceElement.textContent.replace(/[^0-9.-]+/g, ''));
        //     const newBalance = currentBalance + balance;
        //     balanceElement.textContent = formatCurrency(newBalance);
        // }

        // // Update income if initial balance is positive
        // if (balance > 0) {
        //     const incomeElement = document.getElementById('money-plus');
        //     if (incomeElement) {
        //         const currentIncome = parseFloat(incomeElement.textContent.replace(/[^0-9.-]+/g, ''));
        //         const newIncome = currentIncome + balance;
        //         incomeElement.textContent = formatCurrency(newIncome);
        //     }
        // }
        await fetchData(); // Refresh all data including account summary
        alert('Account created successfully!');
    } catch (error) {
        console.error('Error creating account:', error);
    }
}

async function editAccount(id) {
    const account = accounts.find(acc => acc.id === id);
    if (!account) return;

    const name = prompt('Enter new account name:', account.name);
    if (!name) return;

    const type = prompt('Enter new account type (cash/bank/credit):', account.type);
    if (!type) return;

    const balance = parseFloat(prompt('Enter new balance:', account.balance));
    if (isNaN(balance)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, balance, type })
        });

        if (!response.ok) throw new Error('Failed to update account');

        account.name = name;
        account.balance = balance;
        account.type = type;
        renderAccountsList();
        initializeCharts();
        await fetchData(); // Refresh all data including account summary
        alert('Account updated successfully!');
    } catch (error) {
        console.error('Error updating account:', error);
        // alert('Failed to update account. Please try again.');
    }
}

// async function deleteAccount(id) {
//     if (!confirm('Are you sure you want to delete this account?')) return;

//     try {
//         const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
//             method: 'DELETE'
//         });

//         if (!response.ok) throw new Error('Failed to delete account');

//         accounts = accounts.filter(acc => acc.id !== id);
//         renderAccountsList();
//         initializeCharts();
//         alert('Account deleted successfully!');
//     } catch (error) {
//         console.error('Error deleting account:', error);
//         // alert('Failed to delete account. Please try again.');
//     }
// }

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }
    
    fetchData();
    document.querySelector('.add-account-btn').addEventListener('click', addAccount);
}); 
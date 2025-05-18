// Get real transaction data from localStorage
let expenses = [];
let userId = localStorage.getItem('userId');
let defaultCurrency = localStorage.getItem('selectedCurrency') || 'INR';
let baseCurrency = 'INR';

// Chart instances
let distributionChart;
let trendChart;
let comparisonChart;

// DOM Elements
const transactionTypeSelect = document.getElementById('transactionType');
const categorySelect = document.getElementById('category');
const periodButtons = document.querySelectorAll('.period-btn');
const totalExpensesElement = document.getElementById('totalExpenses');
const averageDailyElement = document.getElementById('averageDaily');
const highestCategoryElement = document.getElementById('highestCategory');
const savingsRateElement = document.getElementById('savingsRate');
const categoryListElement = document.getElementById('categoryList');
const expenseTableBody = document.getElementById('expenseTableBody');

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await loadTransactions();
    setupEventListeners();
    updateAnalytics('all');
});

async function loadTransactions() {
    try {
        const response = await fetch(`http://localhost:3000/api/user-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        });

        if (!response.ok) throw new Error('Failed to fetch transactions');
        
        const transactions = await response.json();
        expenses = transactions; // Store all transactions
        console.log('Loaded transactions:', expenses);
        updateCategoryOptions(); // Update category options after loading transactions
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function setupEventListeners() {
    // Transaction type select handler
    transactionTypeSelect.addEventListener('change', () => {
        updateCategoryOptions();
        updateAnalytics('all');
    });
    
    // Category select handler
    categorySelect.addEventListener('change', () => {
        const activePeriod = document.querySelector('.period-btn.active').dataset.period;
        updateAnalytics(activePeriod);
    });
    
    // Period buttons handler
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateAnalytics(button.dataset.period);
        });
    });
}

function updateCategoryOptions() {
    const transactionType = transactionTypeSelect.value;
    
    // Clear existing options except "All Categories"
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }

    // Get unique categories based on transaction type
    const categories = new Set();
    expenses.forEach(tx => {
        if (transactionType === 'expenses' && tx.amount < 0) {
            categories.add(tx.text);
        } else if (transactionType === 'income' && tx.amount > 0) {
            categories.add(tx.text);
        } else if (transactionType === 'both') {
            categories.add(tx.text);
        }
    });

    // Add category options
    Array.from(categories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function updateAnalytics(period) {
    const filteredTransactions = filterTransactions(period);
    updateSummaryCards(filteredTransactions);
    updateCharts(filteredTransactions, period);
    updateCategoryBreakdown(filteredTransactions);
    updateComparisonChart(period);
    updateTransactionTable(filteredTransactions);
}

function filterTransactions(period) {
    let filtered = [...expenses];
    
    // Filter by period
    if (period !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= now;
        });
    }
    
    // Filter by transaction type
    const transactionType = transactionTypeSelect.value;
    if (transactionType === 'expenses') {
        filtered = filtered.filter(tx => tx.amount < 0);
    } else if (transactionType === 'income') {
        filtered = filtered.filter(tx => tx.amount > 0);
    }
    
    // Filter by category if selected
    const selectedCategory = categorySelect.value;
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(transaction => transaction.text === selectedCategory);
    }
    
    return filtered;
}

function updateSummaryCards(transactions) {
    const transactionType = transactionTypeSelect.value;
    const isExpense = transactionType === 'expenses';
    const isIncome = transactionType === 'income';
    
    // Calculate total
    const total = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    totalExpensesElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(total, baseCurrency, defaultCurrency, transactions).toFixed(2)}`;
    totalExpensesElement.className = `stat-value money ${isExpense ? 'money-minus' : 'money-plus'}`;

    // Calculate average daily
    const days = new Set(transactions.map(tx => tx.date)).size;
    const average = days > 0 ? total / days : 0;
    averageDailyElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(average, baseCurrency, defaultCurrency, transactions).toFixed(2)}`;
    averageDailyElement.className = `stat-value money ${isExpense ? 'money-minus' : 'money-plus'}`;

    // Find highest category
    const categoryTotals = {};
    transactions.forEach(tx => {
        categoryTotals[tx.text] = (categoryTotals[tx.text] || 0) + Math.abs(tx.amount);
    });

    const highestCategory = Object.entries(categoryTotals)
        .reduce((max, [category, total]) => total > (max.total || 0) ? {category, total} : max, {});

    highestCategoryElement.textContent = highestCategory.category 
        ? `${highestCategory.category} (${getCurrencySymbol(defaultCurrency)}${convertCurrency(highestCategory.total, baseCurrency, defaultCurrency, transactions).toFixed(2)})` 
        : '-';

    // Calculate savings rate (only for expenses)
    if (isExpense) {
        const income = 50000; // This should come from your actual data
        const savingsRate = ((income - total) / income) * 100;
        savingsRateElement.textContent = `${savingsRate.toFixed(1)}%`;
    } else {
        savingsRateElement.textContent = '-';
    }

    // Update change indicators
    updateChangeIndicators(transactions);
}

function updateChangeIndicators(transactions) {
    // This is a simplified example. In a real application, you would compare with previous period
    const changes = {
        total: 5.2,
        average: -2.1,
        category: 8.3,
        savings: 3.7
    };

    Object.entries(changes).forEach(([type, value]) => {
        const element = document.getElementById(`${type}Change`);
        if (element) {
            const icon = element.querySelector('.change-icon');
            const valueSpan = element.querySelector('.change-value');

            icon.textContent = value >= 0 ? '↑' : '↓';
            icon.className = `change-icon ${value >= 0 ? 'up' : 'down'}`;
            valueSpan.textContent = `${Math.abs(value)}%`;
        }
    });
}

function updateCharts(transactions, period) {
    updateDistributionChart(transactions);
    updateTrendChart(transactions, period);
}

function updateDistributionChart(transactions) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    // Calculate category totals
    const categoryTotals = {};
    transactions.forEach(tx => {
        categoryTotals[tx.text] = (categoryTotals[tx.text] || 0) + Math.abs(tx.amount);
    });

    // Destroy existing chart if it exists
    if (distributionChart) {
        distributionChart.destroy();
    }

    const transactionType = transactionTypeSelect.value;
    const chartTitle = transactionType === 'expenses' ? 'Expense Distribution' : 
                      transactionType === 'income' ? 'Income Distribution' : 
                      'Transaction Distribution';

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6',
                    '#1abc9c'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: chartTitle
                }
            }
        }
    });
}

function updateTrendChart(transactions, period) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Group transactions by date
    const dailyTotals = {};
    transactions.forEach(tx => {
        dailyTotals[tx.date] = (dailyTotals[tx.date] || 0) + Math.abs(tx.amount);
    });

    // Sort dates
    const sortedDates = Object.keys(dailyTotals).sort();

    // Destroy existing chart if it exists
    if (trendChart) {
        trendChart.destroy();
    }

    const transactionType = transactionTypeSelect.value;
    const chartTitle = transactionType === 'expenses' ? 'Daily Expenses Trend' : 
                      transactionType === 'income' ? 'Daily Income Trend' : 
                      'Daily Transaction Trend';

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [{
                label: chartTitle,
                data: sortedDates.map(date => dailyTotals[date]),
                borderColor: transactionType === 'expenses' ? '#e74c3c' : 
                           transactionType === 'income' ? '#2ecc71' : '#3498db',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCategoryBreakdown(transactions) {
    // Calculate category totals
    const categoryTotals = {};
    transactions.forEach(tx => {
        categoryTotals[tx.text] = (categoryTotals[tx.text] || 0) + Math.abs(tx.amount);
    });

    // Clear existing items
    categoryListElement.innerHTML = '';

    // Add new items
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const item = document.createElement('div');
        item.className = 'category-item';
        const transactionType = transactionTypeSelect.value;
        const isExpense = transactionType === 'expenses';
        const isIncome = transactionType === 'income';
        
        item.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-amount ${isExpense ? 'money-minus' : isIncome ? 'money-plus' : ''}">
                ${getCurrencySymbol(defaultCurrency)}${convertCurrency(total, baseCurrency, defaultCurrency, transactions).toFixed(2)}
            </span>
        `;
        categoryListElement.appendChild(item);
    });
}

function updateComparisonChart(period) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    // This is a simplified example. In a real application, you would compare with previous period
    const currentData = [1200, 1500, 1800, 2000, 2200, 2500];
    const previousData = [1000, 1300, 1600, 1900, 2100, 2400];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Destroy existing chart if it exists
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Period',
                    data: currentData,
                    backgroundColor: '#3498db'
                },
                {
                    label: 'Previous Period',
                    data: previousData,
                    backgroundColor: '#95a5a6'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTransactionTable(transactions) {
    expenseTableBody.innerHTML = '';
    
    transactions.forEach(tx => {
        const row = document.createElement('tr');
        const isExpense = tx.amount < 0;
        row.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.text}</td>
            <td>${tx.note || '-'}</td>
            <td class="${isExpense ? 'money-minus' : 'money-plus'}">
                ${getCurrencySymbol(defaultCurrency)}${convertCurrency(Math.abs(tx.amount), baseCurrency, defaultCurrency, transactions).toFixed(2)}
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Helper function to get currency symbol
function getCurrencySymbol(currency) {
    const symbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$',
        'CHF': 'Fr',
        'CNY': '¥'
    };
    return symbols[currency] || currency;
}

// Helper function to convert currency
function convertCurrency(amount, fromCurrency, toCurrency, transactions) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    // Try to get rates from localStorage first
    const savedRates = JSON.parse(localStorage.getItem('exchangeRates'));
    const rates = savedRates || window.exchangeRates || fallbackRates;
    
    // Convert to INR first (base currency)
    const inrAmount = fromCurrency === 'INR' ? amount : amount / rates[fromCurrency];
    
    // Then convert to target currency
    return inrAmount * rates[toCurrency];
} 
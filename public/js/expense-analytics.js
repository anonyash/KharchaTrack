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
const dateRangeSelect = document.getElementById('dateRange');
const customDateRange = document.getElementById('customDateRange');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
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
        expenses = transactions.filter(tx => tx.amount < 0); // Only get expenses
        console.log('Loaded transactions:', expenses);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function setupEventListeners() {
    // Date range select handler
    dateRangeSelect.addEventListener('change', handleDateRangeChange);
    
    // Period buttons handler
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateAnalytics(button.dataset.period);
        });
    });
}

function handleDateRangeChange() {
    if (dateRangeSelect.value === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
    }
}

function updateAnalytics(period) {
    const filteredExpenses = filterExpenses(period);
    updateSummaryCards(filteredExpenses);
    updateCharts(filteredExpenses, period);
    updateCategoryBreakdown(filteredExpenses);
    updateComparisonChart(period);
    updateExpenseTable(filteredExpenses);
}

function filterExpenses(period) {
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

        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= now;
        });
    }
    
    // Filter by category if selected
    if (categorySelect.value !== 'all') {
        filtered = filtered.filter(expense => expense.text === categorySelect.value);
    }
    
    return filtered;
}

function updateSummaryCards(expenses) {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
    totalExpensesElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(total, baseCurrency, defaultCurrency, expenses).toFixed(2)}`;

    // Calculate average daily expenses
    const days = new Set(expenses.map(e => e.date)).size;
    const average = days > 0 ? total / days : 0;
    averageDailyElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(average, baseCurrency, defaultCurrency, expenses).toFixed(2)}`;

    // Find highest category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.text] = (categoryTotals[expense.text] || 0) + Math.abs(expense.amount);
    });

    const highestCategory = Object.entries(categoryTotals)
        .reduce((max, [category, total]) => total > (max.total || 0) ? {category, total} : max, {});

    highestCategoryElement.textContent = highestCategory.category 
        ? `${highestCategory.category} (${getCurrencySymbol(defaultCurrency)}${convertCurrency(highestCategory.total, baseCurrency, defaultCurrency, expenses).toFixed(2)})` 
        : '-';

    // Calculate savings rate (example: assuming income is ₹50000)
    const income = 50000; // This should come from your actual data
    const savingsRate = ((income - total) / income) * 100;
    savingsRateElement.textContent = `${savingsRate.toFixed(1)}%`;

    // Update change indicators
    updateChangeIndicators(expenses);
}

function updateChangeIndicators(expenses) {
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

function updateCharts(expenses, period) {
    updateDistributionChart(expenses);
    updateTrendChart(expenses, period);
}

function updateDistributionChart(expenses) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.text] = (categoryTotals[expense.text] || 0) + Math.abs(expense.amount);
    });

    // Destroy existing chart if it exists
    if (distributionChart) {
        distributionChart.destroy();
    }

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
                }
            }
        }
    });
}

function updateTrendChart(expenses, period) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Group expenses by date
    const dailyTotals = {};
    expenses.forEach(expense => {
        dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + Math.abs(expense.amount);
    });

    // Sort dates
    const sortedDates = Object.keys(dailyTotals).sort();

    // Destroy existing chart if it exists
    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Daily Expenses',
                data: sortedDates.map(date => dailyTotals[date]),
                borderColor: '#3498db',
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

function updateCategoryBreakdown(expenses) {
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.text] = (categoryTotals[expense.text] || 0) + Math.abs(expense.amount);
    });

    // Clear existing items
    categoryListElement.innerHTML = '';

    // Add new items
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-amount">${getCurrencySymbol(defaultCurrency)}${convertCurrency(total, baseCurrency, defaultCurrency, expenses).toFixed(2)}</span>
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

function updateExpenseTable(expenses) {
    expenseTableBody.innerHTML = '';
    
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.text}</td>
            <td>${expense.note || '-'}</td>
            <td>${getCurrencySymbol(defaultCurrency)}${convertCurrency(Math.abs(expense.amount), baseCurrency, defaultCurrency, expenses).toFixed(2)}</td>
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
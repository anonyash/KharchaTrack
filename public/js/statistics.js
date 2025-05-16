// Sample data - In a real application, this would come from your backend/database
let expenses = [
    { date: '2024-03-01', category: 'food', description: 'Groceries', amount: 150.00 },
    { date: '2024-03-02', category: 'transportation', description: 'Gas', amount: 45.00 },
    { date: '2024-03-03', category: 'entertainment', description: 'Movie', amount: 25.00 },
    { date: '2024-03-04', category: 'utilities', description: 'Electricity', amount: 80.00 },
    { date: '2024-03-05', category: 'food', description: 'Restaurant', amount: 60.00 },
    // Add more sample data as needed
];

// Chart instances
let distributionChart;
let trendChart;
let comparisonChart;

// DOM Elements
const periodButtons = document.querySelectorAll('.period-btn');
const totalExpensesElement = document.getElementById('totalExpenses');
const averageDailyElement = document.getElementById('averageDaily');
const highestCategoryElement = document.getElementById('highestCategory');
const savingsRateElement = document.getElementById('savingsRate');
const categoryListElement = document.getElementById('categoryList');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateStatistics('all');
});

function setupEventListeners() {
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update statistics with selected period
            updateStatistics(button.dataset.period);
        });
    });
}

function updateStatistics(period) {
    const filteredExpenses = filterExpensesByPeriod(period);
    updateSummaryCards(filteredExpenses);
    updateCharts(filteredExpenses, period);
    updateCategoryBreakdown(filteredExpenses);
    updateComparisonChart(period);
}

function filterExpensesByPeriod(period) {
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
        case 'all':
            return expenses; // Return all expenses
    }

    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= now;
    });
}

function updateSummaryCards(expenses) {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpensesElement.textContent = `$${total.toFixed(2)}`;

    // Calculate average daily expenses
    const days = new Set(expenses.map(e => e.date)).size;
    const average = days > 0 ? total / days : 0;
    averageDailyElement.textContent = `$${average.toFixed(2)}`;

    // Find highest category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const highestCategory = Object.entries(categoryTotals)
        .reduce((max, [category, total]) => total > (max.total || 0) ? {category, total} : max, {});

    highestCategoryElement.textContent = highestCategory.category 
        ? `${highestCategory.category} ($${highestCategory.total.toFixed(2)})` 
        : '-';

    // Calculate savings rate (example: assuming income is $5000)
    const income = 5000; // This should come from your actual data
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
        const icon = element.querySelector('.change-icon');
        const valueSpan = element.querySelector('.change-value');

        icon.textContent = value >= 0 ? '↑' : '↓';
        icon.className = `change-icon ${value >= 0 ? 'up' : 'down'}`;
        valueSpan.textContent = `${Math.abs(value)}%`;
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
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
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
        dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + expense.amount;
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
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Clear existing items
    categoryListElement.innerHTML = '';

    // Add new items
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span class="category-name">${category}</span>
            <span class="category-amount">$${total.toFixed(2)}</span>
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
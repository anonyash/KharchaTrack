// Sample data - In a real application, this would come from your backend/database
let expenses = [
    { date: '2024-03-01', category: 'food', description: 'Groceries', amount: 150.00 },
    { date: '2024-03-02', category: 'transportation', description: 'Gas', amount: 45.00 },
    { date: '2024-03-03', category: 'entertainment', description: 'Movie', amount: 25.00 },
    { date: '2024-03-04', category: 'utilities', description: 'Electricity', amount: 80.00 },
    { date: '2024-03-05', category: 'food', description: 'Restaurant', amount: 60.00 },
    // Add more sample data as needed
];

// DOM Elements
const dateRangeSelect = document.getElementById('dateRange');
const customDateRange = document.getElementById('customDateRange');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const categorySelect = document.getElementById('category');
const generateReportBtn = document.getElementById('generateReport');
const totalExpensesElement = document.getElementById('totalExpenses');
const averageDailyElement = document.getElementById('averageDaily');
const highestCategoryElement = document.getElementById('highestCategory');
const expenseTableBody = document.getElementById('expenseTableBody');

// Chart instances
let categoryChart;
let trendChart;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    generateReport();
});

function setupEventListeners() {
    dateRangeSelect.addEventListener('change', handleDateRangeChange);
    generateReportBtn.addEventListener('click', generateReport);
}

function handleDateRangeChange() {
    if (dateRangeSelect.value === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
    }
}

function generateReport() {
    const filteredExpenses = filterExpenses();
    updateSummaryCards(filteredExpenses);
    updateCharts(filteredExpenses);
    updateExpenseTable(filteredExpenses);
}

function filterExpenses() {
    let filtered = [...expenses];
    
    // Filter by date range
    const dateRange = dateRangeSelect.value;
    if (dateRange !== 'custom') {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filtered = filtered.filter(expense => new Date(expense.date) >= cutoffDate);
    } else if (startDateInput.value && endDateInput.value) {
        filtered = filtered.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(startDateInput.value) && 
                   expenseDate <= new Date(endDateInput.value);
        });
    }
    
    // Filter by category
    if (categorySelect.value !== 'all') {
        filtered = filtered.filter(expense => expense.category === categorySelect.value);
    }
    
    return filtered;
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
}

function updateCharts(expenses) {
    updateCategoryChart(expenses);
    updateTrendChart(expenses);
}

function updateCategoryChart(expenses) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    // Destroy existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
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
                    position: 'right'
                }
            }
        }
    });
}

function updateTrendChart(expenses) {
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

function updateExpenseTable(expenses) {
    expenseTableBody.innerHTML = '';
    
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
        `;
        expenseTableBody.appendChild(row);
    });
} 
//  (do this only when you're integrating basecurrency changing feature else it's unnecessary) Name all the defaultCurrency variables to displayCurrency and all the current displayCurrency variables to baseCurrency  

// Load saved settings  
document.addEventListener('DOMContentLoaded', async () => {
    console.log("++ DOMContentLoaded event fired ++ (settings.js)");
    // Load currency settings
    const savedCurrency = localStorage.getItem('selectedCurrency') ||  'INR' ;
    document.getElementById('default-currency').value = savedCurrency ||  'INR';
    // document.getElementById('currency-select').value = savedCurrency;
    console.log(savedCurrency)
    updateRates()

    // let defaultCurrencyElement = document.getElementById('default-currency');
    // localStorage.setItem('defaultCurrencyElement', defaultCurrencyElement);

    // Load theme settings
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.getElementById('theme-select').value = savedTheme;

    // Add event listeners
    document.getElementById('save-currency').addEventListener('click', saveCurrencySettings);
    document.getElementById('save-theme').addEventListener('click', saveThemeSettings);
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', importData);
    document.getElementById('clear-data').addEventListener('click', clearData);
    document.getElementById('update-rates-btn').addEventListener('click', updateExchangeRates);
    document.getElementById('default-currency').addEventListener('change', handleCurrencyChange);

    // Initialize exchange rates
    // await window.fetchExchangeRates();
    // await window.updateExchangeRates();
    document.getElementById("date").textContent ="Rates last updated: \n"+ localStorage.getItem('ratesLastUpdated');
});


// loading correct updateRates
function updateRates() {
    let rates1 = JSON.parse(localStorage.getItem('exchangeRates'));
    let rates2 = fallbackRates;
    // console.log('current rates: ', rates1.INR)
    // console.log('current rates: ', rates1)
    console.log('current fallbackrate INR: ', rates2.INR)
    if( rates1 == null){
        console.log('null rates')
        localStorage.setItem('exchangeRates', JSON.stringify(fallbackRates));
        console.log(localStorage.getItem('exchangeRates'))

    }
    if (rates1.INR !== rates2.INR ){
        localStorage.setItem('exchangeRates', JSON.stringify(fallbackRates));
        console.log(localStorage.getItem('exchangeRates'))
    }
}









// Handle currency change
async function handleCurrencyChange() {
    console.log("> handleCurrencyChange() called")
    const currency = document.getElementById('default-currency').value;
    // document.getElementById('currency-select').value = currency;
    console.log('default-currency: ',currency)
    await window.changeCurrency(currency);
}

// Update exchange rates
async function updateExchangeRates() {
    console.log("> updateExchangeRates() called")
    const updateBtn = document.getElementById('update-rates-btn');
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating...';
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR', {cache: "no-store"});
        document.getElementById("date").textContent ="Rates last updated: \n"+ localStorage.getItem('ratesLastUpdated');
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        
        const data = await response.json();
        // Store rates in localStorage
        saveRates(data.rates);
        // Update global rates
        window.exchangeRates = data.rates;
        localStorage.setItem('ratesLastUpdated', new Date().toLocaleString());
        console.log("rates last updated: "+ localStorage.getItem('ratesLastUpdated'));
        document.getElementById("date").textContent ="Rates last updated: \n"+ localStorage.getItem('ratesLastUpdated');
        updateBtn.textContent = 'Rates Updated!';
        setTimeout(() => {
            updateBtn.textContent = 'Update Exchange Rates';
            updateBtn.disabled = false;
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        document.getElementById("date").textContent ="Rates last updated: \n"+ localStorage.getItem('ratesLastUpdated');
        // let lastdate = document.getElementById("date").textContent = document.getElementById("date").textContent;
        document.getElementById("error").textContent =  "Error fetching exchange rates" ;
        setTimeout(() => {
            document.getElementById("error").textContent =  " "
            // document.getElementById("date").textContent = lastdate ;
            }, 2000);
        // Use saved rates if available
        const savedRates = loadRates();
        if (savedRates) {
            window.exchangeRates = savedRates.rates;
            updateBtn.textContent = 'Using Saved Rates';
            setTimeout(() => {
                updateBtn.textContent = 'Update Exchange Rates';
                updateBtn.disabled = false;
            }, 2000);
            return true;
        } else {
            // Use fallback rates if no saved rates
            window.exchangeRates = fallbackRates;
            saveRates(fallbackRates);
            updateBtn.textContent = 'Update Failed';
            setTimeout(() => {
                updateBtn.textContent = 'Update Exchange Rates';
                updateBtn.disabled = false;
            }, 2000);
            return false;
        }
    }
}

// Function to save rates to localStorage
function saveRates(rates) {
    console.log("> saveRates() called")
    console.log(rates)
    localStorage.setItem('exchangeRates', JSON.stringify(rates));
    localStorage.setItem('ratesLastUpdated', new Date().toLocaleString());
}

// Function to load rates from localStorage
function loadRates() {
    console.log("> loadRates() called")
    const storedRates = localStorage.getItem('exchangeRates');
    const lastUpdated = localStorage.getItem('ratesLastUpdated');
    
    if (storedRates && lastUpdated) {
        return {
            rates: JSON.parse(storedRates),
            lastUpdated: parseInt(lastUpdated)
        };
    }
    return null;
}

// Fallback exchange rates (as of a recent date)
let fallbackRates = {
    INR: 1,
    USD: 0.0117,
    EUR: 0.0103,
    GBP: 0.00876,
    JPY: 1.67,
    CAD: 0.0163,
    CHF: 0.00968,
    CNY: 0.0854
};

// Save currency settings
function saveCurrencySettings() {
    console.log("> saveCurrencySettings() called")
    let defaultCurrency = document.getElementById('default-currency').value;
    // let displayCurrency = document.getElementById('currency-select').value;
    // const transactionCurrency = document.getElementById('transaction-currency').value;
    console.log(defaultCurrency)
    localStorage.setItem('selectedCurrency', defaultCurrency);
    localStorage.setItem('defaultCurrency', defaultCurrency);
    // localStorage.setItem('displayCurrency', displayCurrency);
    // localStorage.setItem('transCurrency', transactionCurrency);
    
    alert('Currency settings saved!');
    // document.getElementById('transaction-currency').value = "USD";
}

// Save theme settings
function saveThemeSettings() {
    const theme = document.getElementById('theme-select').value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    alert('Theme settings saved!');
}

// Apply theme
// function applyTheme(theme) {
//     if (theme === 'light') {
//         document.body.style.backgroundColor = '#f5f5f5';
//         document.body.style.color = '#333';
//     } else {
//         document.body.style.backgroundColor = '#191919';
//         document.body.style.color = 'white';
//     }
// }

// Export data
function exportData() {
    console.log("> exportData() called")
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const data = {
        transactions: transactions,
        settings: {
            currency: localStorage.getItem('selectedCurrency'),
            displayCurrency: localStorage.getItem('defaultCurrency'),
            theme: localStorage.getItem('theme'),
            exchangeRates: localStorage.getItem('exchangeRates'),
            ratesLastUpdated: localStorage.getItem('ratesLastUpdated')
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-tracker-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data
function importData() {
    console.log("> importData() called")
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.transactions) {
                    localStorage.setItem('transactions', JSON.stringify(data.transactions));
                }
                
                if (data.settings) {
                    if (data.settings.currency) {
                        localStorage.setItem('selectedCurrency', data.settings.currency);
                    }
                    if (data.settings.displayCurrency) {
                        localStorage.setItem('defaultCurrency', data.settings.displayCurrency);
                    }
                    if (data.settings.theme) {
                        localStorage.setItem('theme', data.settings.theme);
                        applyTheme(data.settings.theme);
                    }
                    if (data.settings.exchangeRates) {
                        localStorage.setItem('exchangeRates', data.settings.exchangeRates);
                    }
                    if (data.settings.ratesLastUpdated) {
                        localStorage.setItem('ratesLastUpdated', data.settings.ratesLastUpdated);
                    }
                }
                
                alert('Data imported successfully!');
                location.reload();
            } catch (error) {
                alert('Error importing data: Invalid file format');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all data
function clearData() {
    console.log("> clearData() called")
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        alert('All data has been cleared.');
        location.reload();
    }
} 
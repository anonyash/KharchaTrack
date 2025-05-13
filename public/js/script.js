//1
// import  Chart  from './node_modules/chart.js/dist/chart.esm.js';
const balance = document.getElementById(
    "balance"
  );
  const money_plus = document.getElementById(
    "money-plus"
  );
  const money_minus = document.getElementById(
    "money-minus"
  );
  const list = document.getElementById("list");
  const list2 = document.getElementById("list2");
  const form = document.getElementById("form");
  let text = {value:""};
  let tdate = document.getElementById('calendar')
  let ttime = document.getElementById('timepicker')
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;

let userId = localStorage.getItem('userId')
console.log('userId: ', userId)
// userdata(userId)
if (!userId){
  console.log("user id is ", userId)
  let logout2 = document.getElementById('logout')
  logout2.id = "logout2"

}else{
  console.log("user id is ", userId)
  let login2 = document.getElementById('login')
  login2.id = "login2"
  
}


// async function userdata(userid){
//   console.log(userid)
//   let id = userid
//   const response = await fetch('http://localhost:3000/api/user-data', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ id: id })
//     // body: JSON.stringify({ fullName, email, password })
// });

// console.log('res: ',response)
// let transactions = await response.json();
// console.log('data: ',transactions)

// if (response.ok) {
//   console.log("response OK")
//   console.log(response)
//   // Store the token
//   let trxns = JSON.stringify(transactions)
//   localStorage.setItem('transactions', trxns)
//   // localStorage.setItem('token', data.token);
//   // localStorage.setItem('userId', data.userId);
//   // Redirect to dashboard or home page
//   // window.location.href = 'index.html';
// } else {
//   alert(data.message || 'failed to load transactions');
// }

// }





  
  //last 
  // localStorage.setItem('selectedCurrency', currentCurrency);
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  console.log(transactions)
  
  let username = localStorage.getItem('aname') ;
  //5
  let cur = "₹" //   "$"    "₹"

  // Currency conversion related variables
   let defaultCurrency = localStorage.getItem('selectedCurrency') || 'INR';
  //  localStorage.setItem('exchangeRates',fallbackRates );
  //  let transactionCurrencySelect = localStorage.getItem('defaultCurrencyElement');
  let baseCurrency = 'INR'; //localStorage.getItem('defaultCurrency') ;  //'INR'; // The currency in which transactions are stored
  let transactionCurrency = document.getElementById('transaction-currency')
  transactionCurrency.value = defaultCurrency;
  let sig2
  let categorytext = document.getElementsByClassName('categorytext')
  let category = document.getElementsByClassName("category")
  const bttn = document.getElementById('accntbtn');
  const menu = document.getElementById('dropdownmenu');
  const logoutbtn = document.getElementById('logout') || document.getElementById('logout2');
  const loginbtn = document.getElementById('login') || document.getElementById('login2');

  console.log('username: ',username)
  console.log(transactions)
  console.log("defaultCurrency: ", defaultCurrency)
  console.log("baseCurrency: " , baseCurrency)
  console.log(text)
  console.log(category)
  console.log(categorytext)
  console.log("category value: " + category[0].value)
  console.log("category value: " + category[1].value)
  console.log( "categorytext: "+ categorytext[0].value )
  console.log( "categorytext: "+ categorytext[1].value )



  // document.getElementById('transaction-currency').value = defaultCurrency;
  
  // console.log("defaultCurrencyElement: ", transactionCurrencySelect)
  // console.log(transactionCurrency)
  // Global chart variables
  // let barChart = null;
  let pieChart = null;
  let labels = [];
  let data = [];
  let color = [];





  let currentDate = new Date();

  function updateMonthDisplay() {
    const options = { month: 'long', year: 'numeric' };
    document.getElementById('currentMonth').textContent = currentDate.toLocaleDateString('en-US', options);
    loadTransactionsForCurrentMonth();
  }
  
  document.getElementById('prevMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthDisplay();
  };
  
  document.getElementById('nextMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();
  };
  
  // function loadTransactionsForCurrentMonth() {
  //   const month = currentDate.getMonth() + 1; // 0-indexed
  //   const year = currentDate.getFullYear();
  
  //   fetch(`http://localhost:3000/api/transaction?month=${month}&year=${year}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       const container = document.getElementById('transactionsContainer');
  //       container.innerHTML = ''; // Clear old data
  //       data.forEach(tx => {
  //         const div = document.createElement('div');
  //         div.textContent = `${tx.date}: ${tx.description} - ₹${tx.amount}`;
  //         container.appendChild(div);
  //       });
  //     });
  // }


  function loadTransactionsForCurrentMonth() {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    // let userid = JSON.stringify(localStorage.getItem('userId'))
  console.log(userId)
    // fetch(`http://localhost:3000/api/transaction?month=${month}&year=${year}`)
    fetch(`http://localhost:3000/api/transaction?month=${String(month).padStart(2, '0')}&year=${year}&user_id=${userId}`)

      .then(res => res.json())
      .then(transactions => {
        const container = document.getElementById('transactionsContainer');
        container.innerHTML = '';
        // const list2 = document.createElement('list2')
  
        const grouped = {};
  
        transactions.forEach(tx => {
          const date = new Date(tx.date);
          const options = { month: 'long', day: '2-digit', weekday: 'long' };
          const key = date.toLocaleDateString('en-US', options);
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(tx);
        });
  
        for (const date in grouped) {
          const section = document.createElement('div');
          section.className = 'date-group';
  
          const heading = document.createElement('h3');
          heading.className = 'date-heading';
          heading.textContent = date;
          section.appendChild(heading);

          const list2 = document.createElement("ul");
          list2.className = "list";
  
          grouped[date].forEach(tx => {
            const row = document.createElement('div');
            row.className = 'tx-row';
  
            const isIncome = tx.amount > 0;
            const formattedAmt = `${isIncome ? '+' : '-'}₹${Math.abs(tx.amount).toFixed(2)}`;

            // let togg = document.getElementById('expen');
            // let tru = togg.checked;
            // let sig = tru? "-" : "+";
            console.log("addTransactionDOM() called ")
            //GET sign
            // const sign = sig;
            const item = document.createElement("li");
            
          
            //Add Class Based on Value
            item.classList.add(
              tx.sig == "-"? "minus" : "plus"
            );
  
            item.innerHTML = `
            ${getIcon(tx.text)}${tx.text} <!--<span id="spandate">${getFormattedDate2(tx.date)}</span>--> <span>${tx.amount < 0 ? '' : '+'}${convertCurrency(tx.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions) % 1 === 0? convertCurrency(tx.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(0) : convertCurrency(tx.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(2)}
    
            </span>
            <button class="delete-btn" onclick="removeTransaction(${tx.id})">x</button>

              <!--<div class="tx-left">
                <div class="tx-icon">${getIcon(tx.text)}</div>
                <div class="tx-info">
                  <div class="tx-title">${tx.text}</div>
                  <div class="tx-account">${tx.currency || 'Cash'}</div>
                </div>
              </div>
              <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
                ${formattedAmt}
              </div> -->
            `;
            
            list2.appendChild(item);
            section.appendChild(list2);
          });
  
          container.appendChild(section);
        }
      });
  }
  
  
  updateMonthDisplay()// Initial load
  










  function getIcon(category) {
    const icons = {
      Petrol: '🚗', Bills: '🧾', Social: '👥', Telephone: '📞',
      Food: '🍴', Transfer: '🔄', Gift: '🎁', Salary: '💼',
      Rent: '🏠', Shopping: '🛍️', 'Dining out': '🍽️'
    };
    return icons[category] || '💸';
  }
  









  // if (userId == null){
  //   localStorage.setItem('transactions', '')
  //   // localStorage.setItem('', '')



  // }





  flatpickr("#calendar", {
    // enableTime:true,
    altInput: true,
    altFormat:" F d, Y",
    dateFormat: "Y-m-d",
    defaultDate: "today",
    onChange: function(selectedDates, dateStr, event) {
        console.log("change detected");
        if(!dateStr){
            console.log("empty value detected! loading current date.");
            const today = new Date();
            event.setDate(today, true);
        }else{
        
        console.log("what machine sees:", dateStr);
        console.log("what you see:", event.altInput.value);
        console.log("raw date string: ",selectedDates)
        console.log(event)
        console.log(`input formatted date(${dateStr}): `,getFormattedDate(dateStr)); 
        }
    }
});


flatpickr("#timepicker", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: false, // set to true for 24-hour format
  defaultDate: new Date(),
  onChange: function(selectedDates, timeStr, instance) {
    if (!timeStr) {
      const now = new Date();
      instance.setDate(now, true);
      console.log("Time reset to now:", instance.input.value);
    } else {
      console.log("Selected time:", instance.input.value);
    }
  }
});



function getFormattedDate(inputDate = new Date()) {
  console.log("> getFormattedDate() called")
  let date = new Date(inputDate); // ensures it's a Date object
  console.log('date: ' ,date)
  let month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  let day = String(date.getDate()).padStart(2, '0');
  let year = date.getFullYear();
  let weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);

  return ` ${weekday} ${month} ${day}, ${year}`;
}


function getFormattedDate2(inputDate = new Date()) {
  console.log("> getFormattedDate() called")
  let date = new Date(inputDate); // ensures it's a Date object
  console.log('date: ' ,date)
  let month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  let day = String(date.getDate()).padStart(2, '0');
  let year = date.getFullYear();
  let weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);

  return `  ${month} ${day},${weekday}`;
}




function Logout(){
  console.log("logging out")
  localStorage.removeItem('userId');
  localStorage.removeItem('transactions');
  localStorage.removeItem('aname');
  // localStorage.removeItem('ratesLastUpdated');
  localStorage.removeItem('token');
  localStorage.removeItem('defaultCurrency');
  

  location.reload()
}

loginbtn.addEventListener('click', () => {
  window.location.href = '/login.html';
  // Login()
  // e.stopPropagation();
  // menu.style.display = menu.style.display === "block"? "none":"block";
});


logoutbtn.addEventListener('click', () => {
  Logout()
  // e.stopPropagation();
  // menu.style.display = menu.style.display === "block"? "none":"block";
});

bttn.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.style.display = menu.style.display === "block"? "none":"block";
});

document.addEventListener('click', () => {
  menu.style.display="none";
});






  //Add Transaction
  async function addTransaction(e){
    e.preventDefault();

    console.log("--------------------------------------------------");
    console.log("---------------NEW TRANSACTION--------------------");
    console.log("--------------------------------------------------");
    console.log("> addTransaction() called");
    console.log(e)
    console.log(e.target[3].value)
    console.log(e.target[1].value)
    console.log(amount.value)
    document.getElementById('expen').checked? text.value = e.target[3].value:text.value = e.target[1].value ;
    
    // Add account validation
    const selectedAccountId = accountSelect.value;
    if (!selectedAccountId) {
        alert('Please select an account');
        return;
    }

    if(text.value.trim() === '' || amount.value.trim() === ''){
        console.log("   Validation failed: empty fields");
        alert('please add category and amount')
    }else if(amount.value < 0){ 
        console.log("   Validation failed: negative amount");
        alert('please enter a valid amount') 
    }else{
        let togg = document.getElementById('expen');
        let sig = togg.checked? "-" : "+";
        
        let transactionCurrency = document.getElementById('transaction-currency').value;
        console.log("   Transaction currency:", transactionCurrency, "currentCurrency: ",defaultCurrency );

        const inputAmount = parseFloat(amount.value);
        const amountInBaseCurrency = window.convertCurrency(inputAmount, transactionCurrency, baseCurrency,transactions.transaction,transactions,sig);
        console.log("amountInBaseCurrency: " ,amountInBaseCurrency)

        if(transactionCurrency != defaultCurrency){
            const inputAmount = parseFloat(amount.value);
            const amountInBaseCurrency = window.convertCurrency(inputAmount, transactionCurrency, defaultCurrency,transactions.transaction,transactions,sig).toFixed(2);
            console.log("   Converted amount:", amountInBaseCurrency);
        }else{
            const inputAmount = parseFloat(amount.value);
            const amountInBaseCurrency = window.convertCurrency(inputAmount, transactionCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(2);
            console.log(" nothing converted. amount:", amountInBaseCurrency);
        }

        if(sig == "-"){
            const transaction = {
                id: generateID(),
                user_id: userId,
                account_id: selectedAccountId,
                amount: -amountInBaseCurrency,
                sig: "-",
                currency: transactionCurrency,
                text: text.value,
                note: "",
                date: tdate.value,
                time: ttime.value
            }
            console.log("   Adding expense transaction:", transaction);
            try{
                const response = await fetch('http://localhost:3000/api/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaction)
                });
                if (!response.ok) throw new Error('Failed to add transaction');
                const data = await response.json();
                console.log('data: ',data);
                
                // Update account balance
                const accountResponse = await fetch(`http://localhost:3000/api/accounts/${selectedAccountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        balance: -amountInBaseCurrency,
                        updateType: 'add'
                    })
                });
                if (!accountResponse.ok) throw new Error('Failed to update account balance');

            }catch (error) {
                console.error("Error in transaction:", error);
            }
            transactions.push(transaction);
            addTransactionDOM(transaction);
        } else {
            const transaction = {
                id: generateID(),
                user_id: userId,
                account_id: selectedAccountId,
                amount: +amountInBaseCurrency,
                sig: "+",
                currency: transactionCurrency,
                text: text.value,
                note: "",
                date: tdate.value,
                time: ttime.value
            }
            console.log("   Adding income transaction:", transaction);
            try{
                const response = await fetch('http://localhost:3000/api/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaction)
                });
                if (!response.ok) throw new Error('Failed to add transaction');
                const data = await response.json();
                console.log('data: ',data);
                
                // Update account balance
                const accountResponse = await fetch(`http://localhost:3000/api/accounts/${selectedAccountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        balance: amountInBaseCurrency,
                        updateType: 'add'
                    })
                });
                if (!accountResponse.ok) throw new Error('Failed to update account balance');

            }catch (error) {
                console.error("Error in transaction:", error);
            }
            transactions.push(transaction);
            addTransactionDOM(transaction);
        }
        
        await updateBalanceDisplay();
        updateValues();
        updateLocalStorage();
        
        // Update chart data
        updateChartData();
        
        text.value='';
        amount.value='';
        toggl()
        console.log("   addTransaction completed");
        location.reload()
    }
}




  //Update the balance income and expence
  async function updateValues() {
    console.log(">updateValues() called");
    try {
        const response = await fetch(`http://localhost:3000/api/account-summary?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch account summary');
        
        const summary = await response.json();
        
        // Update balance display
        const balanceElement = document.getElementById('balance');
        const incomeElement = document.getElementById('money-plus');
        const expenseElement = document.getElementById('money-minus');
        
        if (balanceElement) {
            balanceElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }
        
        if (incomeElement) {
            incomeElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }
        
        if (expenseElement) {
            expenseElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }

        chartinit();
        updateChartData();
        console.log("       updateValues() done");
    } catch (error) {
        console.error('Error updating values:', error);
    }
}



  //##########################_______chart and data visualisation___________#########################
  // const labels = [];
  // const data = [];

  // const barChartCtx = document.getElementById('barChart').getContext('2d');
  // const pieChartCtx = document.getElementById('pieChart').getContext('2d');

  // const barChart = new Chart(barChartCtx, {
  //     type: 'bar',
  //     data: { labels, datasets: [{ label: 'Values', data, backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'] }] },
  // });

  // const pieChart = new Chart(pieChartCtx, {
  //     type: 'pie',
  //     data: { labels, datasets: [{ data, backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'] }] },
  // });

  // function addData() {
  //     const label = document.getElementById("text").value;
  //     const value = document.getElementById("amount").value;

  //     if (label && value) {
  //         labels.push(label);
  //         data.push(Number(value));
  //         barChart.update();
  //         pieChart.update();
  //         console.log("chart updated")

  //         // document.getElementById('labelInput').value = '';
  //         // document.getElementById('valueInput').value = '';
  //     }
  // }


// Initialize charts
function chartinit(){
  let togg = document.getElementById('expen');
    let tru = togg.checked;
    let sig = tru? "-" : "+";
  console.log(">chartinit() called: Initializing charts...");
  let sign3 = sig[0] == "+"? 1 : 0 ;  
  // Initialize chart data arrays
  labels = [];
  data = [];
  console.log("   Initial chart data arrays:", { labels, data });
 
  // const barChartCtx = document.getElementById('barChart');
  const pieChartCtx = document.getElementById('pieChart');
  
  if ( !pieChartCtx) {//!barChartCtx ||
      console.error("   Chart canvas elements not found!");
      return;
  }
  
  console.log("   Chart contexts found:", { pieChartCtx });// barChartCtx,
 
  try {
      // Initialize bar chart
      // barChart = new Chart(barChartCtx.getContext('2d'), {
      //     type: 'bar',
      //     data: { 
      //         labels: labels, 
      //         datasets: [{ 
      //             label: 'Values', 
      //             data: data, 
      //             backgroundColor:  ['rgb(32, 198, 96)','rgb(89, 53, 219)','rgb(198, 93, 32)','rgb(179, 198, 32)','rgb(198, 32, 123)' ]   //add shades of green and blue
      //         }] 
      //     },
      //     options: {
      //         responsive: true,
      //         scales: {
      //             y: {
      //                 beginAtZero: true
      //             }
      //         }
      //     }
      // });
      // console.log("   Bar chart initialized:", barChart);
 
      // Initialize pie chart
      pieChart = new Chart(pieChartCtx.getContext('2d'), {
          type: 'pie',
          data: { 
              labels: labels, 
              datasets: [{ 
                  data: data, 
                  
                  backgroundColor:  ['rgb(32, 198, 96)','rgb(89, 53, 219)','rgb(198, 93, 32)','rgb(179, 198, 32)','rgb(198, 32, 123)' ]  //add shades of green and blue
              }]
          },
          options: {
              responsive: true
          }
      });
      console.log("   Pie chart initialized:", pieChart);
  } catch (error) {
      console.error("   Error initializing charts:", error);
  }
 
 
 
   }


// Function to update chart data
function updateChartData() {
  console.log(">updateChartData() called");
  console.log("   Current transactions:", transactions);
  
  // Clear existing data
  labels.length = 0;
  data.length = 0;

  console.log("   Cleared chart data arrays");

  // Group transactions by category and sum amounts
  const categoryTotals = {};
  transactions.forEach(transaction => {
      console.log("   Processing transaction:", transaction);
      const convertedAmount = window.convertCurrency( Math.abs( transaction.amount), baseCurrency, defaultCurrency,transaction,transactions, transaction.sig);
      console.log("   Converted amount:", convertedAmount);
      
      if (!categoryTotals[transaction.text]) {
          categoryTotals[transaction.text] = 0;
      }
      categoryTotals[transaction.text] += convertedAmount;
  });

  console.log("   Category totals:", categoryTotals);

  // Add data to chart arrays
  Object.entries(categoryTotals).forEach(([category, total]) => {
      console.log("   Adding to chart:", { category, total });
      labels.push(category);
      data.push(total);
      // color.push(backgroundColor);
  });

  console.log("   Final chart data:", { labels, data });
  
  // Update charts if they exist
  if ( pieChart) { //barChart &&
      console.log("   Updating charts with new data");
      
      try {
          // Update bar chart
          // barChart.data.labels = labels;
          // barChart.data.datasets[0].data = data;
          // barChart.update();
          
          // Update pie chart
          pieChart.data.labels = labels;
          pieChart.data.datasets[0].data = data;
          // pieChart.data.color = color;
          pieChart.update();
          
          console.log("   Charts updated successfully");
      } catch (error) {
          console.error("   Error updating charts:", error);
      }
  } else {
      console.error("   Charts not initialized properly");
  }
  
  console.log("   updateChartData completed");
}

  // Function to get currency symbol
  function getCurrencySymbol(currency) {
    console.log(">getCurrencySymbol() called with:", currency);
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
    const symbol = symbols[currency] || currency;
    console.log("   Returning symbol:", symbol);
    return symbol;
}

  // Function to convert currency
  function convertCurrency(amount, fromCurrency, toCurrency, transaction, transactions,sig) {
    console.log(">convertCurrency() called with:", { amount, fromCurrency, toCurrency, transaction,transactions,sig });
    if (fromCurrency === toCurrency) {
        console.log("   Same currency, returning original amount");
        return amount;
    }
    
    // Try to get rates from localStorage first
    const savedRates = JSON.parse(localStorage.getItem('exchangeRates'));
    const rates = savedRates || window.exchangeRates || fallbackRates;
    console.log("   Using rates:", rates);
    
    // Convert to INR first (base currency)
    const inrAmount = fromCurrency == 'INR'? amount : amount / rates[fromCurrency];
    console.log("   transaction sign:",sig)
    console.log("converted Amount: ",inrAmount)
    // Then convert to target currency
    const result =  inrAmount  * rates[toCurrency];
    console.log("   Conversion result:", result);
    return result;
  }


//shows list of transactions
function updTransactionDOM(transaction) {
  console.log("updTransactionDOM() called");
  
  //GET sign
  let sign2 = sig2[0];
  const item = document.createElement("li");
  const list = document.getElementById('list')

  //Add Class Based on Value
  item.classList.add(
    sig2[0] =="-"? "minus" : "plus")
  console.log("classlist", item.classList)
  console.log("Before shifting", sig2[0]);
  item.innerHTML = `
    ${transaction.text} <span id="spandate">${getFormattedDate(transaction.date)}</span> <span>${transaction.amount < 0 ? '' : '+'}${convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions) % 1 === 0? convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(0) : convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(2)}
    
    </span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    // ${Math.abs(transaction.amount)}
  list.appendChild(item);
  sig2.shift();
  console.log("after shifting", sig2[0]);
}
  
  // Initialize currency converter
  document.addEventListener('DOMContentLoaded', async () => {
    console.log("++ DOMContentLoaded event fired  ++ (script.js)");
    // let currencySelect = document.getElementById("default-currency")  // localStorage.getItem('defaultCurrency'); //document.getElementById('currency-select'); //
    let transactionCurrencySelect = document.getElementById('transaction-currency').value || 'INR'// localStorage.getItem('defaultCurrencyElement'); //('transaction-currency');
    // let transactionCurrency = document.getElementById('transaction-currency')
    // Set initial currency in dropdowns to INR
    // currencySelect.value = 'INR';
    // transactionCurrencySelect =currencySelect.value ;
    // console.log("currencySelect.value ",currencySelect)
    // transactionCurrencySelect = currencySelect;
    console.log("transactionCurrencySelect.value ",transactionCurrencySelect)
    
    
  // init chart
    chartinit()


    


    // Add event listener for currency change
    // currencySelect.addEventListener('change', async () => {
    //     console.log("Currency changed, updating charts...");
    //     await changeCurrency(currencySelect);
    //     updateChartData();
    // });

    // Initialize exchange rates on page load
    const savedRates = JSON.parse(localStorage.getItem('exchangeRates'));
    if (savedRates) {
        console.log("Using saved exchange rates:", savedRates);
        window.exchangeRates = savedRates;
    } else {
        console.log("No saved rates found, attempting to fetch new ones");
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched new exchange rates:", data.rates);
                window.exchangeRates = data.rates;
                localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
                localStorage.setItem('ratesLastUpdated', Date.now());
            } else {
                console.log("API fetch failed, using fallback rates");
                window.exchangeRates = fallbackRates;
                localStorage.setItem('exchangeRates', JSON.stringify(fallbackRates));
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            console.log("Using fallback rates due to error");
            window.exchangeRates = fallbackRates;
            localStorage.setItem('exchangeRates', JSON.stringify(fallbackRates));
        }
    }
    
    // Initial currency setup
    console.log("Performing initial currency setup");
    updateAllAmounts();
    updateChartData();
  });

  // Function to update all displayed amounts
  function updateAllAmounts() {
    console.log("updateAllAmounts() called");
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);
    let sig2 = transactions.map((transaction) => transaction.sig);

    console.log("Calculated amounts:", { total, income, expense });

    // Convert amounts to current currency
    const convertedTotal = window.convertCurrency(total, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2);
    const convertedIncome = window.convertCurrency(income, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2);
    const convertedExpense = window.convertCurrency(expense, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2);

    console.log("Converted amounts:", { convertedTotal, convertedIncome, convertedExpense });

    balance.innerText = `${getCurrencySymbol(defaultCurrency)}${convertedTotal % 1 === 0? convertedTotal.toFixed(0):convertedTotal.toFixed(2) }`;
    money_plus.innerText = `${getCurrencySymbol(defaultCurrency)}${convertedIncome % 1 === 0? convertedIncome.toFixed(0):convertedIncome.toFixed(2)}`;
    money_minus.innerText = `${getCurrencySymbol(defaultCurrency)}${convertedExpense % 1 === 0? convertedExpense.toFixed(0):convertedExpense.toFixed(2)}`;

    // Update transaction list
    list.innerHTML = '';
    transactions.forEach(transaction => {
        const convertedAmount = window.convertCurrency(Math.abs(transaction.amount), baseCurrency, defaultCurrency,transactions.transaction,transactions);
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `
            ${transaction.text} <span id="spandate">${getFormattedDate(transaction.date)} </span><span>${transaction.amount < 0 ? '-' : '+'}${convertedAmount % 1 === 0? convertedAmount.toFixed(0):convertedAmount.toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        list.appendChild(item);
    });
    console.log("updateAllAmounts completed");
}



 
// Function to change currency globally
  async function changeCurrency(newCurrency) {
    console.log("changeCurrency() called with:", newCurrency);
    if (newCurrency !== defaultCurrency) {
      defaultCurrency = newCurrency;
      let transactionCurrency = document.getElementById('transaction-currency')
      transactionCurrency.value = newCurrency;
      localStorage.setItem('defaultCurrency', defaultCurrency);
      console.log("Currency changed to:", defaultCurrency);
      updateAllAmounts();
      updateChartData();
    } else {
      console.log("Currency unchanged");
    }
  }


  //5.5
  //Generate Random ID
  function generateID(){
    console.log("generateID() called");
    const id = Math.floor(Math.random()*1000000000);
    console.log("Generated ID:", id);
    return id;
  }
  
  //2

  function toggl(){
  console.log("> toggl() called")

  text.value ="";
  let exp = document.getElementById('expen');
  let inc = document.getElementById('incom');
  console.log(exp.checked);
  category[0].value = "1";
  category[1].value = "1";
  categorytext[0].value = "";
  categorytext[1].value = "";
  categorytext[0].disabled = false ;
  categorytext[1].disabled = false ;

  // exp.checked? category[0].value = "1":category[1].value = "1";
  // exp.checked? categorytext[0].value = "":categorytext[1].value = "";
  // exp.checked? categorytext[0].disabled = false :categorytext[1].disabled = false ;
  console.log(text)
  // categorytext[0].value
  }


    // let sig = tru? "-" : "+";
  //Add Trasactions to DOM list
  function addTransactionDOM(transaction) {
    let togg = document.getElementById('expen');
    let tru = togg.checked;
    let sig = tru? "-" : "+";
    console.log("addTransactionDOM() called ")
    //GET sign
    const sign = sig;
    const item = document.createElement("li");
    const list = document.getElementById('list')
  
    //Add Class Based on Value
    item.classList.add(
      togg.checked? "minus" : "plus"
    );
  
    // Convert amount to current display currency
    const displayAmount = window.convertCurrency(Math.abs(transaction.amount), baseCurrency, defaultCurrency,transactions.transaction,transactions,sig);
  console.log("adding amount to history ", getCurrencySymbol(defaultCurrency))
    item.innerHTML = `
      ${transaction.text} <span id="spandate">${ getFormattedDate(transaction.date)}</span> <span>${transaction.sig}${displayAmount % 1 === 0? displayAmount.toFixed(0):displayAmount.toFixed(2)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
  }
  
  //4
  
  
  
  //6 
  
  //Remove Transaction by ID
  // function removeTransaction(id){
  //   console.log("removeTransaction() called with ID:", id);
  //   transactions = transactions.filter(transaction => transaction.id !== id);
  //   console.log("Remaining transactions:", transactions);
  //   updateLocalStorage();
  //   Init();
  //   console.log("removeTransaction completed");
  // }
  async function removeTransaction(id) {
    console.log("removeTransaction() called with ID:", id);
  
    try {
      const response = await fetch(`http://localhost:3000/api/transaction/${id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        await updateBalanceDisplay();
        Init();
        console.log("Transaction deleted from backend and frontend.");
        location.reload()
      } else {
        console.error("Failed to delete from backend");
        alert("Error deleting transaction from server.");
      }
    } catch (err) {
      console.error("Network error during deletion:", err);
      alert("Could not connect to backend.");
    }
  }
  




  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    console.log("updateLocalStorage() called");
    localStorage.setItem('transactions',JSON.stringify(transactions));
    console.log("Transactions saved to localStorage");
  }
  

  //  let text = document.getElementById('text')
  //  let category = document.getElementById("category")
  

   
  //  console.log(category.value)
  
  //  console.log("category value: " + category.value)
  //  console.log( "text: "+ text.value )

category[0].addEventListener( 'change' , function(event){ 
    console.log( event);
    CategoryText(category[0],category[0],categorytext[0],event);                        
})


category[1].addEventListener( 'change' , function(event){ 
    console.log( event);
    CategoryText(category[1],category[1],categorytext[1],event);                        
})

function CategoryText(ncat,option,tcat,event){
  console.log('> CategoryText() called')
  console.log(text)
  // console.log(ncat[0].value.label)
  ncat.value = event.target.value;
  console.log("category: "+ncat.value)


  if (option.value == '1'){
      tcat.value = "";
      text.value = tcat.value;
      console.log("Enter custom category...")
      tcat.disabled = false;
  }else{
      tcat.value = ncat.value;
      text.value = ncat.value;
      console.log("selected option: "+ tcat.value)
      // console.log("label: ", ncat.value.label)
      tcat.disabled = true;
      console.log(text)
      console.log(ncat.value)
  }
}


// function CategoryText(option,event){
//        category.value = event.target.value;
//        console.log("category: "+category.value)
       
//        if (option.value == '1'){
//            text.value = "";
//            console.log("Enter custom category...")
//            text.disabled = false;
//        }else{
//            text.value = category.value;
//            console.log("selected option: "+ text.value)
//            console.log("label: ", category.value.label)
//            text.disabled = true;
//        }
// }


  //3
  
  //Init App
  function Init() {
    console.log(">Init() called");
    list.innerHTML = "";
    fetchAccounts().then(() => {
        updateLocalStorage(); // Update localStorage after fetching accounts
        updateBalanceDisplay();
        updateValues();
        transactions.forEach(updTransactionDOM);
    });
  }

 

// Add account selection variables
let accountSelect = document.getElementById('account-select');
let accounts = [];

// Function to fetch and populate accounts
async function fetchAccounts() {
    try {
        const response = await fetch(`http://localhost:3000/api/accounts?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        
        accounts = await response.json();
        populateAccountSelect();
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

// Function to format currency
function formatCurrency(amount) {
    const symbol = getCurrencySymbol(defaultCurrency);
    const formattedAmount = Math.abs(amount).toFixed(2);
    return `${symbol}${formattedAmount}`;
}

// Function to populate account select dropdown
function populateAccountSelect() {
    accountSelect.innerHTML = '<option value="">Select an account</option>';
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.name} (${formatCurrency(account.balance)})`;
        accountSelect.appendChild(option);
    });
}


Init();
  
form.addEventListener('submit',addTransaction);

// Function to update balance display
async function updateBalanceDisplay() {
    try {
        const response = await fetch(`http://localhost:3000/api/account-summary?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch account summary');
        
        const summary = await response.json();
        
        // Update balance display
        const balanceElement = document.getElementById('balance');
        const incomeElement = document.getElementById('money-plus');
        const expenseElement = document.getElementById('money-minus');
        
        if (balanceElement) {
            balanceElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalBalance, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }
        
        if (incomeElement) {
            incomeElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalIncome, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }
        
        if (expenseElement) {
            expenseElement.textContent = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions) % 1 === 0 ? 
                convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(0) : 
                convertCurrency(summary.totalExpenses, baseCurrency, defaultCurrency, transactions.transaction, transactions).toFixed(2)}`;
        }
    } catch (error) {
        console.error('Error updating balance display:', error);
    }
}
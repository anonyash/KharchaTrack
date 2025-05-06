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
  const form = document.getElementById("form");
  let text = {value:""};
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  // localStorage.setItem('selectedCurrency', currentCurrency);
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
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






  //Add Transaction
  function addTransaction(e){
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
    if(text.value.trim() === '' || amount.value.trim() === ''){
      console.log("   Validation failed: empty fields");
      alert('please add category and amount')
    }else if(amount.value < 0){ 
      console.log("   Validation failed: negative amount");
      alert('please enter a valid amount') 
    }else{
      let togg = document.getElementById('expen');
      let sig = togg.checked? "-" : "+";
      
      // Get the selected transaction currency
      let transactionCurrency = document.getElementById('transaction-currency').value;
      console.log("   Transaction currency:", transactionCurrency, "currentCurrency: ",defaultCurrency );

      // Convert the input amount from transaction currency to base currency (INR)
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
          id:generateID(),
          text:text.value,
          amount: -amountInBaseCurrency,
          sig:"-",
          currency: transactionCurrency
        }
        console.log("   Adding expense transaction:", transaction);
        transactions.push(transaction);
        addTransactionDOM(transaction);
      } else {
        const transaction = {
          id:generateID(),
          text:text.value,
          amount: +amountInBaseCurrency,
          sig:"+",
          currency: transactionCurrency
        }
        console.log("   Adding income transaction:", transaction);
        transactions.push(transaction);
        addTransactionDOM(transaction);
      }
        
      updateValues();
      updateLocalStorage();
      
      // Update chart data
      updateChartData();
      
      text.value='';
      amount.value='';
      toggl()
      console.log("   addTransaction completed");
    }
  }




  //Update the balance income and expence
  function updateValues() {
    console.log(">updateValues() called");
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      ;
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      ;
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1);
    sig2 = transactions.map(
        (transaction) => transaction.sig
    );
      // transactions.forEach(updTransactionDOM);
      chartinit()
      updateChartData()
      console.log("sig2: ",sig2)
      console.log(expense)
      console.log(defaultCurrency)
      balance.innerText=`${getCurrencySymbol(defaultCurrency)}${convertCurrency(total, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2) % 1 === 0? convertCurrency(total, baseCurrency, defaultCurrency).toFixed(0) : convertCurrency(total, baseCurrency, defaultCurrency).toFixed(2)}`;
      money_plus.innerText = `${getCurrencySymbol(defaultCurrency)}${ convertCurrency( income, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2 ) %1===0?  convertCurrency( income, baseCurrency, defaultCurrency).toFixed(0) :  convertCurrency( income, baseCurrency, defaultCurrency ).toFixed(2)}`; //, baseCurrency, currentCurrency, transactions
      money_minus.innerText = `${getCurrencySymbol(defaultCurrency)}${convertCurrency(expense, baseCurrency, defaultCurrency,transactions.transaction,transactions,sig2)%1===0?  convertCurrency( expense, baseCurrency, defaultCurrency).toFixed(0) :  convertCurrency( expense, baseCurrency, defaultCurrency).toFixed(2)}`;
      console.log("       updateValues() done")
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

  //Add Class Based on Value
  item.classList.add(
    sig2[0] =="-"? "minus" : "plus")
  console.log("classlist", item.classList)
  console.log("Before shifting", sig2[0]);
  item.innerHTML = `
    ${transaction.text} <span>${transaction.amount < 0 ? '' : '+'}${convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions) % 1 === 0? convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(0) : convertCurrency(transaction.amount, baseCurrency, defaultCurrency,transactions.transaction,transactions).toFixed(2)}
    
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
            ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'}${convertedAmount % 1 === 0? convertedAmount.toFixed(0):convertedAmount.toFixed(2)}</span>
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
  
    //Add Class Based on Value
    item.classList.add(
      togg.checked? "minus" : "plus"
    );
  
    // Convert amount to current display currency
    const displayAmount = window.convertCurrency(Math.abs(transaction.amount), baseCurrency, defaultCurrency,transactions.transaction,transactions,sig);
  console.log("adding amount to history ", getCurrencySymbol(defaultCurrency))
    item.innerHTML = `
      ${transaction.text} <span>${transaction.sig}${displayAmount % 1 === 0? displayAmount.toFixed(0):displayAmount.toFixed(2)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
  }
  
  //4
  
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    console.log("removeTransaction() called with ID:", id);
    transactions = transactions.filter(transaction => transaction.id !== id);
    console.log("Remaining transactions:", transactions);
    updateLocalStorage();
    Init();
    console.log("removeTransaction completed");
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
    // transactions.forEach(updTransactionDOM);
    updateValues();
    transactions.forEach(updTransactionDOM);
    
  }

  Init();
  
  form.addEventListener('submit',addTransaction);
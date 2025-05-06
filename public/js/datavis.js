// import { useState } from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// export default function ChartComponent() {
//   const [data, setData] = useState([]);
//   const [labels, setLabels] = useState([]);
//   const [inputLabel, setInputLabel] = useState("");
//   const [inputValue, setInputValue] = useState("");

//   const handleAddData = () => {
//     if (inputLabel && inputValue) {
//       setLabels([...labels, inputLabel]);
//       setData([...data, Number(inputValue)]);
//       setInputLabel("");
//       setInputValue("");
//     }
//   };

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Values",
//         data,
//         backgroundColor: ["red", "blue", "green", "yellow", "purple"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h2 className="text-xl font-bold mb-4">Dynamic Charts</h2>
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Label"
//           value={inputLabel}
//           onChange={(e) => setInputLabel(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="number"
//           placeholder="Value"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           className="border p-2"
//         />
//         <button onClick={handleAddData} className="bg-blue-500 text-white p-2">Add</button>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
//           <Bar data={chartData} />
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
//           <Pie data={chartData} />
//         </div>
//       </div>
//     </div>
//   );
// }



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
        //     const label = document.getElementById('labelInput').value;
        //     const value = document.getElementById('valueInput').value;

        //     if (label && value) {
        //         labels.push(label);
        //         data.push(Number(value));
        //         barChart.update();
        //         pieChart.update();

        //         document.getElementById('labelInput').value = '';
        //         document.getElementById('valueInput').value = '';
        //     }
        // }
    
//1
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
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
  //5
  let cur = "$" //"₹"
 



  
  //Add Transaction
  function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === ''){
      alert('please add category and amount')
    }else if(amount.value < 0){ alert('please enter a valid amount') }else{
      let togg = document.getElementById('expen');
      let sig = togg.checked? "-" : "+";
      if(sig == "-"){
        const transaction = {
          id:generateID(),
          text:text.value,
          amount: -amount.value,
          sig:"-"
        }
        console.log(`tran: ${transaction}`)
        transactions.push(transaction);
        addTransactionDOM(transaction);}else{
        const transaction = {
          id:generateID(),
          text:text.value,
          amount: +amount.value,
          sig:"+"
        }
        transactions.push(transaction);
        addTransactionDOM(transaction);
      }
        
      updateValues();
      updateLocalStorage();
      text.value='';
      amount.value='';
    }
  }
  
  
  //5.5
  //Generate Random ID
  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  
  //2
  
  
  function toggl(){
  let togg = document.getElementById('expen');
  console.log(togg.checked);
  }

  let sig2

  function updTransactionDOM(transaction) {
    
    //GET sign
    let sign2 = sig2[0];
    const item = document.createElement("li");
  
    //Add Class Based on Value
    item.classList.add(
      sig2[0] =="-"? "minus" : "plus"
    );
    console.log( item.classList)
    item.innerHTML = `
      ${transaction.text} <span>${sign2}${Math.abs(
      transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
    sig2.shift();
  }




  
  //##########################_______chart and data visualisation___________#########################
  const labels = [];
  const data = [];

  const barChartCtx = document.getElementById('barChart').getContext('2d');
  const pieChartCtx = document.getElementById('pieChart').getContext('2d');

  const barChart = new Chart(barChartCtx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Values', data, backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'] }] },
  });

  const pieChart = new Chart(pieChartCtx, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'] }] },
  });

  function addData() {
    const label = document.getElementById('labelInput').value;
    const value = document.getElementById('valueInput').value;

      if (label && value) {
          labels.push(label);
          data.push(Number(value));
          barChart.update();
          pieChart.update();
          console.log("chart updated")

          document.getElementById('labelInput').value = '';
          document.getElementById('valueInput').value = '';
      }
  }
















  let togg = document.getElementById('expen');
  let tru = togg.checked
  let sig = tru? "-" : "+";
  //Add Trasactions to DOM list
  function addTransactionDOM(transaction) {
    
    //GET sign
    const sign = sig;
    const item = document.createElement("li");
  
    //Add Class Based on Value
    item.classList.add(
      togg.checked? "minus" : "plus"
    );
  
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(
      transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
  }
  
  //4
  
  //Update the balance income and expence
  function updateValues() {
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);
    sig2 = transactions.map(
        (transaction) => transaction.sig
    );

      console.log(sig2)
      console.log(expense)
      balance.innerText=`${cur}${total}`;
      money_plus.innerText = `${cur}${income}`;
      money_minus.innerText = `${cur}${expense}`;
  }
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
  }
  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }
  
  //3
  
  //Init App
  function Init() {
    list.innerHTML = "";
    updateValues();
    transactions.forEach(updTransactionDOM);
    
    
  }
  
  Init();
  
  form.addEventListener('submit',addTransaction);

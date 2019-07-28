// Fetch Rates - Base: EUR

function getAPIRates() {

  fetch("https://api.exchangeratesapi.io/latest")
 
    .then(response => response.json())

    .then(data => {
      let rates = Object.keys(data.rates).sort(); 

      sessionStorage.getItem("key", "rates");
      var date = new Date();
        let currentTime = date.getTime();
        console.log(currentTime);
        sessionStorage.setItem("timestamp", currentTime);

      let from = document.getElementById("from");
      let to = document.getElementById("to");

      from += `<option value="${data.base}">${data.base}</option>`;

      to += `<option value="${data.base}">${data.base}</option>`;

      // Fill the lists
      for (let i = 0; i <= rates.length - 1; i++) {
        from += `<option value="${rates[i]}">${rates[i]}</option>`;
        to += `<option value="${rates[i]}">${rates[i]}</option>`;
      }

      document.getElementById("from").innerHTML = from;
      document.getElementById("to").innerHTML = to;
    })

    .catch(error => {
      console.log(error);
    });
}

function checkExpiration() {

  var hours = 1;
  let timestamp = sessionStorage.getItem("timestamp");
  var date = new Date();
  let currentTime = date.getTime();

  if(currentTime-timestamp > hours*60*60*1000) {

      localStorage.clear()
      getAPIRates();      
  }
}

checkExpiration();

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();

  let amount = document.getElementById("amount").value;

  let from = document.getElementById("from").value;

  let to = document.getElementById("to").value;

  // Request specific exchange rates according to the user's inputs
  fetch(`https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`)
    .then(response => response.json())

    .then(data => {
     
      output = (amount * data.rates[`${to}`]).toFixed(5);

      document.getElementById("output").innerHTML = `
          <p>
            ${amount}
            <span> ${from}</span>
             =
            <h2>
              ${output} ${to}
            </h2>
          </p>

          <h3>1 ${from} = ${data.rates[`${to}`]} ${to}</h3>
        `;
    })
    .catch(error => {
      console.log(error);
    });
});
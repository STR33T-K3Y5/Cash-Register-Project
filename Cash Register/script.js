const purchaseButton = document.getElementById("purchase-btn");
const changeSection = document.getElementById("change-due");
const customerCash = document.getElementById("cash");
const cashRegister = document.getElementById("change-due");

let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const currencyUnit = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1.00,
  "FIVE": 5.00,
  "TEN": 10.00,
  "TWENTY": 20.00,
  "ONE HUNDRED": 100.00
};

// Display cid in UI
const cidDisplay = document.getElementById("cid-display");
cid.forEach(item => {
  const line = document.createElement("p");
  line.textContent = `${item[0]}: $${item[1]}`;
  cidDisplay.appendChild(line);
});

const calculateChange = (change, cid) => {
  let changeArray = [];
  let register = JSON.parse(JSON.stringify(cid)).reverse();

  let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);
  totalCID = Math.round(totalCID * 100) / 100;

  if (change === totalCID) {
    return { status: "CLOSED", change: cid };
  }

  for (let [unit, amount] of register) {
    let unitTotal = 0;
    while (change >= currencyUnit[unit] && amount >= currencyUnit[unit]) {
      change -= currencyUnit[unit];
      amount -= currencyUnit[unit];
      unitTotal += currencyUnit[unit];
      change = Math.round(change * 100) / 100;
    }
    if (unitTotal > 0) {
      changeArray.push([unit, unitTotal]);
    }
  }

  if (change > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeArray };
};

const handlePurchase = () => {
  const cash = parseFloat(customerCash.value);
  if (isNaN(cash) || cash <= 0) {
    alert("Please enter a value");
    return;
  }

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cash === price) {
    changeSection.innerHTML = "No change due - customer paid with exact cash";
    return;
  }

  const change = cash - price;
  const result = calculateChange(change, cid);

  if (result.status === "INSUFFICIENT_FUNDS") {
    changeSection.innerHTML = "Status: INSUFFICIENT_FUNDS";
  } else if (result.status === "CLOSED") {
    let output = `Status: CLOSED<br>`;
    result.change.forEach(([unit, amount]) => {
      if (amount > 0) {
        output += `${unit}: $${amount.toFixed(2)}<br>`;
      }
    });
    changeSection.innerHTML = output;
  } else {
    let output = `Status: OPEN<br>`;
    result.change.forEach(([unit, amount]) => {
      output += `${unit}: $${amount.toFixed(2)}<br>`;
    });
    changeSection.innerHTML = output;
  }
};

purchaseButton.addEventListener("click", handlePurchase);
customerCash.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handlePurchase();
  }
});

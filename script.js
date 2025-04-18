// === 1. DOM Elements ===

// important - avoid naming functions the same as ID attributes in the html, pre-defined dom elements like submit, reset etc
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const loanAmountInput = document.getElementById("loanAmount");
const loanTermInput = document.getElementById("loanTerm");
const interestInput = document.getElementById("interestRate");
const displayResult = document.getElementById("displayResult");
const calculateBtn = document.getElementById("calculateBtn");
const clearButton = document.getElementById("resetBtn");
clearButton.addEventListener("click", handleReset);
const form = document.getElementById("mortgage");
const summarySection = document.getElementById("summarySection"); 
const callbackForm = document.getElementById("callbackForm");
const fName = document.getElementById("contactFirstName")
const lName = document.getElementById("contactLastName")
const userEmail = document.getElementById("contactEmail")
const userNum = document.getElementById("contactPhone")
const userMessage = document.getElementById("contactMessage")

// === 2. state variables ===

// state variables not required as they are useful when i need to store data for use outside of a function or tracking changes 

// === 3. Setting up event listeners ===
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stops page from reloading
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();

  const cleanedAmount = loanAmountInput.value.trim().replace(/,/g, ""); // debugged the , issue in the loan user input
  const loanAmount = parseFloat(cleanedAmount);

  const loanTerm = parseFloat(loanTermInput.value.trim());

  let rawRate = interestInput.value.trim(); // gets the value the user typed, removes the spaces - created new variable that can change
  rawRate = rawRate.replace("%", ""); // IF user puts a %, we are removing
  const interestRate = parseFloat(rawRate) / 100; // converted the decimal to a number that will help calculate the monthly (e.g 4.5 becomes 0.045)

  const monthlyPayment = handleCalculatePayment(); // calls the calcuation and stores the result in a variable, so can be used
  // created new const in order to get monthlyPayment to be formatted like currency 
  const formattedPayment = monthlyPayment.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  })

// .innerHTML suggested by chatgpt for both display and summary as this parses and renders the HTML tags as real elements and allows things like: 
// <strong> when we want to highlight the result as bold text compared to the rest of the text 
// in order for the summary section to show when calculating the result, a const was made in the DOM section, and handled in this function. 

  displayResult.innerHTML = `Hello ${firstName}, based on the information you provided, and subject to a full affordability assessment and lender criteria, your monthly
  payment could look like <strong>£${monthlyPayment.toFixed(2)}</strong>. This is a guide to help you plan your next move confidently.`
  // .toFixed(2) rounds the number to 2 decimal places, to get rid of the pence

  summarySection.innerHTML = `
  <h3 class="text-lg font-bold">What this means for you</h3>
  <p>This estimate gives you a clear starting point for understanding your potential monthly mortgage commitment. Keep in mind, the actual figure may vary depending on your lender's terms, criteria and any additional fee's, such as arrangement fees.</p>

  <h3 class="text-lg font-bold">What to do next</h3>
  <ul class="list-disc list-inside space-y-1">
    <li>Firstly, review your monthly budget to ensure this payment is comfortable.</li>
    <li>Then contact a mortgage advisor or lender directly for a full assessment.</li>
    <li>Before submitting an offer for your new home, obtain a Decision in Principal(DIP)</li>
    <li>Compare different mortgage offers to get the best deal.</li>
    <li>Factor in other costs like home insurance, personal protection insurance, and legal fees.</li>
  </ul>

  <p class="text-xs italic text-gray-500 mt-4">* This calculation is a guide and does not constitute formal financial advice. Please consult a qualified professional mortgage advisor before making any decisions.</p>
`;
});
// .trim removes any spaces at the start of end of the string, purely for best practice
// parse float checks and conversts the input from a string to a number

loanAmountInput.addEventListener("change", () => {
  const amount = parseFloat(loanAmountInput.value);
  if (isNaN(amount)) {
    alert("Please enter a number");
    return;
  }
  console.log("Loan amount Entered:", amount);
});

callbackForm.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const contactFirstName = fName.value.trim(); 
  const contactLastName = lName.value.trim(); 
  const contactEmail = String(userEmail.value).trim(); 
  const contactPhone = userNum.value; 
  const contactMessage = userMessage.value.trim(); 

  handleContactSubmission(contactFirstName, contactLastName, contactEmail, contactPhone, contactMessage);
});


// === 4. Core functions ===
// DO MORE WORK ON UNDERSTAND FUNCTIONS AND UNDERSTANDING THE SYNTAX AND STRUCTURE *** 

function handleCalculatePayment() {
  const cleanedAmount = loanAmountInput.value.trim().replace(/,/g, ""); // demonstration of regex
  const loanAmount = parseFloat(cleanedAmount);
  const loanTerm = parseFloat(loanTermInput.value.trim());
  let rawRate = interestInput.value.trim(); // gets the value the user typed, removes the spaces - created new variable that can change
  rawRate = rawRate.replace("%", "");
  const interestRate = parseFloat(rawRate) / 100;

  const p = loanAmount;
  const r = interestRate / 12; // monthly interest rate
  const n = loanTerm * 12; // total number of montly payments

  const numerator = r * (1 + r) ** n;
  const denominator = (1 + r) ** n - 1;
  const monthlyPayment = (p * numerator) / denominator;

  return monthlyPayment;
}

function handleReset() {
  // purpose to clear the form, and reset the display for whatever values need to be reset !!
  firstNameInput.value = "";
  lastNameInput.value = "";
  loanAmountInput.value = "";
  loanTermInput.value = "";
  interestInput.value = "";
  displayResult.textContent = "0";
  summarySection.innerHTML = "";
}

// what do we do with this data stage 

function handleContactSubmission(contactFirstName, contactLastName, contactEmail, contactPhone, contactMessage) {
  const phoneDigits = String(contactPhone).replace(/\D/g, "");

  if(!contactEmail.includes("@")) {
    alert("Please enter a valid email address");
    return;
  }

  if (phoneDigits.length !== 11) {
    alert("Please enter a valid UK phone number (must be exactly 11 digits).");
    return;
  }
  
  if (!phoneDigits.startsWith("07")) {
    alert("UK mobile numbers must start with '07' 👀");
    return;
  }

  console.log("Contact Form Submission:");
  console.log("First Name:", contactFirstName);
  console.log("Last Name:", contactLastName);
  console.log("Email:", contactEmail);
  console.log("Phone:", contactPhone);
  console.log("Message", contactMessage);

  alert("Thank you for your message ! We'll be in touch soon.");
}

// loan(p) 200,000 (r)rate = 5%  term = 25 yr total num of payments(n)
// p = 200,000 r = (5/100) / 12 = 0.004167 and n = 25 * 12 = 300
// m = 200,000 * [0.004167(1+0.004167)^300] / [(1+0.004167)^300 - 1]
// monthly payment of £1,170.24

// FOR LOAN AMOUNT **
// parseFloat - converts the input string to a number, so decimal friendly)
// isNaN(amount) - checksif the input is a number
// .value to get what the user put into the form - .value is always a string, even if the user puts numbers. hence why we used
// parseFloat to convert that string to a number IF needed.

/* 
firstNameInput - Variable (DOM) - Points to the first name input field
loanAmount - Variable - Stores the numeric loan amount entered
calculatePayment() - Function - Will handle calculating monthly payments
handleReset()- Function - Clears form inputs + result display
rawRate - Variable - Temporary string to clean interest input
interestRate - Variable - Final cleaned rate used for calculation
form.addEventListener - Function (listener) - Listens for form submission
*/

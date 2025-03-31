document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("inputBox");
  const buttons = document.querySelectorAll("button");
  let expression = "";
  
  // Function to announce the pressed key
  function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  // Prevent invalid characters & leading zeros
  inputBox.addEventListener("input", (e) => {
    let input = e.target.value;

    // Remove non-numeric and non-operator characters
    input = input.replace(/[^0-9+\-*/().]/g, "");

    // Prevent multiple leading zeroes unless decimal
    if (/^0\d/.test(input)) {
      input = input.replace(/^0+/, "");
    }

    e.target.value = input;
  });

  // Button click handler
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const value = e.target.innerText;

      if (value === "=") {
        try {
          if (!expression || /[\+\-\*\/]$/.test(expression)) {
            throw new Error("Invalid Expression");
          }

          let result = eval(expression);

          // Fix floating-point precision issues
          result = parseFloat(result.toFixed(10)).toString();
          inputBox.value = result;
          speak("Result is " + result);
          inputBox.setAttribute("data-result", "true");
          expression = result;
        } catch (error) {
          inputBox.value = "Error";
          speak("Error");
          expression = "";
          inputBox.setAttribute("data-result", "true");
        }
      } else if (value === "AC") {
        expression = "";
        inputBox.value = "";
        speak("Cleared");
        inputBox.removeAttribute("data-result");
      } else if (value === "DEL") {
        if (expression.length > 0) {
          expression = expression.slice(0, -1);
          inputBox.value = expression;
          speak("Deleted");
        }
      } else if (value !== "Convert") {
        // Prevent consecutive operators
        if (/[\+\-\*\/]$/.test(expression) && /[\+\-\*\/]/.test(value)) {
          return;
        }

        // Reset if last result was displayed
        if (inputBox.getAttribute("data-result")) {
          expression = "";
          inputBox.removeAttribute("data-result");
        }

        expression += value;
        inputBox.value = expression;
        speak(value);
      }
    });
  });

  // Currency Converter Logic
  const amount = document.getElementById("amount");
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");
  const convertBtn = document.getElementById("convertBtn");
  const conversionResult = document.getElementById("conversionResult");

  convertBtn.addEventListener("click", async () => {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amt = parseFloat(amount.value);

    if (!amt || amt <= 0) {
      conversionResult.textContent = "Please enter a valid amount.";
      return;
    }

    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      if (!data.rates[to]) throw new Error("Invalid currency");

      const rate = data.rates[to];
      const result = (amt * rate).toFixed(2);
      conversionResult.textContent = `${amt} ${from} = ${result} ${to}`;
    } catch (error) {
      conversionResult.textContent = "Error fetching exchange rates.";
    }
  });
});

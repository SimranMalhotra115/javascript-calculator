const { useState } = React;

function App() {
  const [formula, setFormula] = useState("0");
  const [display, setDisplay] = useState("0");
  const [evaluated, setEvaluated] = useState(false);

  const endsWithOperator = /[+\-*/]$/;
  const endsWithNegativeSign = /[+\-*/]-$/;
  const operatorRegex = /[+\-*/]/;

  const clearAll = () => {
    setFormula("0");
    setDisplay("0");
    setEvaluated(false);
  };

  const handleNumber = (num) => {
    if (evaluated) {
      setFormula(num);
      setDisplay(num);
      setEvaluated(false);
      return;
    }

    if (display === "0") {
      if (num === "0") {
        if (formula === "0" || /(^|[+\-*/])0$/.test(formula)) {
          return;
        }
      }
    }

    if (formula === "0" || (evaluated && !operatorRegex.test(display))) {
      setFormula(num);
      setDisplay(num);
      setEvaluated(false);
      return;
    }

    if (endsWithOperator.test(formula) || endsWithNegativeSign.test(formula)) {
      setFormula(formula + num);
      setDisplay(num);
      return;
    }

    if (display === "0" && !display.includes(".")) {
      const newFormula = formula.replace(/(\d+)$/, (match) => {
        if (match === "0") return num;
        return match + num;
      });
      setFormula(newFormula);
      setDisplay(num);
      return;
    }

    setFormula(formula + num);
    setDisplay(display + num);
  };

  const handleDecimal = () => {
    if (evaluated) {
      setFormula("0.");
      setDisplay("0.");
      setEvaluated(false);
      return;
    }

    if (display.includes(".")) return;

    if (endsWithOperator.test(formula) || endsWithNegativeSign.test(formula)) {
      setFormula(formula + "0.");
      setDisplay("0.");
      return;
    }

    setFormula(formula + ".");
    setDisplay(display + ".");
  };

  const handleOperator = (operator) => {
    if (evaluated) {
      setFormula(display + operator);
      setDisplay(operator);
      setEvaluated(false);
      return;
    }

    if (formula === "0" && operator !== "-") return;

    if (formula === "0" && operator === "-") {
      setFormula("-");
      setDisplay("-");
      return;
    }

    if (endsWithNegativeSign.test(formula)) {
      if (operator === "-") return;
      const updated = formula.replace(/[+\-*/]-$/, operator);
      setFormula(updated);
      setDisplay(operator);
      return;
    }

    if (endsWithOperator.test(formula)) {
      if (operator === "-") {
        setFormula(formula + operator);
        setDisplay(operator);
      } else {
        const updated = formula.replace(/[+\-*/]+$/, operator);
        setFormula(updated);
        setDisplay(operator);
      }
      return;
    }

    setFormula(formula + operator);
    setDisplay(operator);
  };

  const handleEquals = () => {
    if (evaluated) return;

    let expression = formula;

    while (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }

    expression = expression.replace(/--/g, "+");

    try {
      let result = Function(`"use strict"; return (${expression})`)();
      result = Math.round(result * 1000000000000) / 1000000000000;
      result = result.toString();

      setDisplay(result);
      setFormula(expression + "=" + result);
      setEvaluated(true);
    } catch (error) {
      setDisplay("Error");
      setEvaluated(true);
    }
  };

  return (
    <div id="calculator">
      <div className="formula-screen">{formula}</div>
      <div id="display">{display}</div>

      <div className="buttons">
        <button id="clear" onClick={clearAll}>AC</button>
        <button id="divide" className="operator" onClick={() => handleOperator("/")}>/</button>
        <button id="multiply" className="operator" onClick={() => handleOperator("*")}>*</button>

        <button id="seven" onClick={() => handleNumber("7")}>7</button>
        <button id="eight" onClick={() => handleNumber("8")}>8</button>
        <button id="nine" onClick={() => handleNumber("9")}>9</button>
        <button id="subtract" className="operator" onClick={() => handleOperator("-")}>-</button>

        <button id="four" onClick={() => handleNumber("4")}>4</button>
        <button id="five" onClick={() => handleNumber("5")}>5</button>
        <button id="six" onClick={() => handleNumber("6")}>6</button>
        <button id="add" className="operator" onClick={() => handleOperator("+")}>+</button>

        <button id="one" onClick={() => handleNumber("1")}>1</button>
        <button id="two" onClick={() => handleNumber("2")}>2</button>
        <button id="three" onClick={() => handleNumber("3")}>3</button>
        <button id="equals" onClick={handleEquals}>=</button>

        <button id="zero" onClick={() => handleNumber("0")}>0</button>
        <button id="decimal" onClick={handleDecimal}>.</button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

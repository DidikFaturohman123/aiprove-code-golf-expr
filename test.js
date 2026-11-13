const { evalExpr } = require("./evalExpr.js");

// 9 public cases from AIProveRH/aiprove challenges/code-golf-expr/cases.json
const pub = [
  ["1+2*3", 7], ["(1+2)*3", 9], ["10/4", 2.5],
  ["2*2*2*2", 16], ["7-3-2", 2], ["(8-2)/(1+2)", 2],
  ["3.5+1.5", 5], ["100", 100], ["2*(3+(4-1))", 12],
];

// Adversarial / hidden-set guesses: unary, whitespace, decimals, nesting, associativity
const adv = [
  ["-5+3", -2],            // unary minus at start
  ["2*-3", -6],            // unary minus after *
  ["-(2+3)", -5],          // unary minus before paren
  [" 1 + 2 ", 3],          // surrounding whitespace
  ["  10  /  4  ", 2.5],   // inner whitespace
  [".5+0.5", 1],           // leading-dot decimal
  ["5.+5", 10],            // trailing-dot decimal
  ["((1+2))", 3],          // double nesting
  ["10-2-3", 5],           // left-assoc subtraction
  ["100/10/2", 5],         // left-assoc division
  ["2+3*4-1", 13],         // mixed precedence
  ["1/3", 1 / 3],          // repeating decimal
  ["0.1+0.2", 0.30000000000000004], // float semantics
  ["(2+3)*(4-1)/5", 3],    // parens + mixed ops
  ["3*-2+1", -5],          // unary minus mid-expression
  ["--5", 5],              // double unary minus
  ["1+2+3+4+5", 15],       // long chain
  ["10/(2+3)", 2],         // paren denominator
  ["-.5*2", -1],           // unary minus + leading dot
  ["5.", 5],               // bare trailing dot
  [".5", 0.5],             // bare leading dot
  ["+5", 5],               // unary plus
  ["2+-3", -1],            // plus then unary minus
  ["((2))", 2],            // nested single value
  ["1-2-3-4", -8],         // long subtraction chain
  ["2*3/4", 1.5],          // mixed * /
  ["1000000*1000000", 1e12], // large numbers
  ["0", 0],                // zero
  ["  (  2  +  3  )  *  4  ", 20], // heavy whitespace
  ["2--3", 5],             // minus then unary minus
  ["-2*3", -6],            // unary minus then multiply
  ["4/-2", -2],            // division by negative
  ["(1+2)*(3+4)", 21],     // two paren groups
  ["9/3/3", 1],            // chained division
  ["2.5*4", 10],           // decimal multiply
];

let fails = 0;
function run(list, tag) {
  for (const [input, want] of list) {
    let got;
    try { got = evalExpr(input); } catch (e) { got = "THREW:" + e.message; }
    const ok = typeof got === "number" && Math.abs(got - want) <= 1e-9 * Math.max(1, Math.abs(want));
    if (!ok) fails++;
    console.log(`${ok ? "PASS" : "FAIL"} [${tag}] ${JSON.stringify(input)} => ${got} (want ${want})`);
  }
}
run(pub, "public");
run(adv, "adversarial");
console.log(fails === 0 ? `ALL ${pub.length + adv.length} TESTS PASSED` : `${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);

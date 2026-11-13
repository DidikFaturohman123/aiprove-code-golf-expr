// Differential fuzzer: random valid expressions, evalExpr vs JS eval (oracle).
// eval is used ONLY here in the test harness, never in the entry.
const { evalExpr } = require("./evalExpr.js");

function rnd(n) { return Math.floor(Math.random() * n); }
function num() {
  const kind = rnd(5);
  if (kind === 0) return "." + rnd(10);            // .5
  if (kind === 1) return String(rnd(100)) + ".";    // 5.
  if (kind === 2) return (rnd(100) + rnd(10) / 10).toFixed(1); // 12.3
  if (kind === 3) return "0";
  return String(rnd(1000));                        // int
}
function expr(d) {
  if (d <= 0 || rnd(3) === 0) {
    let s = num();
    if (rnd(4) === 0) s = "-" + s;                  // unary minus
    if (rnd(5) === 0) s = "+" + s;                  // unary plus
    return s;
  }
  const op = "+-*/"[rnd(4)];
  let s = expr(d - 1) + op + expr(d - 1);
  if (rnd(2) === 0) s = "(" + s + ")";
  if (rnd(3) === 0) s = "-" + s;                    // unary minus before paren
  if (rnd(3) === 0) s = " " + s + " ";              // whitespace
  return s;
}

let fails = 0, n = 3000;
for (let k = 0; k < n; k++) {
  const s = expr(3);
  let want, got;
  try { want = eval(s); } catch { continue; }        // skip invalid (e.g. div by zero -> Infinity is fine, eval handles it)
  if (typeof want !== "number") continue;
  try { got = evalExpr(s); } catch (e) { got = "THREW:" + e.message; }
  const ok = typeof got === "number" && (got === want || (Number.isNaN(got) && Number.isNaN(want)) || Math.abs(got - want) <= 1e-9 * Math.max(1, Math.abs(want)));
  if (!ok) { fails++; if (fails <= 10) console.log(`FAIL ${JSON.stringify(s)} => ${got} (want ${want})`); }
}
console.log(fails === 0 ? `FUZZ OK: ${n} random expressions match JS eval` : `FUZZ: ${fails}/${n} FAILURES`);
process.exit(fails === 0 ? 0 : 1);

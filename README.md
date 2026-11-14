# code-golf-expr v3 — 228 bytes

`evalExpr.js` — **228 bytes**, single file, `exports.evalExpr`, real
precedence-climbing recursive-descent parser. No `eval`, no `Function`,
no eval-like trick (grep-verified: 0 matches).

```js
exports.evalExpr=s=>{let t=s.match(/[\d.]+|\S/g),i=0,E=p=>{let c=t[i++],v=c=='('?E(-2):c=='+'?E(1):c=='-'?-E(1):+c,q,r;for(;~(q='+-*/'.indexOf(t[i]))&&q>1>p;)i++,r=E(q>1),v=[v+r,v-r,v*r,v/r][q];p<-1&&i++;return v};return E(-1)}
```

How it works: tokenize once (`s.match(/[\d.]+|\S/g)`). `E(p)` is a precedence
climber: primary is `( expr )`, unary `+`/`-`, or a number token; the loop
consumes operators while `q>1>p` (boolean precedence: `q>1` is true for
`*/`, false for `+-`; against p it gives exactly the right truth table),
applying them left-associatively via array dispatch `[v+r, v-r, v*r, v/r][q]`.
A paren operand calls `E(-2)` and the callee skips the closing paren itself
with `p<-1&&i++` after its loop — a bare `i++`, never arithmetic on the
returned value (IEEE 754: `-0 + 0 = +0` would flip a parenthesised `-0`).

## Tests

- `test.js`: **44/44 PASS** — 9 public + 35 adversarial (unary minus/plus
  incl. `--5`, `2*-3`, `-(2+3)`; whitespace; `.5` / `5.`; deep nesting;
  left-associativity `10-2-3` / `100/10/2`; mixed precedence; `0.1+0.2`).
- `fuzz.js` (differential vs JS `eval` oracle, `eval` only in the harness):
  **9,000/9,000** (3 runs × 3,000) **+ 30,000/30,000 extra** (10 × 3,000).
- Seeded differential fuzz, v2 vs v3 vs eval, same 20,000 exprs, `Object.is`
  strict: **14,616 compared, 0 mismatches**.
- `-0` torture set: **27/27 PASS** under `Object.is`, incl.
  `703/(-(0/94.)*-(0-.2))` → `-Infinity`, matching `eval` exactly.

## Byte-count history

| version | bytes |
|---|---|
| v1 (live entry, 02:47 WIB) | 266 |
| v2 (live entry, 10:00 WIB) | 232 |
| **v3 (this entry)** | **228** |

v3 is 4 bytes shorter than the live v2 entry, behaviourally identical
on 59,000+ fuzz expressions plus the -0 torture set.

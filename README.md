# code-golf-expr v2 — 232 bytes

`evalExpr.js` — **232 bytes**, single file, `exports.evalExpr`, real
precedence-climbing recursive-descent parser. No `eval`, no `Function`,
no eval-like trick (grep-verified: 0 matches).

```js
exports.evalExpr=s=>{let t=s.match(/[\d.]+|\S/g),i=0,E=p=>{let c=t[i++],v=c=='('?E(-1):c=='+'?E(1):c=='-'?-E(1):+c,q,r;c=='('&&i++;for(;~(q='+-*/'.indexOf(t[i]))&&q>>1>p;)i++,r=E(q>>1),v=[v+r,v-r,v*r,v/r][q];return v};return E(-1)}
```

How it works: tokenize once (`s.match(/[\d.]+|\S/g)` — numbers as tokens,
whitespace skipped for free). `E(p)` is a precedence climber: primary is
`( expr )`, unary `+`/`-`, or a number token; the loop consumes operators
whose precedence (`'+-*/'.indexOf(t[i])>>1`, 0 for `+-`, 1 for `*/`) exceeds
`p`, applying them left-associatively via array dispatch
`[v+r, v-r, v*r, v/r][q]`. The closing paren is skipped with a separate
`c=='('&&i++` statement — never by adding 0 to the returned value
(IEEE 754: `-0 + 0 = +0` would flip a parenthesised `-0`).

## Tests

- `test.js`: **44/44 PASS** — 9 public + 35 adversarial (unary minus/plus
  incl. `--5`, `2*-3`, `-(2+3)`; whitespace; `.5` / `5.`; deep nesting;
  left-associativity `10-2-3` / `100/10/2`; mixed precedence; `0.1+0.2`).
- `fuzz.js` (differential vs JS `eval` oracle, `eval` only in the harness):
  **9,000/9,000 random expressions match** (3 runs × 3,000).
- `-0` torture set: **12/12 PASS** under `Object.is`, incl.
  `703/(-(0/94.)*-(0-.2))` → `-Infinity`, matching `eval` exactly.

## Byte-count history

| version | bytes |
|---|---|
| v1 (live entry) | 266 |
| **v2 (this entry)** | **232** |

v2 is 34 bytes shorter than the live v1 entry, behaviourally identical
on 9,000+ fuzz expressions plus the -0 torture set.

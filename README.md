# AIProve — code-golf-expr: smallest expression evaluator

Entry for the AIProve bounty "Smallest expression evaluator that passes every test"
(https://aiprove.fun/bounty/code-golf-expr).

## Entry

`evalExpr.js` — **266 bytes**. A real precedence-climbing recursive-descent
parser (no `eval`/`Function`). Exports `evalExpr` as `module.exports = { evalExpr }`.

Supports `+ - * /`, integer and decimal literals, parentheses, normal precedence,
unary `+`/`-`, and whitespace.

## Test

```sh
node test.js   # 9 public cases + 35 adversarial cases — all must pass
node fuzz.js   # differential fuzz vs JS eval oracle (test harness only)
```

Results at build time: 44/44 tests pass; 9,000/9,000 fuzz expressions match.
See `REPORT.md` and `BUILD-TRANSCRIPT.md` for the byte-count history and build log.

Entrant: `0xf5AEEA5f63345AB30aB98708120d99101C80D3bC` (handle `hansen-agent`).

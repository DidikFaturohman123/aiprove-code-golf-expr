# code-golf-expr v4 — 222 bytes

Real precedence-climbing parser for `evalExpr(s)`. No `eval`/`Function`.

- `+` `-` `*` `/`, decimals, parens, precedence, unary `+`/`-`, whitespace
- Byte history: v1 266 → v2 232 → v3 228 → **v4 222**
- v4 tricks vs v3: char-comparison ternaries (`c<'*'`, `c<'-'`, `c<'.'`) instead of `==` branches; closing-paren skip moved into the `for` loop init (`i+=c<'*'`) so it only touches the index, never the value (preserves `-0` semantics)
- Verified: 44/44 tests, 39,000/39,000 fuzz vs JS `eval` oracle, 20,000-expr seeded differential (v2 vs v4 vs eval, `Object.is`, 0 mismatches), 27/27 `-0` torture cases

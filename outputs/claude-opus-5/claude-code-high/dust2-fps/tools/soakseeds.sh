#!/usr/bin/env bash
# Runs the soak test across several seeds.
for s in 7 4242 90210; do
  node --experimental-strip-types tools/verify.ts "${1:-700}" "$s" 2>&1 |
    grep -E "seed|rounds fin|inside-wall|out-of|NaN pos|longest|VERIFY"
  echo "----"
done

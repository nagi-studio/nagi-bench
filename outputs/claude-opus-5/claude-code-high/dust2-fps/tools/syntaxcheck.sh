#!/usr/bin/env bash
# Syntax-checks every .ts module with Node's native type stripper.
fail=0
for f in $(find src tools -name "*.ts" | sort); do
  out=$(node --experimental-strip-types --check "$f" 2>&1)
  if [ -n "$out" ]; then
    echo "=== FAIL $f"
    echo "$out" | head -6
    fail=1
  else
    echo "ok   $f"
  fi
done
exit $fail

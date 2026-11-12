#!/usr/bin/env python3
# usage: sub.py file  (reads pairs from tools/sub.txt: blocks separated by lines '@@@', old/new separated by '>>>')
import sys
p = sys.argv[1]
s = open(p).read()
spec = open(sys.argv[2] if len(sys.argv) > 2 else 'tools/sub.txt').read()
blocks = spec.split('\n@@@\n')
# validate first
for block in blocks:
    if not block.strip():
        continue
    old, new = block.split('\n>>>', 1)
    new = new[1:] if new.startswith('\n') else new
    if old not in s:
        print('NOT FOUND:', old[:120]); sys.exit(1)
    s = s.replace(old, new)
open(p, 'w').write(s)
print('ok')

import sys, pathlib
path = pathlib.Path(sys.argv[1])
path.parent.mkdir(parents=True, exist_ok=True)
content = sys.stdin.read()
path.write_text(content, encoding='utf-8')
print(f'Wrote {len(content)} characters to {path}')

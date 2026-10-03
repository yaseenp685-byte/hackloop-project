import sys, pathlib, base64
path = pathlib.Path(sys.argv[1])
path.parent.mkdir(parents=True, exist_ok=True)
mode = 'wb'
if len(sys.argv) > 3 and sys.argv[2] == '--append':
    mode = 'ab'
    b64 = sys.argv[3]
elif len(sys.argv) > 2 and sys.argv[2] != '--append':
    b64 = sys.argv[2]
else:
    b64 = sys.stdin.read()
b64 = ''.join(b64.split())
b64 += '=' * (-len(b64) % 4)
content = base64.b64decode(b64)
with open(path, mode) as f:
    f.write(content)
print(f'Wrote {len(content)} bytes to {path} ({mode})')

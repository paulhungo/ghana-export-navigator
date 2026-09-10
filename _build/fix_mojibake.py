# Repair double-encoded UTF-8 (PowerShell ANSI misread) in files touched by Set-Content
import sys

FILES = [
    r"C:\Users\user\GhanaExportNavigator\index.html",
    r"C:\Users\user\GhanaExportNavigator\assets\js\stages.js",
    r"C:\Users\user\GhanaExportNavigator\_build\test.html",
]

def fix_text(s):
    # current: original-utf8-bytes decoded as cp1252 then saved as utf-8.
    # reverse: encode back to cp1252 bytes, then decode as utf-8.
    try:
        return s.encode("cp1252").decode("utf-8")
    except Exception:
        # per-character fallback for the few cp1252-undefined mappings
        out = []
        for ch in s:
            try:
                out.append(ch.encode("cp1252"))
            except Exception:
                out.append(ch.encode("cp1252", errors="replace"))
        b = b"".join(out)
        try:
            return b.decode("utf-8")
        except Exception:
            return s  # leave as-is if not repairable

for path in FILES:
    with open(path, "r", encoding="utf-8") as f:
        s = f.read()
    fixed = fix_text(s)
    if fixed != s:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(fixed)
        print("repaired:", path)
    else:
        print("no change:", path)

# report leftovers
import re
for path in FILES:
    with open(path, "r", encoding="utf-8") as f:
        t = f.read()
    bad = re.findall(r"[\u00c3\u00e2\u00c2\u00e3\u00f0\u00c9\u00ce\u0092][\u0080-\u00bf\u0153\u20ac\u2122\u2026\u201a\u201e\u2020\u2021\u02c6\u2030\u0160\u2039\u017d\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u017e\u0178]?", t)
    suspicious = [m for m in ["â€", "Ã¢", "ðŸ", "ΓÜ", "≡ƒ", "â€™", "Ã©"] if m in t]
    print(path.split("\\")[-1], "suspicious leftovers:", suspicious if suspicious else "none")

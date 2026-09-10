# Packs data/*.json into data/*.json.js wrappers so the app runs over file:// too
import json, os
BASE = r"C:\Users\user\GhanaExportNavigator"
mapping = [
    ("agencies.json", "GEN_AGENCIES"),
    ("destinations.json", "GEN_DESTINATIONS"),
    ("updates.json", "GEN_UPDATES"),
    ("products.json", "GEN_PRODUCTS"),
    ("directory.json", "GEN_DIRECTORY"),
]
for fname, var in mapping:
    src = os.path.join(BASE, "data", fname)
    with open(src, "r", encoding="utf-8") as f:
        data = json.load(f)
    out = os.path.join(BASE, "data", fname + ".js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* Auto-generated from %s - edit the .json source, then run _build/pack_data.py */\n" % fname)
        f.write("window.%s = %s;\n" % (var, json.dumps(data, ensure_ascii=False)))
    print("packed", var, "->", out)

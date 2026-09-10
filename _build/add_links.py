# Phase 2: inject tier2links (official destination authority URLs) into destinations.json
import json, os

P = r"C:\Users\user\GhanaExportNavigator\data\destinations.json"
links = {
    "uk": ["https://www.gov.uk/guidance/plant-health-controls", "https://www.food.gov.uk/"],
    "eu": ["https://trade.ec.europa.eu/", "https://food.ec.europa.eu/"],
    "netherlands": ["https://english.nvwa.nl/"],
    "germany": ["https://www.bvl.bund.de/EN/"],
    "france": ["https://agriculture.gouv.fr/"],
    "usa": ["https://www.aphis.usda.gov/", "https://www.fda.gov/", "https://www.cbp.gov/"],
    "canada": ["https://inspection.canada.ca/"],
    "turkey": ["https://www.tarimorman.gov.tr/"],
    "japan": ["https://www.maff.go.jp/e/index.html"],
    "korea": ["https://www.mfds.go.kr/eng/index.do"],
    "china": ["http://english.customs.gov.cn/"],
    "india": ["https://www.fssai.gov.in/", "https://www.dgft.gov.in/"],
    "uae": ["https://www.moccae.gov.ae/"],
    "saudi": ["https://www.sfda.gov.sa/en"],
    "australia": ["https://www.agriculture.gov.au/biosecurity-trade", "https://www.foodstandards.gov.au/"],
    "russia": ["https://fsvps.gov.ru/"],
    "south_africa": ["https://www.dalrrd.gov.za/", "https://www.sars.gov.za/"],
    "morocco": ["http://www.onssa.gov.ma/"],
}

with open(P, "r", encoding="utf-8") as f:
    data = json.load(f)

added = 0
for d in data["destinations"]:
    if d["id"] in links and "tier2links" not in d:
        d["tier2links"] = links[d["id"]]
        added += 1

with open(P, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("tier2links added to", added, "destinations")

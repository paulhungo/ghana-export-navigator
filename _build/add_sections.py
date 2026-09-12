# add page sections to the test harness so the back-trail can be exercised
p = r"C:\Users\user\GhanaExportNavigator\_build\test.html"
t = open(p, encoding="utf-8").read()
old = '<div id="wizard"></div><div id="roadmap-holder"></div>'
new = ('<section class="page active" id="page-home"></section>'
       '<section class="page" id="page-roadmap"></section>'
       '<section class="page" id="page-products"></section>'
       '<div id="wizard"></div><div id="roadmap-holder"></div>')
if old in t:
    t = t.replace(old, new)
    open(p, "w", encoding="utf-8").write(t)
    print("sections added to harness")
else:
    print("anchor not found - check manually")

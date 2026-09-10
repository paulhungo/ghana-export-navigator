# add a real tap-through regression step: use wizard handlers exactly as a user would
p = r"C:\Users\user\GhanaExportNavigator\_build\test.html"
t = open(p, encoding="utf-8").read()
anchor = 'step("docs", function(){'
newstep = ('step("tap-through", function(){ GEN.startWizard(); GEN.wizPick(\'pineapple\'); '
           'GEN.wizPickForm(\'fresh\'); GEN.wizQty(\'5000\'); GEN.wizUnit(\'kg\'); '
           'GEN.wizDest(\'uk\'); GEN.wizBuyer(\'need\'); GEN.wizTransport(\'sea\'); '
           'if(GEN.wiz.data.transport!==\'sea\'){throw new Error(\'tap-through failed\');} '
           'GEN.wizNext(); });\n    ' + anchor)
t = t.replace(anchor, newstep)
open(p, "w", encoding="utf-8").write(t)
print("tap-through test added")

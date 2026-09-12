# add backnav + edit-answers regression steps to the test harness
p = r"C:\Users\user\GhanaExportNavigator\_build\test.html"
t = open(p, encoding="utf-8").read()
anchor = 'stepName = "done";'
newsteps = (
    'step("backnav", function(){ GEN.show(\'products\'); GEN.launch(\'mango\'); '
    'if(GEN._pageStack.indexOf(\'products\')===-1){throw new Error(\'products not on trail\');} '
    'if(GEN.wiz.data.productId!==\'mango\'){throw new Error(\'launch failed\');} '
    'if(GEN.wiz.data.destId!==\'uk\'){throw new Error(\'launch did not preserve answers\');} '
    'GEN.back(); });\n    '
    'step("edit-answers", function(){ GEN.editAnswers(); '
    'if(!GEN.wiz.data.productId){throw new Error(\'editAnswers lost answers\');} });\n    '
    + anchor
)
if anchor not in t:
    raise SystemExit("anchor not found")
t = t.replace(anchor, newsteps)
open(p, "w", encoding="utf-8").write(t)
print("backnav + edit-answers tests added")

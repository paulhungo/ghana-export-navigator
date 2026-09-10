/* Ghana Agricultural Export Navigator — tools: calculators, readiness, rejection solver, share/print */
window.GEN = window.GEN || {};

GEN.toast = function(msg){
  var t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(GEN._toastTimer);
  GEN._toastTimer = setTimeout(function(){ t.style.display='none'; }, 2600);
};

GEN.printPage = function(){ window.print(); };

GEN.shareSite = function(){
  var txt = "Ghana Agricultural Export Navigator — tell it your product, form, quantity and destination and receive your complete export roadmap: registrations, regulators, certificates, packaging, route, documents, costs and profit.";
  GEN.shareText("Ghana Agricultural Export Navigator\n\n" + txt);
};

GEN.shareText = function(text){
  text = text || "";
  if(navigator.share){
    navigator.share({title:"Ghana Agricultural Export Navigator", text:text}).catch(function(){});
  } else {
    var url = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  }
};

GEN.copyText = function(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ GEN.toast("Copied"); }, function(){});
  } else {
    var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); GEN.toast("Copied"); }catch(e){}
    document.body.removeChild(ta);
  }
};

/* ---------------- profit calculator ---------------- */
GEN.DEFAULT_COST_LINES = ["Farm production","Aggregation","Sorting/grading","Packaging + labels","Storage / cold chain","Labour","Laboratory tests","Certifications (regulator fees)","Transport to warehouse","Transport to port/airport","Clearing agent","Customs & port charges","Container/reefer","International freight","Insurance","Bank charges & FX costs","Commission","Spoilage / rejection allowance"];
GEN.CURRENCIES = [["GHS","GH\u20B5 \u2014 Ghana Cedi"],["USD","$ \u2014 US Dollar"],["EUR","\u20AC \u2014 Euro"],["GBP","\u00A3 \u2014 British Pound"],["XOF","CFA Franc"],["NGN","Naira"],["OTHER","Other (I will type it)"]];
GEN.UNITS = ["kg","tonnes","crates","cartons","boxes","bags","baskets","pieces","birds","crates of eggs","litres","other (I will type it)"];

GEN.renderCalc = function(elId, defaults){
  var el = document.getElementById(elId);
  if(!el) return;
  var d = defaults || {};
  var lines = d.costLines ? d.costLines : GEN.DEFAULT_COST_LINES;
  var cur = d.currency || "GHS";
  var unit = d.unit || "kg";
  var h = '<div class="card"><h3>🧮 Export Profit Calculator</h3>';
  h += '<div class="grid-2">';
  h += '<div><label>Main currency (your money)</label><select class="wiz-input" id="c-cur" onchange="GEN.calcUnitLabels()">';
  for(var ci=0;ci<GEN.CURRENCIES.length;ci++){ h += '<option value="'+GEN.CURRENCIES[ci][0]+'"'+(cur===GEN.CURRENCIES[ci][0]?' selected':'')+'>'+GEN.CURRENCIES[ci][1]+'</option>'; }
  h += '</select><input class="wiz-input" id="c-cur-other" placeholder="Type the currency name..." style="display:none;margin-top:6px"></div>';
  h += '<div><label>Quantity you will sell</label><input type="number" id="c-qty" value="'+(d.qty?d.qty:1000)+'"><select class="wiz-input" id="c-unit" onchange="GEN.calcUnitLabels()">';
  for(var ui=0;ui<GEN.UNITS.length;ui++){ h += '<option'+(unit===GEN.UNITS[ui]?' selected':'')+'>'+GEN.UNITS[ui]+'</option>'; }
  h += '</select><input class="wiz-input" id="c-unit-other" placeholder="Type your unit (e.g. bunches)" style="display:none;margin-top:6px"></div>';
  h += '</div>';
  h += '<div class="grid-2" style="margin-top:10px">';
  h += '<div><label>Buyer price per <span id="c-unit-label1">unit</span></label><input type="number" step="0.01" id="c-price" value="'+(d.price!==undefined&&d.price!==null?d.price:'')+'" placeholder="e.g. 1.20"></div>';
  h += '<div><label>Expected loss/spoilage (%)</label><input type="number" id="c-loss" value="'+(d.loss||5)+'"></div>';
  h += '</div>';
  h += '<div class="grid-2" style="margin-top:8px"><div><label>Target profit margin (%) — what you WANT to earn</label><input type="number" id="c-target" value="'+(d.target||20)+'"></div><div></div></div>';
  h += '<p class="muted" style="margin-top:12px"><strong>Your costs</strong> — everything you will spend, in your main currency. Fill only the lines that apply to you:</p>';
  h += '<div class="calc-grid" id="c-lines">';
  for(var i=0;i<lines.length;i++){
    var v = (d.costValues && d.costValues[i]!==undefined && d.costValues[i]!==null) ? d.costValues[i] : "";
    h += '<div><label>'+lines[i]+'</label><input type="number" step="0.01" class="c-cost" data-line="'+lines[i]+'" placeholder="0.00" value="'+v+'"></div>';
  }
  h += '</div>';
  h += '<div class="btn-row no-print"><button class="btn" onclick="GEN.runCalc()">🧮 Calculate my profit</button><button class="btn gold" onclick="GEN.fillExample()">Fill with a worked example</button><button class="btn ghost" onclick="GEN.clearCalc()">Clear</button></div>';
  h += '<details style="margin-top:10px"><summary class="muted" style="cursor:pointer;font-weight:700">💱 My buyer pays in a different currency — convert for me</summary>';
  h += '<div class="grid-3" style="margin-top:8px"><div><label>Buyer offers (per unit, in their money)</label><input type="number" step="0.01" id="c-fx-price" placeholder="e.g. 0.50"></div><div><label>Buyer\'s currency</label><select class="wiz-input" id="c-fx-cur"><option>USD</option><option>EUR</option><option>GBP</option><option>GHS</option><option>XOF</option></select></div><div><label>Rate: 1 buyer-unit = ? in your money</label><input type="number" step="0.0001" id="c-fx-rate" placeholder="e.g. 12"></div></div>';
  h += '<div class="btn-row no-print"><button class="btn small" onclick="GEN.calcFx()">💱 Convert and use this price</button></div>';
  h += '<p class="muted" style="font-size:.8rem">Where to find today\'s rate: your bank, or Bank of Ghana publishes daily interbank rates on bog.gov.gh. 🟡 Rates change daily — confirm with your bank before you agree a price.</p>';
  h += '</details>';
  h += '<div class="result-box" id="c-result" style="display:none"></div>';
  h += '<div id="calc-teacher">'+GEN.teacherCardHtml()+'</div>';
  h += '</div>';
  el.innerHTML = h;
  GEN.calcUnitLabels();
};

GEN.teacherCardHtml = function(){
  return '<div class="card"><h3>📚 Understand the calculation — in plain words</h3>'+
    '<p><strong>1 · Revenue</strong> = price × what you sell. If you sell 1,000 kg at 1.20, the buyer pays 1,200.</p>'+
    '<p style="margin-top:6px"><strong>2 · Costs</strong> = everything: production, packaging, tests, permits, transport, agent, freight, bank charges… and a spoilage/rejection allowance, because some always goes bad.</p>'+
    '<p style="margin-top:6px"><strong>3 · Profit</strong> = revenue − costs. <strong>Margin</strong> = profit ÷ revenue × 100. Example: 1,200 − 950 = 250 profit; 250 ÷ 1,200 = 20.8% margin.</p>'+
    '<p style="margin-top:6px"><strong>4 · Break-even price</strong> = total costs ÷ sellable quantity. 950 ÷ 950 kg = 1.00 per kg. Below 1.00 you are paying to work.</p>'+
    '<p class="muted" style="margin-top:8px">The same crop can be highly profitable or almost not worth exporting depending on freight, rejection and packaging costs — that is why honest cost lines matter. Currency: use ONE currency consistently; if the buyer pays in a different one, use the 💱 converter with today\'s bank rate.</p>'+
    '<div class="verify-line">Reference sector context: GEPA reported Ghana\'s 2025 Non-Traditional Export sector at about US$5.007 billion (2024: about US$3.831 billion). The market is real — the maths decides YOUR share of it.</div></div>';
};

GEN.mainCurLabel = function(){
  var sel = document.getElementById('c-cur');
  if(!sel) return "";
  var v = sel.value;
  if(v==="OTHER"){ var o = document.getElementById('c-cur-other'); return o && o.value ? o.value : "your currency"; }
  return v;
};

GEN.calcUnit = function(){
  var sel = document.getElementById('c-unit');
  if(!sel) return "unit";
  var v = sel.value;
  if(v.indexOf("other")===0){ var o = document.getElementById('c-unit-other'); return o && o.value ? o.value : "unit"; }
  return v;
};

GEN.calcUnitLabels = function(){
  var so = document.getElementById('c-cur-other'), uo = document.getElementById('c-unit-other');
  var csel = document.getElementById('c-cur'), usel = document.getElementById('c-unit');
  if(so) so.style.display = (csel && csel.value==="OTHER") ? 'block':'none';
  if(uo) uo.style.display = (usel && usel.value.indexOf("other")===0) ? 'block':'none';
  var u = GEN.calcUnit();
  var l1 = document.getElementById('c-unit-label1');
  if(l1) l1.textContent = u;
};

GEN.fillExample = function(){
  var q = document.getElementById('c-qty'); if(!q) return;
  var d = GEN._calcDefaults || {};
  var ex = d.example || {qtyKg:1000, buyerPrice:1.20};
  q.value = ex.quantityKg || ex.qtyKg || 1000;
  var p = document.getElementById('c-price'); if(p) p.value = ex.buyerPrice || 1.20;
  var tg = document.getElementById('c-target'); if(tg) tg.value = 20;
  var ls = document.getElementById('c-loss'); if(ls) ls.value = 5;
  var cur = document.getElementById('c-cur');
  var vals = ex.costs || {"Farm production":400,"Aggregation":50,"Sorting/grading":40,"Packaging + labels":120,"Storage / cold chain":60,"Labour":60,"Laboratory tests":30,"Certifications (regulator fees)":60,"Transport to warehouse":30,"Transport to port/airport":40,"Clearing agent":40,"Customs & port charges":20,"Insurance":20};
  if(ex.unit === "USD per kg" && cur) cur.value = "USD";
  var inputs = document.querySelectorAll('#c-lines .c-cost');
  for(var i=0;i<inputs.length;i++){
    var line = inputs[i].getAttribute('data-line');
    inputs[i].value = (vals[line]!==undefined) ? vals[line] : "";
  }
  GEN.runCalc();
  GEN.toast("Example filled — now edit with your real numbers");
};

GEN.clearCalc = function(){
  var ids = ["c-qty","c-price","c-target","c-loss"];
  for(var i=0;i<ids.length;i++){ var e=document.getElementById(ids[i]); if(e) e.value=""; }
  document.getElementById('c-target').value = 20;
  document.getElementById('c-loss').value = 5;
  var inputs = document.querySelectorAll('#c-lines .c-cost');
  for(var j=0;j<inputs.length;j++) inputs[j].value="";
  var r = document.getElementById('c-result'); if(r){ r.style.display='none'; r.innerHTML=''; }
};

GEN.calcFx = function(){
  var fp = parseFloat(document.getElementById('c-fx-price').value);
  var rate = parseFloat(document.getElementById('c-fx-rate').value);
  var fcur = document.getElementById('c-fx-cur').value;
  var mcur = GEN.mainCurLabel();
  if(isNaN(fp) || isNaN(rate) || rate<=0){ GEN.toast("Enter the buyer's price and the rate first"); return; }
  var converted = fp * rate;
  var p = document.getElementById('c-price'); if(p) p.value = converted.toFixed(2);
  var r = document.getElementById('c-result');
  if(r){
    r.style.display='block';
    r.innerHTML = '<p><strong>💱 Conversion:</strong> if your buyer pays '+fp.toFixed(2)+' '+fcur+' per '+GEN.calcUnit()+', and 1 '+fcur+' = '+rate+' '+mcur+', then their offer is <strong>'+converted.toFixed(2)+' '+mcur+'</strong> per '+GEN.calcUnit()+'. It has been entered as your price below.</p>';
  }
  GEN.runCalc();
};

GEN.runCalc = function(){
  var q = parseFloat(document.getElementById('c-qty').value)||0;
  var p = parseFloat(document.getElementById('c-price').value)||0;
  var loss = parseFloat(document.getElementById('c-loss').value)||0;
  var target = parseFloat(document.getElementById('c-target').value)||0;
  var costs = 0, rows = [];
  var inputs = document.querySelectorAll('#c-lines .c-cost');
  for(var i=0;i<inputs.length;i++){
    var v = parseFloat(inputs[i].value);
    if(!isNaN(v) && v>0){ costs += v; rows.push('<tr><td>'+inputs[i].getAttribute('data-line')+'</td><td>'+v.toFixed(2)+'</td></tr>'); }
  }
  var u = GEN.calcUnit();
  var mc = GEN.mainCurLabel();
  var sellable = q * (1 - loss/100);
  var revenue = p * sellable;
  var profit = revenue - costs;
  var margin = revenue > 0 ? (profit/revenue*100) : 0;
  var breakeven = sellable > 0 ? (costs / sellable) : 0;
  var targetPrice = sellable > 0 ? (costs / sellable) * (1 + target/100) : 0;
  var r = document.getElementById('c-result');
  r.style.display = 'block';
  var cls = profit >= 0 ? '' : ' neg';
  var verdict = '';
  if(costs>0 && revenue>0){
    if(profit > 0 && margin >= target) verdict = '<div class="notice green">✅ Good: at this price you earn '+margin.toFixed(1)+'% — your target was '+target+'%. Confirm the buyer with care and go.</div>';
    else if(profit > 0) verdict = '<div class="notice">🟡 You earn something ('+margin.toFixed(1)+'%) but below your '+target+'% target. You can accept it — or push for '+targetPrice.toFixed(2)+' '+mc+' per '+u+'.</div>';
    else if(profit === 0 || margin < 2) verdict = '<div class="notice">⚠️ Almost break-even: profit is nearly zero. One delay, one rejection and you lose. Do not ship at this price without renegotiating.</div>';
    else verdict = '<div class="notice red">🔴 You LOSE '+Math.abs(profit).toFixed(2)+' '+mc+' at this price. Do not ship. Either raise your price to at least '+breakeven.toFixed(2)+' '+mc+' per '+u+', or cut costs.</div>';
  }
  r.innerHTML = '<h3 style="color:var(--green)">Your numbers, explained</h3><table style="margin-top:6px">'+
    '<tr><td>Sellable quantity</td><td><strong>'+sellable.toFixed(0)+' '+u+'</strong></td><td class="muted">how much you actually have to sell after the '+loss+'% loss</td></tr>'+
    '<tr><td>Total revenue</td><td><strong>'+revenue.toFixed(2)+' '+mc+'</strong></td><td class="muted">all the money the buyer will pay you</td></tr>'+
    '<tr><td>Total costs</td><td>'+costs.toFixed(2)+' '+mc+'</td><td class="muted">everything you will spend, added together'+(rows.length?'':' (you have not entered any costs yet)')+'</td></tr>'+
    '<tr><td>Net profit</td><td class="'+cls+'"><strong>'+profit.toFixed(2)+' '+mc+'</strong></td><td class="muted">what remains in your pocket: revenue minus costs</td></tr>'+
    '<tr><td>Profit margin</td><td><strong>'+margin.toFixed(1)+'%</strong></td><td class="muted">out of every 100 you receive, this much is profit</td></tr>'+
    '<tr><td><strong>Break-even price</strong></td><td><strong>'+breakeven.toFixed(2)+' '+mc+' per '+u+'</strong></td><td class="muted">the lowest price you should ever accept — below this you lose money</td></tr>'+
    (target>0?'<tr><td>Price for your '+target+'% target</td><td><strong>'+targetPrice.toFixed(2)+' '+mc+' per '+u+'</strong></td><td class="muted">what to ask the buyer for, to reach your goal</td></tr>':'')+
    '</table>'+ verdict;
};

/* ---------------- readiness score ---------------- */
GEN.READY_ITEMS = [
  {id:"orc", t:"Business registered (ORC)"},
  {id:"tin", t:"TIN / Ghana Card PIN active"},
  {id:"gepa", t:"GEPA exporter registration (current)"},
  {id:"shipper", t:"GSA shipper registration done"},
  {id:"reg", t:"Product regulator sorted (PPRSD / FDA / VSD / GSA-Fish / TCDA)"},
  {id:"cert", t:"Product certification where required"},
  {id:"buyer", t:"Buyer identified"},
  {id:"market", t:"Market researched (GEPA factsheet / destination profile)"},
  {id:"pack", t:"Packaging ready & compliant"},
  {id:"cold", t:"Cold chain / storage sorted"},
  {id:"finance", t:"Export finance arranged"},
  {id:"forwarder", t:"Freight forwarder + clearing agent engaged"},
  {id:"dest", t:"Destination requirements confirmed"}
];

GEN.renderReadiness = function(elId){
  var el = document.getElementById(elId);
  if(!el) return;
  try{ GEN._readyStore = JSON.parse(localStorage.getItem("gen_ready")||"{}") || {}; }catch(e){ GEN._readyStore = {}; }
  var h = '<div class="card"><h3>🎯 Export Readiness Score</h3><p class="muted">Tick what you have. Your score saves on this device.</p><div class="ready-bar"><div class="ready-fill" id="ready-fill"></div></div><div id="ready-list"></div><div class="result-box" id="ready-result"></div><div class="btn-row no-print"><button class="btn small ghost" onclick="GEN.resetReadiness()">Reset</button></div></div>';
  el.innerHTML = h;
  var list = document.getElementById('ready-list');
  var store = GEN._readyStore || {};
  var html = "";
  for(var i=0;i<GEN.READY_ITEMS.length;i++){
    var it = GEN.READY_ITEMS[i];
    html += '<div class="ready-item"><input type="checkbox" id="rd-'+it.id+'" '+(store[it.id]?'checked':'')+' onchange="GEN.tickReadiness(\''+it.id+'\')"><label for="rd-'+it.id+'">'+it.t+'</label></div>';
  }
  list.innerHTML = html;
  GEN.updateReadyScore();
};

GEN.tickReadiness = function(id){
  GEN._readyStore = GEN._readyStore || {};
  GEN._readyStore[id] = document.getElementById('rd-'+id).checked;
  try{ localStorage.setItem("gen_ready", JSON.stringify(GEN._readyStore)); }catch(e){}
  GEN.updateReadyScore();
};

GEN.updateReadyScore = function(){
  var store = GEN._readyStore || {};
  var done = 0;
  for(var i=0;i<GEN.READY_ITEMS.length;i++){ if(store[GEN.READY_ITEMS[i].id]) done++; }
  var pct = Math.round(done/GEN.READY_ITEMS.length*100);
  var fill = document.getElementById('ready-fill');
  if(fill) fill.style.width = pct+'%';
  var res = document.getElementById('ready-result');
  if(!res) return;
  var missing = [];
  for(var j=0;j<GEN.READY_ITEMS.length;j++){ if(!store[GEN.READY_ITEMS[j].id]) missing.push(GEN.READY_ITEMS[j].t); }
  var verdict;
  if(pct===100) verdict = "✅ You are ready to prepare a consignment. Verify current requirements with each agency before shipping — that rule never goes away.";
  else if(pct>=80) verdict = "🟢 Almost ready — close these "+missing.length+" gaps: "+missing.join(" · ");
  else if(pct>=40) verdict = "🟡 Getting there. You cannot safely ship yet — complete these "+missing.length+" items, starting from the top: "+missing.join(" · ");
  else verdict = "🔴 Not ready yet. Start at Stage 1 of your roadmap and work down. Missing: "+missing.slice(0,4).join(" · ")+(missing.length>4?" · …":"");
  res.innerHTML = '<span class="big">'+pct+'% Export Ready</span><p style="margin-top:6px">'+verdict+'</p>';
};

GEN.resetReadiness = function(){
  GEN._readyStore = {};
  try{ localStorage.setItem("gen_ready","{}"); }catch(e){}
  GEN.renderReadiness('gen-readiness');
  GEN.toast("Readiness reset");
};

/* ---------------- rejection solver ---------------- */
GEN.REJECTIONS = [
  {r:"Wrong or missing documentation", now:"Contact your clearing agent immediately — the right document can often be produced same-day. Do not let the shipment 'sort itself out'.", prevent:"Use the Document Checklist; let your agent pre-check every paper before submission."},
  {r:"Missing phytosanitary certificate", now:"Contact PPRSD urgently — the certificate must accompany the consignment; consignments without it are stopped.", prevent:"Build the PPRSD inspection into your timeline at least 1-2 weeks before shipment."},
  {r:"Pest infestation found", now:"Follow the inspector's instructions — treatment may be ordered; in severe cases goods are rejected or treated at your cost.", prevent:"Field management + pre-export inspection; never pack infested produce."},
  {r:"Pesticide residue above limit", now:"The consignment may be rejected or destroyed at destination. Work with the inspector's findings; document everything.", prevent:"Follow approved pesticide schedules and observe pre-harvest intervals; test before shipping where the destination sets MRLs."},
  {r:"Microbiological contamination", now:"Product may be detained/corrected/destroyed. Engage the regulator and, where possible, remedial options at your cost.", prevent:"Licensed facilities, hygiene controls, cold chain discipline; test high-risk products."},
  {r:"Incorrect labelling", now:"Labels can often be corrected/re-done at your cost if detected early — at Ghana side or even at destination in some cases.", prevent:"Follow the packaging checklist exactly; print a sample and get it approved by your buyer."},
  {r:"Wrong packaging", now:"Repack at your cost where permitted; otherwise goods may be rejected.", prevent:"Match buyer spec + destination rules; test one pack before mass production."},
  {r:"Poor quality / grade issues", now:"Refer to the contract's rejection procedure; negotiate re-sorting or discount.", prevent:"Sort and grade against the agreed specification; sample-check each batch."},
  {r:"Temperature abuse in transit", now:"Gather reefer/temperature records; claim on insurance where covered; negotiate with the buyer.", prevent:"Insist on pre-trip inspection, correct set-point in writing, and a temperature logger."},
  {r:"Short shelf life on arrival", now:"Negotiate discount or redirection; learn the transit time lesson.", prevent:"Choose transport mode by shelf life — sea only when the product survives the transit."},
  {r:"Import permit missing at destination", now:"Buyer/importer must obtain it; where impossible, goods may be re-exported/destroyed — costly.", prevent:"Stage 12 card: confirm the destination permit exists BEFORE shipping."},
  {r:"Product prohibited/restricted at destination", now:"Do not ship — confirm with the destination authority first; consult the embassy.", prevent:"Always check the destination's restricted lists before contracting."},
  {r:"Buyer refuses on quality", now:"Invoke the contract's inspection/claims terms; consider inspection certificates as evidence.", prevent:"Third-party inspection at load; samples retained by both sides."},
  {r:"Customs delay (Ghana or destination)", now:"Agent to resolve; keep all documents ready; watch for storage/demurrage costs.", prevent:"Complete ICUMS data and pay attention to cut-off times."},
  {r:"Payment does not arrive", now:"Refer to contract terms; through your bank, pursue documentary collection/LC procedures; consider legal advice for disputes.", prevent:"Advance payment, LC, or partial advance + balance with verified buyers. Never open account with strangers."},
  {r:"Product expires / market lost", now:"Minimise losses: redirect to secondary markets where legal, or process/convert; salvage insurance where covered.", prevent:"Align volumes with confirmed demand; do not produce speculatively for export."}
];

GEN.renderRejectionSolver = function(elId){
  var el = document.getElementById(elId);
  if(!el) return;
  var h = '<div class="card"><h3>🚨 "What if...?" Rejection &amp; Problem Solver</h3>';
  h += '<input class="searchbox" id="rej-search" placeholder="Search a problem (e.g. rejected, delayed, payment...)..." oninput="GEN.filterRejections(this.value)">';
  h += '<div id="rej-list" style="margin-top:10px"></div></div>';
  el.innerHTML = h;
  GEN.filterRejections("");
};

GEN.filterRejections = function(q){
  q = (q||"").toLowerCase();
  var html = "";
  for(var i=0;i<GEN.REJECTIONS.length;i++){
    var it = GEN.REJECTIONS[i];
    if(it.r.toLowerCase().indexOf(q)===-1 && it.now.toLowerCase().indexOf(q)===-1 && it.prevent.toLowerCase().indexOf(q)===-1) continue;
    html += '<div style="border-bottom:1px solid var(--line);padding:10px 0">'+
      '<strong>'+it.r+'</strong>'+
      '<p style="margin-top:4px"><strong>What to do now:</strong> '+it.now+'</p>'+
      '<p><strong>Prevent it next time:</strong> '+it.prevent+'</p></div>';
  }
  if(!html) html = '<p class="muted">No match — try another word, or ask the relevant agency directly (see Offices &amp; Agencies).</p>';
  document.getElementById('rej-list').innerHTML = html;
};

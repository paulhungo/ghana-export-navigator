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

GEN.renderCalc = function(elId, defaults){
  var el = document.getElementById(elId);
  if(!el) return;
  var lines = (defaults && defaults.costLines) ? defaults.costLines : GEN.DEFAULT_COST_LINES;
  var h = '<div class="card"><h3>🧮 Export Profit Calculator</h3>';
  h += '<div class="grid-2">';
  h += '<div><label>Quantity to sell (kg)</label><input type="number" id="c-qty" value="'+(defaults&&defaults.qty?defaults.qty:1000)+'"></div>';
  h += '<div><label>Buyer price per kg (your currency)</label><input type="number" step="0.01" id="c-price" value="'+(defaults&&defaults.price?defaults.price:1.20)+'"></div>';
  h += '</div>';
  h += '<div class="grid-2" style="margin-top:8px"><div><label>Expected loss/spoilage (%)</label><input type="number" id="c-loss" value="5"></div><div><label>Target profit margin (%) — optional</label><input type="number" id="c-target" value="20"></div></div>';
  h += '<p class="muted" style="margin-top:12px"><strong>Your costs</strong> — edit any line to your real figures:</p>';
  h += '<div class="calc-grid" id="c-lines">';
  for(var i=0;i<lines.length;i++){
    var v = (defaults && defaults.costValues && defaults.costValues && defaults.costValues[i]!==undefined) ? defaults.costValues[i] : "";
    h += '<div><label>'+lines[i]+'</label><input type="number" step="0.01" class="c-cost" data-line="'+lines[i]+'" placeholder="0.00" value="'+v+'"></div>';
  }
  h += '</div>';
  h += '<div class="btn-row no-print"><button class="btn" onclick="GEN.runCalc()">Calculate profit &amp; break-even</button></div>';
  h += '<div class="result-box" id="c-result" style="display:none"></div>';
  h += '<div class="verify-line">Numbers are only as good as your inputs — use your real quotations. Currency: use one currency consistently (the exchange rate is yours to enter). Example economics reference GEPA NTE data (US$5.007bn sector, 2025).</div>';
  h += '</div>';
  el.innerHTML = h;
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
  var sellable = q * (1 - loss/100);
  var revenue = p * sellable;
  var profit = revenue - costs;
  var margin = revenue > 0 ? (profit/revenue*100) : 0;
  var breakeven = sellable > 0 ? (costs / sellable) : 0;
  var targetPrice = sellable > 0 ? (costs / sellable) * (1 + target/100) : 0;
  var r = document.getElementById('c-result');
  r.style.display = 'block';
  var cls = profit >= 0 ? '' : ' neg';
  r.innerHTML = '<table style="margin-top:6px">'+
    '<tr><td>Sellable quantity after spoilage</td><td>'+sellable.toFixed(0)+' kg</td></tr>'+
    '<tr><td><strong>Total revenue</strong></td><td><strong>'+revenue.toFixed(2)+'</strong></td></tr>'+
    '<tr><td>Total costs entered</td><td>'+costs.toFixed(2)+'</td></tr>'+
    '<tr><td>Net profit</td><td class="'+cls+'"><strong>'+profit.toFixed(2)+'</strong></td></tr>'+
    '<tr><td>Profit margin</td><td>'+margin.toFixed(1)+'%</td></tr>'+
    '<tr><td><strong>Break-even price per kg</strong></td><td><strong>'+breakeven.toFixed(2)+'</strong> — never accept below this</td></tr>'+
    (target>0?'<tr><td>Price needed for your '+target+'% margin</td><td><strong>'+targetPrice.toFixed(2)+'</strong> per kg</td></tr>':'')+
    '</table>'+
    '<p class="muted" style="margin-top:8px">The same crop can be highly profitable or almost not worth exporting depending on freight, rejection and packaging costs. Model honestly — including a spoilage/rejection allowance.</p>';
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

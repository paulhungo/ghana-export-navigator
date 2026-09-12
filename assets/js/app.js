/* Ghana Agricultural Export Navigator — main app */
window.GEN = window.GEN || {};

GEN.state = null;
GEN._agenciesById = {};
GEN._productsById = {};
GEN._destsById = {};

/* ---------- data helpers ---------- */
GEN.agency = function(id){ return GEN._agenciesById[id] || null; };
GEN.product = function(id){ return GEN._productsById[id]; };
GEN.dest = function(id){ return GEN._destsById[id]; };

GEN.flagBadge = function(c){
  var map = {green:["f-green","🟢 verified"],yellow:["f-yellow","🟡 confirm"],red:["f-red","🔴 warning"]};
  var m = map[c] || map.yellow;
  return '<span class="flag '+m[0]+'">'+m[1]+'</span>';
};

GEN.esc = function(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); };

/* ---------- init ---------- */
GEN.init = function(){
  var ag = window.GEN_AGENCIES, pr = window.GEN_PRODUCTS, ds = window.GEN_DESTINATIONS, up = window.GEN_UPDATES;
  if(!ag || !pr || !ds){ GEN.fatal("Data files did not load."); return; }
  for(var i=0;i<ag.agencies.length;i++){ GEN._agenciesById[ag.agencies[i].id] = ag.agencies[i]; }
  for(var j=0;j<pr.products.length;j++){ GEN._productsById[pr.products[j].id] = pr.products[j]; }
  for(var k=0;k<ds.destinations.length;k++){ GEN._destsById[ds.destinations[k].id] = ds.destinations[k]; }
  GEN._updates = (up && up.updates) ? up.updates : [];

  try{
    var s = JSON.parse(localStorage.getItem("gen_state")||"null");
    if(s && s.productId) GEN.state = s;
  }catch(e){}

  GEN.renderWizard();
  GEN.renderProducts("");
  GEN.renderAgencies();
  GEN.renderMarkets();
  GEN.renderBuyerTypes();
  GEN.renderUpdates();
  GEN.renderTools();
  GEN.renderDirectory();
  GEN.populateDocSelect();
  if(GEN.state) GEN.renderRoadmap();
  window.__genLoaded = true;
};

GEN.fatal = function(msg){
  var b = document.getElementById('errbanner');
  if(b){ b.style.display='block'; b.textContent = '⚠️ '+msg; }
};

/* ---------- router (with back trail) ---------- */
GEN._pageStack = [];
GEN.show = function(page, noStack){
  var cur = document.querySelector('section.page.active');
  if(cur && !noStack){
    var curId = cur.id.replace('page-','');
    if(curId !== page){ GEN._pageStack.push(curId); if(GEN._pageStack.length>25) GEN._pageStack.shift(); }
  }
  var secs = document.querySelectorAll('section.page');
  for(var i=0;i<secs.length;i++){ secs[i].classList.remove('active'); }
  var el = document.getElementById('page-'+page);
  if(el) el.classList.add('active');
  var tabs = document.querySelectorAll('#tabs a');
  for(var t=0;t<tabs.length;t++){ tabs[t].classList.toggle('active', tabs[t].getAttribute('data-page')===page); }
  var bb = document.getElementById('backbtn');
  if(bb) bb.style.display = GEN._pageStack.length ? 'inline-block' : 'none';
  window.scrollTo(0,0);
};
GEN.back = function(){
  var prev = GEN._pageStack.pop();
  GEN.show(prev || 'home', true);
};

/* ---------- wizard ---------- */
GEN.WIZ_Q = ["product","form","quantity","destination","buyer","transport"];
GEN.wiz = {step:0, data:{productId:null, productName:"", category:null, formId:null, formName:"", qty:"", unit:"kg", destId:"uk", buyer:"", transport:"auto"}};

GEN.startWizard = function(prefill){
  GEN.wiz.step = 0;
  GEN.wiz.data = prefill ? JSON.parse(JSON.stringify(prefill)) : {productId:null, productName:"", category:null, formId:null, formName:"", qty:"", unit:"kg", destId:"uk", buyer:"", transport:"auto"};
  GEN.show('home');
  GEN.renderWizard();
};

GEN.renderWizard = function(){
  var w = document.getElementById('wizard');
  var d = GEN.wiz.data, s = GEN.wiz.step;
  var prog = '<div class="wiz-progress">';
  for(var i=0;i<GEN.WIZ_Q.length;i++){ prog += '<span class="'+(i<s?'done':(i===s?'cur':''))+'"></span>'; }
  prog += '</div>';

  var q = GEN.WIZ_Q[s], body = "", canNext = false;

  if(q==="product"){
    body = '<div class="wiz-q">1 · What do you want to export?</div><div class="wiz-hint">Tap your product, or scroll down and type any other product.</div><div class="chips" id="w-chips"></div>';
    if(d.productId) canNext = true;
  }
  else if(q==="form"){
    var p = GEN.product(d.productId);
    if(d.productId && p){
      body = '<div class="wiz-q">2 · Which form?</div><div class="wiz-hint">The form changes the regulatory path — choose what you are actually exporting.</div><div class="chips" id="w-chips">';
      for(var f=0;f<p.forms.length;f++){ body += '<div class="chip'+(d.formId===p.forms[f].id?' sel':'')+'" onclick="GEN.wizPickForm(\''+p.forms[f].id+'\')">'+GEN.esc(p.forms[f].name)+'</div>'; }
      body += '</div>';
      if(d.formId) canNext = true;
    } else {
      body = '<div class="wiz-q">2 · What kind of product is "'+GEN.esc(d.productName)+'"?</div><div class="wiz-hint">Pick the closest category — the navigator routes each type differently. You will confirm the exact requirement with the agency (the roadmap flags it).</div><div class="chips">'+
      '<div class="chip'+(d.category==='fresh_plant'?' sel':'')+'" onclick="GEN.wizPickCat(\'fresh_plant\')">🌱 Fresh plant product (fruit, vegetable, root, herb)</div>'+
      '<div class="chip'+(d.category==='processed'?' sel':'')+'" onclick="GEN.wizPickCat(\'processed\')">🥫 Processed / packaged food</div>'+
      '<div class="chip'+(d.category==='tree_crop'?' sel':'')+'" onclick="GEN.wizPickCat(\'tree_crop\')">🌴 Tree crop (coconut, cashew, shea, mango, oil palm, rubber)</div>'+
      '<div class="chip'+(d.category==='animal'?' sel':'')+'" onclick="GEN.wizPickCat(\'animal\')">🐄 Animal product (meat, eggs, dairy, live animals)</div>'+
      '<div class="chip'+(d.category==='fish'?' sel':'')+'" onclick="GEN.wizPickCat(\'fish\')">🐟 Fish / fishery product</div>'+
      '<div class="chip'+(d.category==='cocoa'?' sel':'')+'" onclick="GEN.wizPickCat(\'cocoa\')">🍫 Cocoa</div></div>';
      if(d.category) canNext = true;
    }
  }
  else if(q==="quantity"){
    body = '<div class="wiz-q">3 · How much are you exporting?</div><div class="wiz-hint">Some products are WEIGHED (kg, tonnes), some are COUNTED one-by-one (pieces, heads, tubers, birds), and some are PACKED (crates, cartons, bags, punnets). Choose the unit you will sell in — an honest number beats a hopeful one.</div>'+
      '<input class="wiz-input" type="number" id="w-qty" placeholder="Quantity (e.g. 5)" value="'+GEN.esc(d.qty)+'" oninput="GEN.wizQty(this.value)">'+
      '<select class="wiz-input" id="w-unit" onchange="GEN.wizUnit(this.value)">'+
      ['kg','tonnes','pieces (counted one-by-one)','heads (live animals)','birds','crates','cartons','boxes','bags / sacks','baskets','trays','punnets','dozens','tubers','bunches / stems','bottles','jars','drums','litres','other unit'].map(function(u){return '<option '+(d.unit===u?'selected':'')+'>'+u+'</option>';}).join('')+'</select>';
    if(d.qty && parseFloat(d.qty)>0) canNext = true;
  }
  else if(q==="destination"){
    var dests = window.GEN_DESTINATIONS.destinations;
    body = '<div class="wiz-q">4 · Where is it going?</div><div class="wiz-hint">The destination country adds its own requirements — you must satisfy both Ghana and the destination. The navigator covers markets worldwide.</div><div class="chips">';
    for(var i2=0;i2<dests.length;i2++){ body += '<div class="chip'+(d.destId===dests[i2].id?' sel':'')+'" onclick="GEN.wizDest(\''+dests[i2].id+'\')">'+dests[i2].flag+' '+GEN.esc(dests[i2].name)+'</div>'; }
    body += '</div>';
    canNext = true;
  }
  else if(q==="buyer"){
    body = '<div class="wiz-q">5 · Do you have a buyer?</div><div class="wiz-hint">Never ship without agreed commercial terms. If you need a buyer, the roadmap includes the Find-Buyer plan.</div><div class="chips">'+
      '<div class="chip'+(d.buyer==='have'?' sel':'')+'" onclick="GEN.wizBuyer(\'have\')">I have a buyer</div>'+
      '<div class="chip'+(d.buyer==='need'?' sel':'')+'" onclick="GEN.wizBuyer(\'need\')">I need a buyer</div></div>';
    if(d.buyer) canNext = true;
  }
  else if(q==="transport"){
    body = '<div class="wiz-q">6 · How will it travel?</div><div class="wiz-hint">If you don\'t know, the navigator recommends based on product, quantity, shelf life and destination.</div><div class="chips">'+
      '<div class="chip'+(d.transport==='auto'?' sel':'')+'" onclick="GEN.wizTransport(\'auto\')">I don\'t know — recommend for me</div>'+
      '<div class="chip'+(d.transport==='sea'?' sel':'')+'" onclick="GEN.wizTransport(\'sea\')">Sea (Tema)</div>'+
      '<div class="chip'+(d.transport==='air'?' sel':'')+'" onclick="GEN.wizTransport(\'air\')">Air (Kotoka)</div>'+
      '<div class="chip'+(d.transport==='road'?' sel':'')+'" onclick="GEN.wizTransport(\'road\')">Road / ECOWAS border</div></div>';
    canNext = true;
  }

  var nav = '<div class="wiz-nav no-print">'+
    (s>0?'<button class="btn small ghost" onclick="GEN.wizBack()">← Back</button>':'<span></span>')+
    '<button class="btn" '+(canNext?'':'disabled')+' onclick="GEN.wizNext()">'+(s===GEN.WIZ_Q.length-1?'Generate my roadmap →':'Next →')+'</button></div>'+
    '<p class="error-msg" id="wiz-err">Choose an option first.</p>';

  w.innerHTML = prog + body + nav;
  if(q==="product") GEN.wizChips(d.productId||"");
};

GEN.wizChips = function(filter){
  filter = (filter||"").toLowerCase();
  var el = document.getElementById('w-chips');
  if(!el) return;
  var html = "";
  var prods = window.GEN_PRODUCTS.products;
  for(var i=0;i<prods.length;i++){
    var p = prods[i];
    if(filter && (p.name+" "+p.category).toLowerCase().indexOf(filter)===-1) continue;
    html += '<div class="chip'+(GEN.wiz.data.productId===p.id?' sel':'')+'" onclick="GEN.wizPick(\''+p.id+'\')">'+p.icon+' '+GEN.esc(p.name)+'</div>';
  }
  html += '<div class="chip gold'+(GEN.wiz.data.productId==="__custom"?' sel':'')+'" onclick="GEN.wizCustom()">✍️ Other / not listed</div>';
  var custom = filter && GEN.wiz.data.productId==="__custom";
  if(custom) html += '<input class="wiz-input" id="w-custom-name" placeholder="Type your product name..." value="'+GEN.esc(GEN.wiz.data.productName)+'" oninput="GEN.wizCustomName(this.value)">';
  el.innerHTML = html;
};

GEN.wizPick = function(id){
  var p = GEN.product(id);
  GEN.wiz.data.productId = p.id;
  GEN.wiz.data.productName = p.name;
  GEN.wiz.data.category = p.category;
  GEN.wiz.data.formId = p.forms.length===1 ? p.forms[0].id : null;
  GEN.wiz.data.formName = p.forms.length===1 ? p.forms[0].name : "";
  GEN.renderWizard();
};

GEN.wizCustom = function(){
  GEN.wiz.data.productId = "__custom";
  GEN.wiz.data.productName = "";
  GEN.wiz.data.formId = null;
  GEN.renderWizard();
};

GEN.wizCustomName = function(v){ GEN.wiz.data.productName = v; };

GEN.wizPickForm = function(fid){
  var p = GEN.product(GEN.wiz.data.productId);
  for(var i=0;i<p.forms.length;i++){
    if(p.forms[i].id===fid){ GEN.wiz.data.formId = fid; GEN.wiz.data.formName = p.forms[i].name; }
  }
  GEN.renderWizard();
};

GEN.wizPickCat = function(cat){
  GEN.wiz.data.category = cat;
  GEN.wiz.data.formName = GEN.wiz.data.productName;
  GEN.renderWizard();
};

GEN.wizQty = function(v){ GEN.wiz.data.qty = v; var n=document.querySelector('#wizard .btn'); if(n) n.disabled = !(v && parseFloat(v)>0); };
GEN.wizUnit = function(v){ GEN.wiz.data.unit = v; };
GEN.wizDest = function(id){ GEN.wiz.data.destId = id; GEN.renderWizard(); };
GEN.wizBuyer = function(v){ GEN.wiz.data.buyer = v; GEN.renderWizard(); };
GEN.wizTransport = function(v){ GEN.wiz.data.transport = v; GEN.renderWizard(); };

GEN.wizNext = function(){
  GEN.wiz.step++;
  if(GEN.wiz.step >= GEN.WIZ_Q.length){ GEN.generate(); return; }
  GEN.renderWizard();
};
GEN.wizBack = function(){ GEN.wiz.step = Math.max(0, GEN.wiz.step-1); GEN.renderWizard(); };

/* ---------- roadmap generation ---------- */
GEN.generate = function(){
  var d = GEN.wiz.data;
  if(!d.productId && !d.productName){ GEN.toast("Choose or type a product first"); return; }
  if(!d.formName && d.productId && GEN.product(d.productId)){ GEN.toast("Choose the form first"); return; }
  if(!d.formName && d.productId==="__custom"){ d.formName = d.productName; }
  GEN.state = JSON.parse(JSON.stringify(d));
  try{ localStorage.setItem("gen_state", JSON.stringify(GEN.state)); }catch(e){}
  GEN.renderRoadmap();
  GEN.show('roadmap');
};

GEN.renderRoadmap = function(){
  var s = GEN.state;
  var holder = document.getElementById('roadmap-holder');
  if(!s){ holder.innerHTML = '<div class="card"><h3>No roadmap yet</h3><p class="muted">Answer the 6 questions on the Home page to generate your export roadmap.</p><div class="btn-row"><button class="btn" onclick="GEN.show(\'home\')">Start the wizard</button></div></div>'; return; }

  var p = GEN.product(s.productId);
  var isCustom = s.productId==="__custom";
  var cat = s.category;
  var pathway = window.GEN_PATHWAYS[cat] || window.GEN_PATHWAYS.special;
  var prodClassMap = {fresh_plant:"plant", processed:"processed", animal:"animal", fish:"fish", tree_crop:"plant", cocoa:"processed", special:"processed"};
  var prodClass = prodClassMap[cat] || "processed";
  var dest = GEN.dest(s.destId) || GEN.dest("other");
  var name = isCustom ? (s.productName||"Your product") : p.name + " — " + s.formName;
  var icon = isCustom ? "📦" : p.icon;

  /* transport recommendation */
  var routeMode = s.transport;
  var autoNote = "";
  if(routeMode==="auto"){
    var q = parseFloat(s.qty)||0;
    if(s.destId==="ecowas" && !isCustom && cat!=="fish") routeMode = "road";
    else if((cat==="fish"||cat==="animal") && s.formName.toLowerCase().indexOf("frozen")>-1) routeMode = "sea";
    else if(cat==="fresh_plant" && q>0 && q<=1000 && (s.destId!=="ecowas")) routeMode = "air";
    else routeMode = "sea";
    autoNote = "🟡 Recommended based on product, quantity, destination and shelf life. Confirm final mode and price with your freight forwarder — air is faster but costs much more; sea is cheaper but slower.";
  }

  var route = pathway.route[routeMode] || pathway.route.sea;
  var routeTitle = routeMode==="sea"?"Sea route — Tema Port":(routeMode==="air"?"Air route — Kotoka International Airport":"Road route — ECOWAS border");

  var tcdaNeeded = !isCustom && p.tcda;
  var hs = isCustom ? "To be confirmed with your clearing agent" : p.hs;

  /* --- hero --- */
  var h = '<div class="hero-roadmap"><h2>'+icon+' YOUR EXPORT ROADMAP</h2><div style="font-family:Georgia,serif;font-size:1.25rem">'+GEN.esc(name)+'</div>';
  h += '<div class="facts"><div>Product: '+GEN.esc(isCustom?s.productName:p.name)+'</div>';
  if(!isCustom && s.formName) h += '<div>Form: '+GEN.esc(s.formName)+'</div>';
  h += '<div>Quantity: '+GEN.esc(s.qty)+' '+GEN.esc(s.unit)+'</div>';
  h += '<div>Destination: '+GEN.esc(dest.name)+'</div>';
  h += '<div>Buyer: '+GEN.esc(s.buyer==="have"?"Buyer identified":"Buyer needed — see Find Buyers")+'</div>';
  h += '<div>Export classification: '+GEN.esc(pathway.label)+'</div></div>';
  if(autoNote) h += '<div style="margin-top:10px;background:rgba(255,255,255,.15);border-radius:10px;padding:10px 12px;font-size:.9rem">'+autoNote+'</div>';
  h += '<div class="btn-row no-print"><button class="btn gold" onclick="GEN.shareRoadmap()">📲 Share roadmap (WhatsApp)</button><button class="btn" onclick="GEN.printPage()">🖨️ Print / Save as PDF pack</button><button class="btn ghost" style="border-color:#fff;color:#fff" onclick="GEN.toggleGroup()">'+
      (GEN._groupMode?'👥 Group mode: ON':'👥 Farm-group mode')+'</button><button class="btn ghost" style="border-color:#fff;color:#fff" onclick="GEN.startWizard()">↻ Change answers</button></div></div>';

  /* --- registration --- */
  h += '<div class="roadmap-grid">';
  h += '<div class="card"><h3>📋 Ghana registration <span class="flag f-yellow">🟡 confirm fees</span></h3><ul class="check">'+
    '<li>Business registration — ORC</li><li>Tax identification (TIN / Ghana Card PIN) — GRA</li>'+
    '<li>GEPA exporter registration (annual renewal)</li><li>GSA shipper registration (Act 1122 / ICUMS)</li>'+
    (tcdaNeeded?'<li>🟡 TCDA registration &amp; licensing — REQUIRED for '+GEN.esc(p.name)+'</li>':'')+
    (cat==="animal"?'<li>VSD exporter registration (animals/animal products)</li>':'')+
    (cat==="fish"?'<li>GSA Fish Inspection exporter registration</li>':'')+
    '</ul><div class="verify-line">Applies to every exporter regardless of product · see Stage cards 1-4.</div></div>';

  h += '<div class="card"><h3>🏛️ Product regulators</h3><ul class="check">';
  for(var ri=0;ri<pathway.regulatorIds.length;ri++){
    var a = GEN.agency(pathway.regulatorIds[ri]);
    if(a) h += '<li>'+GEN.esc(a.name)+' — '+GEN.esc(a.role.split(".")[0])+'</li>';
  }
  h += '<li>GRA Customs — declaration (ICUMS), inspection and release</li></ul>';
  if(!isCustom && p.destinationNotes && p.destinationNotes[dest.id]) h += '<p class="muted" style="margin-top:6px">Destination note ('+GEN.esc(dest.name)+'): '+GEN.esc(p.destinationNotes[dest.id])+'</p>';
  h += '</div>';

  h += '<div class="card"><h3>📜 Certificates</h3><ul class="check">';
  var certs = isCustom ? pathway.coreCerts : (p.certificates || pathway.coreCerts);
  for(var c=0;c<certs.length;c++){ h += '<li>'+GEN.esc(certs[c])+'</li>'; }
  h += '</ul><div class="verify-line">Certificates are per consignment — fresh ones are needed for every shipment.</div></div>';

  h += '<div class="card"><h3>📦 Packaging &amp; labelling</h3><ul class="check">';
  var pack = isCustom ? ["Supplier information and country of supply","Net weight","Product batch","Storage temperature","Handling instructions","Destination-specific labelling — confirm with buyer"] : (p.packaging || []);
  for(var pk=0;pk<pack.length;pk++){ h += '<li>'+GEN.esc(pack[pk])+'</li>'; }
  h += '</ul><div class="verify-line">🟡 Destination markets can add requirements (language, elements) — confirm with the destination profile below.</div></div>';

  h += '<div class="card"><h3>❄️ Storage &amp; cold chain</h3><ul class="check">';
  var st = isCustom ? [pathway.storage] : (p.storage && p.storage.length ? p.storage.concat([pathway.storage]) : [pathway.storage]);
  for(var st2=0;st2<st.length;st2++){ h += '<li>'+GEN.esc(st[st2])+'</li>'; }
  h += '</ul>';
  h += '<p class="muted" style="margin-top:6px">Temperature: '+GEN.esc(isCustom?"Confirm per product and buyer":(p.temperature||"Confirm per product and buyer"))+'</p></div>';

  /* route card */
  h += '<div class="card"><h3>🚢 Export route — '+GEN.esc(routeTitle)+'</h3><ul class="route">';
  for(var r2=0;r2<route.length;r2++){ h += '<li>'+GEN.esc(route[r2])+'</li>'; }
  h += '</ul><div class="verify-line">'+GEN.esc(pathway.chainNote)+'</div></div>';

  /* destination card */
  var dp = dest.byClass[prodClass] || dest.byClass.processed;
  h += '<div class="card"><h3>🌍 Destination — '+GEN.esc(dest.flag+' '+dest.name)+' '+GEN.flagBadge(dest.confidence)+'</h3>'+
    '<p class="muted" style="margin-bottom:8px">These are the kinds of rules your importer faces. Confirm the exact current rules with the destination authority before contracting.</p><ul class="check">';
  for(var d2=0;d2<dp.requirements.length;d2++){ h += '<li>'+GEN.esc(dp.requirements[d2])+'</li>'; }
  h += '</ul><p style="margin-top:6px"><strong>Certificates typically needed at destination:</strong> '+GEN.esc(dp.certificates.join(" · "))+'</p>';
  h += '<p class="muted" style="margin-top:6px">Customs: '+GEN.esc(dest.general.customs)+'</p>';
  for(var n2=0;n2<dest.general.notes.length;n2++){ h += '<p class="muted">'+GEN.esc(dest.general.notes[n2])+'</p>'; }
  h += '<p class="muted" style="margin-top:6px">Official systems to trust for this destination: '+GEN.esc((dest.tier2sources||["Contact the destination country's embassy or trade authority"]).join(" · "))+'</p>';
  h += '<div class="verify-line">Requirement profile reviewed '+GEN.esc(dest.lastVerified)+' — confirm specifics with the destination authority before shipping.</div></div>';

  /* buyer card */
  h += '<div class="card"><h3>🤝 Buyer resources</h3>';
  if(s.buyer==="need"){
    h += '<div class="notice">You told us you need a buyer. Do <strong>not</strong> grow first and hope. Use the Find Buyers page: GEPA buyer resources, trade fairs, importer directories, embassy commercial sections. Agree the contract BEFORE production.</div>';
  } else {
    h += '<p class="muted">You have a buyer — make sure the signed contract covers price, currency, Incoterm, inspection, insurance, payment method, documents, rejection procedure and customs responsibility (full list in the Export Process page).</p>';
  }
  var bts = isCustom ? ["Importer","Distributor","Processor","Wholesaler"] : p.buyerTypes;
  h += '<div style="margin-top:8px">';
  for(var b3=0;b3<bts.length;b3++){ h += '<span class="pill">'+GEN.esc(bts[b3])+'</span>'; }
  h += '</div><div class="btn-row no-print"><button class="btn small ghost" onclick="GEN.show(\'buyers\')">Open Find Buyers</button></div></div>';

  h += '</div>'; /* roadmap-grid */

  /* costs */
  var defs = null;
  if(!isCustom && p.profitability){
    defs = {qty: parseFloat(s.qty)||0, price: (p.profitability.example&&p.profitability.example.buyerPrice)||"", costLines: p.profitability.costLines, unit: "kg", currency: (p.profitability.unit && p.profitability.unit.indexOf("USD")>-1) ? "USD" : "GHS"};
  }
  GEN._calcDefaults = defs;
  h += '<div id="gen-calc"></div>';
  h += '<div id="gen-readiness-2"></div>';
  h += '<div class="card"><h3>💰 Banking &amp; export proceeds <span class="flag f-yellow">🟡 confirm with your bank</span></h3>'+
    '<p class="muted">The buyer pays per your contract: <strong>advance payment</strong> (safest for you), <strong>letter of credit</strong> (bank guarantees against documents), <strong>documentary collection</strong>, <strong>open account</strong> (riskiest), or <strong>partial advance + balance</strong> (e.g. 30/70).</p>'+
    '<p class="muted" style="margin-top:6px">Ghana\'s repatriation rules apply to export proceeds — route payments through your commercial bank, complete the Bank of Ghana foreign-exchange documentation (including the Letter of Commitment referenced in customs declarations), and keep records. Never use informal channels.</p>'+
    '<div class="verify-line">Bank of Ghana notice on Letters of Commitment: September 2026 · GRA customs FAQ references the FX form · confirm current rules with your bank and BoG.</div></div>';

  /* stages */
  h += '<div style="margin:22px 0 10px"><h2 class="page-title">Your step-by-step journey</h2><p class="page-sub">Do these stages in order. Each card: what it is · who/where · what to carry · exactly what to do · what you receive · what can go wrong · what is next.</p></div>';
  h += '<div id="stages-holder">'+GEN.renderStages(cat, tcdaNeeded, isCustom)+'</div>';

  /* freshness */
  var verified = isCustom ? "2026-09-10 (category pathway)" : p.lastVerified;
  h += '<div class="card"><h3>🧾 Information freshness</h3><p><strong>Information last verified:</strong> '+GEN.esc(verified)+' &nbsp;·&nbsp; <strong>Official sources:</strong> '+
    (isCustom? "The agencies named in your stage cards" : "PPRSD · FDA · TCDA · GSA · GRA · GEPA · Ghana Shippers\' Authority (see Offices &amp; Agencies)")+
    ' &nbsp;·&nbsp; Source tier: Ghana regulator (Tier 1) + destination government (Tier 2).</p>'+
    '<p class="muted" style="margin-top:6px">This roadmap is a regulatory/export framework guide — not a legal opinion. For a live shipment, verify the current requirement with the relevant regulator and the destination-country authority: permits, fees, restrictions and market-access conditions can change.</p></div>';

  holder.innerHTML = h;
  GEN.renderCalc('gen-calc', defs);
  GEN.renderReadinessInline();
};

/* readiness score card inside the roadmap */
GEN.renderReadinessInline = function(){
  GEN.renderReadiness('gen-readiness-2');
};

/* ---------- products page ---------- */
GEN.renderStages = function(cat, tcdaNeeded, isCustom){
  var pathway = window.GEN_PATHWAYS[cat] || window.GEN_PATHWAYS.special;
  var order = ["stage-business","stage-tax","stage-gepa","stage-gsa-shipper"];
  order = order.concat(pathway.extraStageIds);
  order = order.concat(["stage-packaging","stage-buyer","stage-freight","stage-certificates","stage-port","stage-arrival","stage-payment","stage-records"]);

  var group = GEN._groupMode;
  var names = GEN._groupNames || {};
  var out = "";
  var i = 0;
  for(var s=0;s<order.length;s++){
    var tpl = window.GEN_STAGE_TEMPLATES[order[s]];
    if(!tpl) continue;
    if(order[s]==="stage-tcda" && !tcdaNeeded && !isCustom) continue;
    if((order[s]==="stage-tcda"||order[s]==="stage-tcda-permit") && cat!=="tree_crop") continue;
    i++;
    out += GEN.stageCard(tpl, i, group, names);
  }
  return out;
};

GEN.stageCard = function(tpl, idx, group, names){
  var h = '<div class="card stage"><div class="stage-no">'+tpl.n+'</div><h3>'+GEN.esc(tpl.title);
  if(group && tpl.role) h += ' <span class="pill gold">'+GEN.esc(tpl.role)+'</span>';
  h += '</h3>';
  h += '<p class="muted">'+GEN.esc(tpl.plain)+'</p>';
  if(tpl.analogy) h += '<p style="margin-top:4px"><em>💡 '+GEN.esc(tpl.analogy)+'</em></p>';
  h += '<dl>';
  if(tpl.agencyId){
    var a = GEN.agency(tpl.agencyId);
    if(a){
      h += '<dt>Who &amp; where</dt><dd><strong>'+GEN.esc(a.name)+'</strong><br>'+GEN.esc(a.address)+(a.digitalAddress?' · '+GEN.esc(a.digitalAddress):'')+(a.phone?'<br>☎ '+GEN.esc(a.phone):'')+(a.email?' · '+GEN.esc(a.email):'')+(a.hours?'<br>🕒 '+GEN.esc(a.hours):'')+'</dd>';
      var carry = GEN.tokenList(tpl.carry);
      if(carry && carry.length) h += '<dt>What to carry</dt><dd>'+GEN.listHtml(carry)+'</dd>';
      if(a.fees && a.fees.text) h += '<dt>Fees</dt><dd>'+GEN.esc(a.fees.text)+' '+GEN.flagBadge(a.fees.confidence)+'</dd>';
      if(a.processingTime) h += '<dt>Processing time</dt><dd>'+GEN.esc(a.processingTime)+'</dd>';
    }
  }
  h += '<dt>What to do</dt><dd>'+GEN.listHtml(tpl.steps)+'</dd>';
  h += '<dt>You receive</dt><dd>'+GEN.esc(tpl.youGet||"")+'</dd>';
  if(tpl.check) h += '<dt>Check before leaving</dt><dd>'+GEN.listHtml(tpl.check)+'</dd>';
  if(tpl.pitfalls) h += '<dt>What can go wrong</dt><dd>'+GEN.listHtml(tpl.pitfalls)+'</dd>';
  h += '</dl>';
  h += '<div class="what-next">➡️ <strong>Next:</strong> '+GEN.esc(tpl.next)+'</div>';
  if(group && tpl.role && names[tpl.role]) h += '<p style="margin-top:6px" class="muted">Assigned: <strong>'+GEN.esc(names[tpl.role])+'</strong></p>';
  h += '</div>';
  return h;
};

GEN.tokenList = function(token){
  if(!token) return null;
  var parts = token.split(".");
  var obj = GEN.agency(parts[0]);
  if(!obj) return null;
  return obj[parts[1]] || null;
};
GEN.listHtml = function(arr){
  var h = "<ul>";
  for(var i=0;i<arr.length;i++) h += "<li>"+arr[i]+"</li>";
  return h+"</ul>";
};

GEN.toggleGroup = function(){
  GEN._groupMode = !GEN._groupMode;
  if(GEN._groupMode && !GEN._groupNames){
    var n = prompt("Farm-group mode: enter names for each role, separated by commas, in this order:\nOwner/Leader, Treasurer, Quality person, Transporter, Buyer contact", "");
    if(n){
      var parts = n.split(",");
      GEN._groupNames = {"Owner":(parts[0]||"").trim(),"Treasurer":(parts[1]||"").trim(),"Quality person":(parts[2]||"").trim(),"Transporter":(parts[3]||"").trim(),"Buyer":(parts[4]||"").trim()};
    }
  }
  GEN.renderRoadmap();
  GEN.toast(GEN._groupMode ? "Farm-group mode ON — roles shown on every stage" : "Farm-group mode OFF");
};

/* ---------- products page ---------- */
GEN.renderProducts = function(filter){
  var el = document.getElementById('products-grid');
  if(!el) return;
  var prods = window.GEN_PRODUCTS.products;
  var html = "";
  for(var i=0;i<prods.length;i++){
    var p = prods[i];
    if(filter && filter.length && (p.name+" "+p.category).toLowerCase().indexOf(filter.toLowerCase())===-1) continue;
    var formTags = "";
    for(var f=0;f<Math.min(p.forms.length,3);f++){ formTags += '<span class="pill">'+GEN.esc(p.forms[f].name)+'</span>'; }
    if(p.forms.length>3) formTags += '<span class="pill">+'+(p.forms.length-3)+' more</span>';
    html += '<div class="card" style="cursor:pointer" onclick="GEN.launch(\''+p.id+'\')"><h3>'+p.icon+' '+GEN.esc(p.name)+'</h3><div>'+formTags+'</div><p class="muted" style="margin-top:8px;font-size:.85rem">'+GEN.esc(p.forms[0].note)+'</p><div class="btn-row no-print"><button class="btn small">Build roadmap →</button></div></div>';
  }
  el.innerHTML = html || '<p class="muted">No product matches that name — type it in "Any other product" below.</p>';
};

GEN.filterProducts = function(v){ GEN.renderProducts(v); };

GEN.launch = function(id){
  GEN.startWizard(null);
  GEN.wiz.step = 1;
  GEN.wizPick(id);
  if(GEN.product(id).forms.length===1){ GEN.wiz.step = 2; GEN.renderWizard(); }
};

GEN.startCustomProduct = function(){
  var name = document.getElementById('custom-product-name').value.trim();
  if(!name){ GEN.toast("Type your product name first"); return; }
  GEN.startWizard(null);
  GEN.wiz.data.productId = "__custom";
  GEN.wiz.data.productName = name;
  GEN.wiz.step = 1;
  GEN.renderWizard();
};

/* ---------- agencies page ---------- */
GEN.renderAgencies = function(){
  var el = document.getElementById('agencies-holder');
  var ags = window.GEN_AGENCIES.agencies;
  var h = "";
  for(var i=0;i<ags.length;i++){
    var a = ags[i];
    h += '<div class="card"><h3>'+GEN.esc(a.name)+' '+GEN.flagBadge(a.confidence)+'</h3><p class="muted">'+GEN.esc(a.role)+'</p><dl style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin-top:8px;font-size:.95rem">';
    h += '<dt>📍 Address</dt><dd>'+GEN.esc(a.address)+(a.digitalAddress?' · '+GEN.esc(a.digitalAddress):'')+'</dd>';
    if(a.phone) h += '<dt>☎ Phone</dt><dd>'+GEN.esc(a.phone)+'</dd>';
    if(a.email) h += '<dt>✉ Email</dt><dd>'+GEN.esc(a.email)+'</dd>';
    if(a.website) h += '<dt>🌐 Website</dt><dd><a href="'+GEN.esc(a.website)+'" target="_blank" rel="noopener">'+GEN.esc(a.website.replace(/^https?:\/\//,''))+'</a></dd>';
    if(a.portal) h += '<dt>🖥 Portal</dt><dd>'+GEN.esc(a.portal)+'</dd>';
    if(a.hours) h += '<dt>🕒 Hours</dt><dd>'+GEN.esc(a.hours)+'</dd>';
    if(a.fees && a.fees.text) h += '<dt>💰 Fees</dt><dd>'+GEN.esc(a.fees.text)+' '+GEN.flagBadge(a.fees.confidence)+'</dd>';
    if(a.processingTime) h += '<dt>⏱ Processing</dt><dd>'+GEN.esc(a.processingTime)+'</dd>';
    if(a.renewal) h += '<dt>🔄 Renewal</dt><dd>'+GEN.esc(a.renewal)+'</dd>';
    h += '</dl>';
    var sv = "";
    for(var s2=0;s2<a.services.length;s2++){ sv += '<span class="pill">'+GEN.esc(a.services[s2])+'</span>'; }
    h += '<div style="margin-top:8px">'+sv+'</div>';
    if(a.whatToBring && a.whatToBring.length) h += '<p style="margin-top:8px"><strong>What to bring:</strong> '+GEN.esc(a.whatToBring.join(" · "))+'</p>';
    if(a.keyRule) h += '<div class="notice" style="margin-top:8px">'+GEN.esc(a.keyRule)+'</div>';
    h += '<div class="verify-line">Official source: '+GEN.esc(a.source)+' · Information last verified: '+GEN.esc(a.lastVerified)+' '+GEN.flagBadge(a.confidence)+'</div></div>';
  }
  el.innerHTML = h;
};

/* ---------- markets page ---------- */
GEN.renderMarkets = function(){
  var el = document.getElementById('markets-holder');
  var ds = window.GEN_DESTINATIONS.destinations;
  var classNames = {plant:"🌱 Plant products", animal:"🐄 Animal products", fish:"🐟 Fish products", processed:"🥫 Processed foods"};
  var h = "";
  for(var i=0;i<ds.length;i++){
    var d = ds[i];
    h += '<div class="card"><h3>'+d.flag+' '+GEN.esc(d.name)+' '+GEN.flagBadge(d.confidence)+'</h3>';
    if(d.tier2sources) h += '<p class="muted" style="margin-bottom:8px">Tier-2 official sources: '+GEN.esc(d.tier2sources.join(" · "))+'</p>';
    if(d.tier2links && d.tier2links.length){
      h += '<p style="margin-bottom:8px"><strong>Official authority websites:</strong> ';
      for(var t2=0;t2<d.tier2links.length;t2++){
        if(t2>0) h += ' · ';
        h += '<a href="'+GEN.esc(d.tier2links[t2])+'" target="_blank" rel="noopener">'+GEN.esc(d.tier2links[t2].replace(/^https?:\/\//,'').replace(/\/$/,''))+'</a>';
      }
      h += '</p>';
    }
    h += '<details><summary style="cursor:pointer;font-weight:700;color:var(--green)">View requirement profiles</summary><div style="margin-top:10px">';
    for(var k in d.byClass){
      var b = d.byClass[k];
      h += '<p style="margin-top:8px"><strong>'+classNames[k]+'</strong></p><ul class="check">';
      for(var r2=0;r2<b.requirements.length;r2++) h += '<li>'+GEN.esc(b.requirements[r2])+'</li>';
      h += '</ul>';
    }
    h += '</div></details>';
    h += '<p class="muted" style="margin-top:8px">Customs: '+GEN.esc(d.general.customs)+'</p>';
    h += '<div class="verify-line">Information last verified: '+GEN.esc(d.lastVerified)+' · '+GEN.flagBadge(d.confidence)+' — confirm exact rules with the destination authority before contracting.</div></div>';
  }
  el.innerHTML = h;
};

/* ---------- documents page ---------- */
GEN.populateDocSelect = function(){
  var sel = document.getElementById('doc-product-select');
  var prods = window.GEN_PRODUCTS.products;
  var h = '<option value="">— choose a product —</option>';
  for(var i=0;i<prods.length;i++){ h += '<option value="'+prods[i].id+'">'+prods[i].icon+' '+GEN.esc(prods[i].name)+'</option>'; }
  sel.innerHTML = h;
};

GEN.docChecklist = function(pid){
  var p = GEN.product(pid);
  if(!p) return "";
  var groups = [];
  var g1 = ["Business registration certificate (ORC)","Company incorporation documents (if a company)","TIN / Ghana Card PIN","GEPA exporter registration (current)","GSA shipper registration"];
  if(p.tcda) g1.push("TCDA registration/licensing + valid written TCDA export permit");
  if(p.category==="animal") g1.push("VSD exporter registration");
  if(p.category==="fish") g1.push("GSA Fish Inspection exporter registration");
  groups.push({t:"Business & registration", items:g1});
  var g2 = ["Product specification sheet"];
  for(var i=0;i<p.certificates.length;i++){ g2.push(p.certificates[i]); }
  groups.push({t:"Product, regulator & certificates", items:g2});
  groups.push({t:"Shipment", items:["Commercial invoice","Packing list","Export contract / purchase order","Bill of lading OR airway bill","Insurance certificate where applicable","Buyer/importer details","Inspection documents"]});
  groups.push({t:"Financial & banking", items:["Bank account details","Payment evidence / LC documents","Bank of Ghana foreign-exchange form / Letter of Commitment (confirm with your bank)","Proof of export proceeds (keep)"]});
  var h = "";
  for(var g=0;g<groups.length;g++){
    h += '<div class="card"><h3>'+GEN.esc(groups[g].t)+'</h3><ul class="check">';
    for(var it2=0;it2<groups[g].items.length;it2++){ h += '<li>'+GEN.esc(groups[g].items[it2])+'</li>'; }
    h += '</ul></div>';
  }
  h += '<div class="notice green"><strong>🛡️ Golden rule:</strong> verify each item\'s current requirement with the issuing agency — the Offices &amp; Agencies page has every contact.</div>';
  return h;
};

GEN.renderDocChecklist = function(){
  var pid = document.getElementById('doc-product-select').value;
  document.getElementById('docs-holder').innerHTML = pid ? GEN.docChecklist(pid) : '<div class="card"><p class="muted">Choose a product above to generate your export document checklist.</p></div>';
};

/* ---------- directory (institutions, buyer channels, fairs, agent toolkit) ---------- */
GEN.renderDirectory = function(){
  var dir = window.GEN_DIRECTORY;
  if(!dir) return;
  var instH = document.getElementById('directory-inst-holder');
  if(instH){
    var h = "";
    for(var i=0;i<dir.institutions.length;i++){
      var a = dir.institutions[i];
      h += '<div class="card"><h3>'+GEN.esc(a.name)+' '+GEN.flagBadge(a.confidence)+'</h3><p class="muted">'+GEN.esc(a.type)+'</p><p style="margin-top:6px">'+GEN.esc(a.what)+'</p>';
      if(a.contact) h += '<p style="margin-top:6px"><strong>Contact:</strong> '+GEN.esc(a.contact)+'</p>';
      if(a.website) h += '<p><strong>Website:</strong> <a href="'+GEN.esc(a.website)+'" target="_blank" rel="noopener">'+GEN.esc(a.website.replace(/^https?:\/\//,''))+'</a></p>';
      h += '<div class="notice green" style="margin-top:8px"><strong>Use it to:</strong> '+GEN.esc(a.use)+'</div>';
      h += '<div class="verify-line">Information last verified: '+GEN.esc(a.lastVerified)+' · '+GEN.esc(a.source)+'</div></div>';
    }
    instH.innerHTML = h;
  }
  GEN.renderBuyerChannels();
  GEN.renderFairs();
  GEN.renderAgentToolkit();
};

GEN.renderBuyerChannels = function(){
  var el = document.getElementById('buyer-channels-holder');
  var dir = window.GEN_DIRECTORY;
  if(!el || !dir) return;
  var h = '<div class="card"><h3>How to actually reach buyers</h3><table><tr><th>Channel</th><th>How</th></tr>';
  for(var i=0;i<dir.buyerChannels.length;i++){
    var c = dir.buyerChannels[i];
    h += '<tr><td><strong>'+GEN.esc(c.channel)+'</strong> '+GEN.flagBadge(c.confidence)+'</td><td>'+GEN.esc(c.how)+'</td></tr>';
  }
  h += '</table><div class="verify-line">🛡️ Agree commercial terms BEFORE shipping. Verify buyers before credit — see Trust &amp; Scam Alert.</div></div>';
  el.innerHTML = h;
};

GEN.renderFairs = function(){
  var el = document.getElementById('fairs-holder');
  var dir = window.GEN_DIRECTORY;
  if(!el || !dir) return;
  var h = "";
  for(var i=0;i<dir.tradeFairs.length;i++){
    var f = dir.tradeFairs[i];
    h += '<div style="border-bottom:1px solid var(--line);padding:10px 0"><strong>'+GEN.esc(f.name)+'</strong> '+GEN.flagBadge(f.confidence)+
      '<p class="muted" style="margin-top:3px">'+GEN.esc(f.focus)+' · '+GEN.esc(f.place)+'</p>'+
      '<p class="muted">When: '+GEN.esc(f.when)+'</p>';
    if(f.website) h += '<p><a href="'+GEN.esc(f.website)+'" target="_blank" rel="noopener">'+GEN.esc(f.website.replace(/^https?:\/\//,''))+'</a></p>';
    h += '<p style="margin-top:3px">💡 '+GEN.esc(f.note)+'</p></div>';
  }
  el.innerHTML = h;
};

GEN.renderAgentToolkit = function(){
  var el = document.getElementById('agent-toolkit-holder');
  var dir = window.GEN_DIRECTORY;
  if(!el || !dir) return;
  var t = dir.agentToolkit;
  var h = '<div class="card"><h3>Choose a freight forwarder / clearing agent — verification toolkit</h3>';
  h += '<div class="grid-2"><div><h3 style="font-size:1rem">Collect</h3><ul class="check">';
  for(var i=0;i<t.collect.length;i++) h += '<li>'+GEN.esc(t.collect[i])+'</li>';
  h += '</ul></div><div><h3 style="font-size:1rem">Ask</h3><ul class="check">';
  for(var q=0;q<t.questions.length;q++) h += '<li>'+GEN.esc(t.questions[q])+'</li>';
  h += '</ul></div></div>';
  h += '<div class="notice red" style="margin-top:10px"><strong>🔴 Walk away if you see:</strong><br>'+GEN.esc(t.redFlags.join(" · "))+'</div>';
  h += '<div class="verify-line">🛡️ GRA states port clearance requires a licensed clearing agent. Verify licence/membership; compare at least two written quotes; pay only verified company accounts.</div></div>';
  el.innerHTML = h;
  var instEl = document.getElementById('logistics-inst-holder');
  if(instEl){
    var h2 = "";
    for(var j=0;j<dir.institutions.length;j++){
      var a2 = dir.institutions[j];
      if(a2.type==="Industry association" || a2.type==="Government shipping regulator" || a2.type==="Professional body for freight forwarders"){
        h2 += '<span class="pill">'+GEN.esc(a2.name)+'</span>';
      }
    }
    instEl.innerHTML = h2;
  }
};

/* ---------- buyers / updates / tools ---------- */
GEN.renderBuyerTypes = function(){
  var set = {};
  var prods = window.GEN_PRODUCTS.products;
  for(var i=0;i<prods.length;i++){ var b=prods[i].buyerTypes; for(var j=0;j<b.length;j++){ set[b[j]]=1; } }
  var h = "";
  for(var k in set){ h += '<span class="pill">'+GEN.esc(k)+'</span>'; }
  document.getElementById('buyer-types-holder').innerHTML = h;
};

GEN.renderUpdates = function(){
  var el = document.getElementById('updates-holder');
  var ups = (window.GEN_UPDATES && window.GEN_UPDATES.updates) ? window.GEN_UPDATES.updates : [];
  var h = "";
  for(var i=0;i<ups.length;i++){
    var u = ups[i];
    h += '<div class="card"><h3>'+GEN.esc(u.title)+'</h3><p class="muted">'+GEN.esc(u.agency)+' · '+GEN.esc(u.date)+' '+GEN.flagBadge(u.confidence)+'</p><p style="margin-top:8px">'+GEN.esc(u.body)+'</p><div class="notice" style="margin-top:8px"><strong>What to do:</strong> '+GEN.esc(u.action)+'</div><div class="verify-line">Official source: '+GEN.esc(u.officialSource)+'</div></div>';
  }
  el.innerHTML = h || '<p class="muted">No updates loaded.</p>';
};

GEN.renderTools = function(){
  var el = document.getElementById('tools-holder');
  el.innerHTML = '<div id="tools-calc"></div><div id="gen-readiness"></div><div id="gen-rejection"></div>';
  GEN.renderCalc('tools-calc', null);
  GEN.renderReadiness('gen-readiness');
  GEN.renderRejectionSolver('gen-rejection');
};

/* ---------- share roadmap text ---------- */
GEN.shareRoadmap = function(){
  var s = GEN.state;
  if(!s) return;
  var p = GEN.product(s.productId);
  var name = s.productId==="__custom" ? s.productName : p.name+" — "+s.formName;
  var txt = "MY GHANA EXPORT ROADMAP\n"+name+"\nQuantity: "+s.qty+" "+s.unit+" · Destination: "+s.destId.toUpperCase()+"\n\nSTAGES:\n1. Register business (ORC)\n2. TIN (GRA)\n3. GEPA exporter registration\n4. GSA shipper registration\n5. Product regulator (PPRSD/FDA/VSD/GSA/TCDA per product)\n6. Certificates per consignment (phytosanitary/health/FDA permit)\n7. Compliant packaging & labelling\n8. Buyer contract + readiness\n9. Freight forwarder + clearing agent\n10. Customs declaration (ICUMS)\n11. Port/airport & shipment\n12. Destination clearance\n13. Payment via bank (BoG rules)\n14. Keep records\n\nBuilt with the Ghana Agricultural Export Navigator. Verify current requirements with each agency before shipping.";
  GEN.shareText(txt);
};

/* ---------- print current view ---------- */
GEN.printPage = function(){
  var active = document.querySelector('section.page.active');
  if(!active) return;
  active.classList.add('print-target');
  var done = function(){ active.classList.remove('print-target'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(done, 1500);
};

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', function(){
  window.addEventListener('hashchange', function(){
    if(!window.GEN_unlocked) return;
    var pg = (location.hash||"#home").replace('#','');
    if(document.getElementById('page-'+pg)) GEN.show(pg);
  });
  var main = document.querySelector('main');
  var gate = document.getElementById('gate');
  if(gate){
    main.style.display = 'none';
    gate.style.display = 'flex';
    var stored = null;
    try{ stored = localStorage.getItem('gen_pass'); }catch(e){}
    var key = (typeof genGateKey === 'function') ? genGateKey() : null;
    var ok = false;
    if(key !== null){
      ok = genTryUnlock(key);
      if(!ok){
        var ge = document.getElementById('gate-err');
        if(ge){ ge.style.display='block'; ge.textContent='Wrong access code in the link.'; }
      }
    } else if(stored === '1'){
      ok = genTryUnlock(window.GEN_ACCESS_CODE);
    }
    if(!ok) return; /* stays locked */
  } else {
    GEN.init();
  }
  var pg0 = (location.hash||"#home").replace('#','');
  if(document.getElementById('page-'+pg0)) GEN.show(pg0);
});

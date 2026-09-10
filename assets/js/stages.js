/* Ghana Agricultural Export Navigator â€” pathways & stage-card templates */
window.GEN_PATHWAYS = {
  fresh_plant: {
    label: "Agricultural / fresh produce",
    intro: "Your product is a fresh plant product. Ghana's regulators: PPRSD (plant health), FDA (export clearance), plus the common registrations every exporter needs.",
    regulatorIds: ["pprsd", "fda"],
    coreCerts: ["Phytosanitary certificate (PPRSD)","FDA export/clearance permit","Certificate of origin"],
    extraStageIds: ["stage-pprsd", "stage-fda-fresh"],
    route: {sea:["Farm","Packhouse (sorting, grading, packing)","PPRSD field/consignment inspection","FDA export/clearance permit","Truck","Tema Port","Customs (ICUMS declaration)","Reefer container","Vessel","Destination port","Importer customs & inspection","Buyer warehouse"],air:["Farm","Packhouse (sorting, grading, packing)","PPRSD inspection","FDA export/clearance permit","Truck","Kotoka International Airport cargo","Customs (ICUMS declaration)","Airway bill","Aircraft","Destination airport","Importer customs & inspection","Buyer warehouse"],road:["Farm","Aggregation / warehouse","PPRSD inspection","Truck","Land border (customs)","Destination importer"]},
    chainNote: "FDA's fresh-produce guideline (2025): licensed storage facility, per-consignment export/clearance permit, compliant packaging, phytosanitary certificate, temperature records."
  },
  processed: {
    label: "Processed / prepackaged food",
    intro: "Your product is a processed food. FDA requirements become much more extensive (registration of the product where applicable, full labelling, facility requirements). GSA standards may also apply.",
    regulatorIds: ["fda", "gsa"],
    coreCerts: ["FDA export/clearance permit","Certificate of origin","Certificate of analysis where required"],
    extraStageIds: ["stage-fda-processed", "stage-gsa-optional"],
    route: {sea:["Production facility","Quality control & testing","FDA compliance (registration/clearance)","Packing (destination-compliant)","Truck","Tema Port","Customs (ICUMS)","Container","Vessel","Destination port","Importer customs","Buyer warehouse"],air:["Production facility","Quality control & testing","FDA clearance","Packing","Truck","Kotoka Airport cargo","Customs (ICUMS)","Airway bill","Aircraft","Destination airport","Buyer warehouse"],road:["Production facility","Quality control","Warehouse","Truck","Land border (customs)","Destination importer"]},
    chainNote: "Follow FDA's current prepackaged-foods guideline; GSA certification depends on product, destination and buyer."
  },
  animal: {
    label: "Live animals / animal products",
    intro: "Your product involves animals. The Veterinary Services Directorate (VSD) is the central regulator, plus FDA where the product is food, plus destination veterinary rules.",
    regulatorIds: ["vsd", "fda"],
    coreCerts: ["VSD veterinary health certificate","FDA export clearance where applicable","Certificate of origin"],
    extraStageIds: ["stage-vsd", "stage-dest-permit"],
    route: {sea:["Producer / approved facility","VSD inspection, testing, health certificate","FDA clearance (food products)","Truck","Tema Port","Customs (ICUMS)","Reefer container","Vessel","Destination port","Veterinary border checks","Buyer warehouse"],air:["Producer / approved facility","VSD inspection & certification","FDA clearance","Truck","Kotoka Airport cargo","Customs (ICUMS)","Airway bill","Aircraft","Destination airport","Veterinary checks","Buyer warehouse"],road:["Producer","VSD certification","Truck","Land border (veterinary & customs checks)","Destination importer"]},
    chainNote: "Live animals: expect inspection, vaccination records, testing, possible quarantine and approved transport conditions. Meat/eggs/dairy: cold chain + destination establishment approvals."
  },
  fish: {
    label: "Fish / fishery products",
    intro: "Fish is a distinct pathway. GSA Fish Inspection registers exporters and approves establishments â€” for EU-oriented exports the FACILITY itself must be approved, not just the fish.",
    regulatorIds: ["gsa", "fda"],
    coreCerts: ["GSA health certificate","FDA export clearance","Certificate of origin"],
    extraStageIds: ["stage-gsa-fish", "stage-dest-permit"],
    route: {sea:["Landing site (GSA-inspected)","Approved processing plant","GSA consignment inspection & health certificate","FDA clearance","Truck","Tema Port","Customs (ICUMS)","Reefer container","Vessel","Destination port","Import inspection","Buyer warehouse"],air:["Landing site (GSA-inspected)","Approved processing","GSA inspection & health certificate","FDA clearance","Truck","Kotoka Airport cargo","Customs (ICUMS)","Aircraft","Destination airport","Import inspection","Buyer warehouse"],road:["Landing site","Processing","Certification","Truck","Land border (customs)","Destination importer"]},
    chainNote: "GSA registers fish exporters, inspects vessels, processing plants, cold stores, ice plants and consignments â€” and is Ghana's EU Competent Authority for fish products."
  },
  tree_crop: {
    label: "Tree crops (TCDA-regulated)",
    intro: "ðŸ”´ Your crop is regulated by the Tree Crops Development Authority. Since 1 April 2026 you MUST hold a valid written TCDA permit before exporting â€” processed or unprocessed.",
    regulatorIds: ["tcda", "pprsd", "fda"],
    coreCerts: ["Valid written TCDA export permit","Phytosanitary certificate where applicable","Certificate of origin"],
    extraStageIds: ["stage-tcda", "stage-tcda-permit"],
    route: {sea:["Farm","Processing / preparation","TCDA permit (mandatory)","PPRSD/FDA as applicable to the form","Truck","Tema Port","Customs (ICUMS)","Container","Vessel","Destination port","Buyer warehouse"],air:["Farm","Processing / preparation","TCDA permit","PPRSD/FDA as applicable","Truck","Kotoka Airport cargo","Customs (ICUMS)","Aircraft","Destination airport","Buyer warehouse"],road:["Farm","Processing / preparation","TCDA permit","Warehouse","Truck","Land border (customs)","Destination importer"]},
    chainNote: "TCDA regulates cashew, shea, mango, coconut, rubber and oil palm. Registration/licensing per crop + export permit. Accra: Tsatse Dzani St, Adjiringanor, GD-253-5536 Â· 030 398 1790 Â· info@tcda.gov.gh"
  },
  cocoa: {
    label: "Cocoa",
    intro: "Cocoa follows the COCOBOD system â€” a separate regulated sector with its own licensing and quality rules.",
    regulatorIds: ["cocobod"],
    coreCerts: ["COCOBOD licensing/quality compliance","Certificate of origin"],
    extraStageIds: ["stage-cocobod"],
    route: {sea:["Farm","Licensed buying channel","COCOBOD quality system","Customs (ICUMS)","Tema Port","Vessel","Destination port","Buyer"],road:["Farm","Licensed buying channel","COCOBOD quality system","Truck","Land border","Buyer"],air:["Farm","Licensed channel","COCOBOD system","Kotoka Airport","Aircraft","Destination"]},
    chainNote: "Confirm current COCOBOD licensing and quality requirements directly â€” cocoa has its own rules."
  },
  special: {
    label: "Special products",
    intro: "Special products are routed by what the product actually is. The roadmap flags the exact agencies to confirm for your specific item.",
    regulatorIds: ["fda"],
    coreCerts: ["Certificate confirmed with the relevant agency","Certificate of origin"],
    extraStageIds: ["stage-confirm-special"],
    route: {sea:["Producer","Product regulator (as determined)","Truck","Tema Port","Customs (ICUMS)","Vessel","Destination","Buyer"],air:["Producer","Product regulator (as determined)","Kotoka Airport cargo","Customs (ICUMS)","Aircraft","Destination","Buyer"],road:["Producer","Product regulator (as determined)","Truck","Land border","Buyer"]},
    chainNote: "Food products (e.g. bottled honey) follow the FDA food pathway. Animal-origin items may involve VSD. Seeds/plants involve PPRSD. Always confirm the specific item with the agency."
  }
};

/* stage-card templates. {AGENCY:field} tokens are replaced at render time from agencies.json */
window.GEN_STAGE_TEMPLATES = {
  "stage-business": {
    n: 1, title: "Register your business", agencyId: "orc", role: "Owner",
    plain: "Your business must legally exist before any agency will deal with it. A limited liability company is generally the stronger choice for serious exporting; a sole proprietorship (business name) is possible.",
    analogy: "Think of it as a birth certificate for your business â€” without it, nothing else can happen.",
    carry: "orc.whatToBring", steps: [
      "Decide the business type: limited liability company (recommended) or sole proprietorship/business name.",
      "Prepare 2-3 proposed names (names are checked against the register).",
      "Go to the ORC office or use the online portal to register.",
      "Pay the official fee at the official payment channel only.",
      "Collect your certificate and check every detail before leaving."
    ],
    youGet: "Certificate of Registration / Incorporation + your business registration number",
    check: ["Business name spelled exactly right", "Registration number correct and readable", "All documents received (incorporation documents for a company)"],
    pitfalls: ["Name rejected (too similar to an existing business) â€” have alternatives ready", "Wrong business type chosen for your plans", "Missing witnesses/subscribers for company registration"],
    next: "Stage 2 â€” Get your tax identification (TIN) at GRA."
  },
  "stage-tax": {
    n: 2, title: "Get your tax identification", agencyId: "gra", role: "Owner",
    plain: "For an individual, your Ghana Card PIN already serves as your TIN. Organisations and companies obtain an organisational TIN from GRA.",
    analogy: "Your TIN is how government recognises you in every money matter â€” you will reuse it everywhere.",
    carry: "gra.whatToBring", steps: [
      "If you are an individual: your Ghana Card PIN is your TIN â€” keep it handy.",
      "For a company/organisation: register for a TIN at GRA with your incorporation documents.",
      "Keep these details ready for every later stage: business name, registration number, TIN/Ghana Card PIN, address, digital (Ghana Post GPS) address, phone, email, directors, bank details."
    ],
    youGet: "TIN (organisations) / Ghana Card PIN confirmation (individuals)",
    check: ["Name and details match your ORC certificate exactly"],
    pitfalls: ["Name mismatches between ORC and GRA records cause delays later"],
    next: "Stage 3 â€” Register as an exporter with GEPA."
  },
  "stage-gepa": {
    n: 3, title: "Register as an exporter (GEPA)", agencyId: "gepa", role: "Owner",
    plain: "GEPA registration makes you a recognised Ghanaian exporter and opens access to market research, buyer connections and export training.",
    analogy: "GEPA is your official gateway into the export world â€” registration says 'this business is an exporter.'",
    carry: "gepa.whatToBring", steps: [
      "Register on the GEPA Exporters Portal and/or visit the Africa Trade House office.",
      "Submit your documents: Certificate of Incorporation + Certificate to Commence Business + Company Regulations + TIN + email (limited company); Certificate of Registration + Form A + email (sole proprietorship).",
      "The relevant permit-issuing agency may inspect your premises/production facilities where required.",
      "GEPA completes registration based on the recommendation and issues your export certificate.",
      "Note: registration is renewable annually â€” diarise the renewal."
    ],
    youGet: "GEPA exporter registration + export certificate (renewed annually)",
    check: ["Registration certificate details correct", "Renewal date noted in your calendar"],
    pitfalls: ["Registration lapses after a year â€” set a renewal reminder", "Processing takes time when premises inspection is required â€” start early"],
    next: "Stage 4 â€” Register as a shipper with the Ghana Shippers' Authority."
  },
  "stage-gsa-shipper": {
    n: 4, title: "Register as a shipper (Ghana Shippers' Authority)", agencyId: "ghsa", role: "Owner",
    plain: "Under the Act 1122 framework, shippers (importers and exporters) register with GSA before shipment transactions are processed through ICUMS.",
    analogy: "This is your 'player's licence' for shipping â€” no shipper registration, no smooth shipping.",
    carry: "ghsa.whatToBring", steps: [
      "Contact GSA (head office or Tema/Kumasi/Takoradi/Tamale branches) or the official portal.",
      "Submit your business documents and consignment details.",
      "Confirm the current fee and processing time directly with GSA.",
      "Keep the shipper registration details ready for your customs transactions."
    ],
    youGet: "GSA shipper registration",
    check: ["Registration details match your business records"],
    pitfalls: ["Waiting until the week of shipment â€” register before you have cargo ready"],
    next: "Stage 5 â€” Your product regulator."
  },
  "stage-pprsd": {
    n: 5, title: "Plant-health pathway (PPRSD)", agencyId: "pprsd", role: "Quality person",
    plain: "PPRSD is Ghana's National Plant Protection Organization. For fresh plant products, PPRSD inspects and issues the phytosanitary certificate â€” the plant-health passport of your consignment.",
    analogy: "Just as a person needs a clean health report to travel, your plants need one too â€” issued after inspection.",
    carry: "pprsd.whatToBring", steps: [
      "Contact PPRSD (Pokuase, Accra) or your regional MoFA office to book the inspection of your consignment/production.",
      "Prepare consignment details: product, quantity, packing, destination country.",
      "Ensure traceability: know the field/production locations.",
      "Attend the inspection and follow any treatment instructions.",
      "Collect the phytosanitary certificate before shipment â€” it must accompany the consignment."
    ],
    youGet: "Phytosanitary certificate (per consignment)",
    check: ["Certificate details match invoice and packing list exactly"],
    pitfalls: ["Booking inspection too late â€” certificates take time; inspect before packing if possible", "Destination-specific requirements not communicated â€” always tell PPRSD the destination country"],
    next: "Stage 6 â€” FDA export/clearance permit."
  },
  "stage-fda-fresh": {
    n: 6, title: "FDA fresh-produce permit", agencyId: "fda", role: "Quality person",
    plain: "FDA's 2025 fresh-produce guideline: every consignment of fresh fruits/vegetables needs an electronic export/clearance permit. Your storage facility must be licensed. Packaging must carry supplier info, country of supply, net weight, batch, storage temperature and handling instructions. Temperature records must be available.",
    analogy: "FDA checks that what leaves Ghana is safe and traceable â€” the permit is the departure stamp for food.",
    carry: "fda.whatToBring", steps: [
      "License your packhouse/storage facility if not already licensed.",
      "Apply for the export/clearance permit for the consignment (product, batch, quantity, packaging info).",
      "Prepare compliant packaging with all required information.",
      "Keep temperature records for the consignment.",
      "Present for inspection if FDA requires; collect your clearance."
    ],
    youGet: "FDA export/clearance permit + inspection clearance",
    check: ["Permit number and batch details match the consignment", "Packaging labels complete"],
    pitfalls: ["ðŸŸ¡ Non-compliant consignments can be detained, corrected or destroyed at the exporter's cost â€” never skip inspection", "Expired storage licence"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-fda-processed": {
    n: 5, title: "FDA processed-food compliance", agencyId: "fda", role: "Quality person",
    plain: "Processed/prepackaged foods follow FDA's prepackaged-foods guideline: product registration where applicable, compliant labelling (ingredients, net weight, batch, best-before, producer), facility requirements and per-consignment export clearance.",
    analogy: "A processed food product must prove WHO made it, WHAT is inside, and WHEN it expires â€” before it travels.",
    carry: "fda.whatToBring", steps: [
      "Check whether your product needs FDA product registration (most prepackaged foods do).",
      "Ensure the production facility meets FDA requirements (licensing/PLS scheme for small processors).",
      "Prepare full compliant labelling for the destination market.",
      "Apply for the export/clearance permit per consignment.",
      "Where the buyer or destination requires laboratory analysis, book a test (GSA or accredited lab) and keep the certificate."
    ],
    youGet: "FDA product registration (where applicable) + export/clearance permit",
    check: ["Labels match destination requirements exactly", "Registration valid (not expired)"],
    pitfalls: ["Registration lapsing mid-season", "Labels missing destination-required elements"],
    next: "Stage 6 â€” GSA standards (where applicable)."
  },
  "stage-gsa-optional": {
    n: 6, title: "GSA standards & testing (only if applicable)", agencyId: "gsa", role: "Quality person",
    plain: "GSA handles standards, testing, inspection and certification â€” but NOT every product needs GSA certification. It depends on the product, destination and buyer requirements.",
    analogy: "GSA is the referee of quality standards. Ask first whether your match needs them.",
    carry: "gsa.whatToBring", steps: [
      "Check your destination's requirement profile and your buyer's specification.",
      "If certification/testing is required: identify the applicable standard in the GSA catalogue (2,700+ national standards).",
      "Book factory/export-consignment inspection and testing with GSA's Product Inspection Department.",
      "Keep certificates with your export file."
    ],
    youGet: "GSA product certificate / test results (where applicable)",
    check: ["Certificate matches buyer/destination requirements"],
    pitfalls: ["Paying for certification you did not need â€” check first", "Testing the wrong batch"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-vsd": {
    n: 5, title: "Veterinary pathway (VSD)", agencyId: "vsd", role: "Quality person",
    plain: "VSD registers exporters of animals and animal products and issues veterinary permits and health certificates. Live animals may require inspection, vaccination, testing, treatment, quarantine, approved transport and final veterinary inspection.",
    analogy: "Animals travel with a medical passport â€” VSD issues it after checking health and vaccinations.",
    carry: "vsd.whatToBring", steps: [
      "Register with VSD as an exporter of animals/animal products.",
      "Book the veterinary inspection of your animals/products.",
      "Keep vaccination, testing and treatment records ready.",
      "Confirm the destination import permit requirement (many countries require the importer to obtain it first).",
      "Collect the veterinary health certificate for the consignment."
    ],
    youGet: "VSD registration + veterinary health certificate (per consignment)",
    check: ["Certificate matches consignment/animal details exactly"],
    pitfalls: ["Destination refuses origins without approved establishments â€” confirm eligibility BEFORE investing", "Expired vaccination records"],
    next: "Stage 6 â€” Destination import permit."
  },
  "stage-dest-permit": {
    n: 6, title: "Destination import permit (where required)", agencyId: null, role: "Buyer",
    plain: "Many destinations require an import permit or prior approval obtained by the importer on their side. Ask your buyer to confirm and share it before you ship.",
    analogy: "The destination must send an invitation before your goods travel.",
    steps: [
      "Ask your buyer/importer to obtain the destination import permit where required.",
      "Get a copy for your export file.",
      "Align certificate formats with what the destination authority expects (your regulator and buyer will confirm)."
    ],
    youGet: "Destination import permit (where applicable)",
    check: ["Permit validity covers your shipment date"],
    pitfalls: ["Shipping before the destination permit exists"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-gsa-fish": {
    n: 5, title: "Fish-export establishment & certification (GSA Fish Inspection)", agencyId: "gsa", role: "Quality person",
    plain: "GSA Fish Inspection registers exporters of fish and fishery products, inspects and approves fishing vessels, processing plants, cold stores, ice-making plants and landing sites, inspects consignments â€” and is Ghana's EU Competent Authority for fish products.",
    analogy: "For fish, the destination regulates the FACTORY as much as the fish. Your plant must be approved to even enter some markets.",
    carry: "gsa.whatToBring", steps: [
      "Register with GSA Fish Inspection as a fish exporter.",
      "Ensure your processing plant and cold store are approved (essential for EU-oriented exports).",
      "Implement food-safety systems (HACCP) and full traceability â€” catch to pack.",
      "Book consignment inspection for each shipment and collect the health certificate.",
      "Keep establishment approval and certification current."
    ],
    youGet: "GSA exporter registration + approved establishment status + per-consignment health certificate",
    check: ["Establishment approval current", "Traceability records complete for the consignment"],
    pitfalls: ["Investing in production before the establishment is approved for your destination", "Missing catch documentation"],
    next: "Stage 6 â€” FDA clearance & destination requirements."
  },
  "stage-tcda": {
    n: 5, title: "TCDA registration & licensing", agencyId: "tcda", role: "Owner",
    plain: "The Tree Crops Development Authority regulates cashew, shea, mango, coconut, rubber and oil palm. Registration requirements can include business incorporation/commencement documents, business location, directors/shareholders, identification, TIN â€” and exporters face category-specific requirements such as export/warehousing capacity.",
    analogy: "TCDA is the landlord of the six tree crops â€” you must be registered with the landlord before you can trade his crops.",
    carry: "tcda.whatToBring", steps: [
      "Register with TCDA for your crop category (Accra: Tsatse Dzani St, Adjiringanor Â· Kumasi office available).",
      "Confirm your category's specific requirements (export/warehousing capacity for exporters).",
      "Complete registration/licensing and note the renewal period."
    ],
    youGet: "TCDA registration/licensing for your crop",
    check: ["Registration covers your exact activity (exporter)"],
    pitfalls: ["Assuming only fresh crops need TCDA â€” the 2026 permit rule covers processed forms too"],
    next: "Stage 6 â€” TCDA export permit."
  },
  "stage-tcda-permit": {
    n: 6, title: "TCDA export permit (mandatory since 1 Apr 2026)", agencyId: "tcda", role: "Owner",
    plain: "ðŸ”´ From 1 April 2026, exporting cashew, coconut, oil palm, rubber, mango or shea â€” processed OR unprocessed â€” requires a valid written TCDA permit. Apply on the Permit Application page; verify permits on the Permit Verification page.",
    analogy: "Think of the permit as a visa for the crop â€” no permit, no travel, no exceptions.",
    carry: "tcda.whatToBring", steps: [
      "Apply on tcda.gov.gh (Permit Application) before each export or as TCDA directs.",
      "Pay official fees only through official channels.",
      "Collect the valid written permit and keep it with the consignment documents.",
      "Verify the permit status via the Permit Verification page if needed."
    ],
    youGet: "Valid written TCDA export permit",
    check: ["Permit covers the exact crop and form you are exporting", "Permit date valid for your shipment"],
    pitfalls: ["Shipping without the permit â€” consignments can be stopped", "Missing the 1 April 2026 rule change for processed forms"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-cocobod": {
    n: 5, title: "COCOBOD system", agencyId: "cocobod", role: "Owner",
    plain: "Cocoa is regulated by COCOBOD with its own licensing, purchasing and quality-control system. Cocoa exports move through licensed channels rather than the general pathway.",
    carry: "cocobod.whatToBring", steps: [
      "Contact COCOBOD to confirm the current licensing and export route for your cocoa operation.",
      "Follow the COCOBOD quality-control requirements.",
      "Complete customs via the normal ICUMS export declaration afterwards."
    ],
    youGet: "COCOBOD licensing/quality compliance",
    check: ["Licensing details current"],
    pitfalls: ["Selling outside licensed channels"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-confirm-special": {
    n: 5, title: "Confirm your product's regulator", agencyId: null, role: "Owner",
    plain: "Special products vary. Confirm the exact regulator for YOUR product with the agencies directly.",
    steps: [
      "Food products (e.g. bottled honey): FDA.",
      "Animal-origin items: VSD (+ FDA where food).",
      "Seeds/plants: PPRSD.",
      "Standards/testing: GSA where applicable.",
      "Call or visit the agency â€” contacts are on the Offices & Agencies page â€” and get the requirement in writing where possible."
    ],
    youGet: "Confirmed regulator + requirement list for your product",
    check: ["Requirement confirmed from the official source"],
    pitfalls: ["Guessing the pathway and discovering it at the port"],
    next: "Stage 7 â€” Packaging compliance."
  },
  "stage-packaging": {
    n: 7, title: "Compliant packaging & labelling", agencyId: null, role: "Quality person",
    plain: "Packaging is regulation, not decoration. Fresh produce per FDA: supplier information, country of supply, net weight, product batch, storage temperature and handling instructions. Destination markets often add more.",
    analogy: "Your box talks for you at every inspection â€” if it cannot speak (labels), your goods stay behind.",
    steps: [
      "Meet the Ghana-side packaging requirements from your product's roadmap.",
      "Check the destination's additional requirements (language, labelling rules, packaging materials).",
      "Include traceability: batch/lot numbers on every pack.",
      "Match the buyer's specification sheet exactly.",
      "Keep a labelled sample pack in your export file."
    ],
    youGet: "Compliant, traceable packaging system",
    check: ["Every required element is printed and legible", "Net weight accurate â€” verify by sampling"],
    pitfalls: ["Hand-written or missing batch numbers", "Ignoring destination-language label rules"],
    next: "Stage 8 â€” Buyer contract & readiness."
  },
  "stage-buyer": {
    n: 8, title: "Buyer contract & export readiness", agencyId: null, role: "Owner",
    plain: "Commercial terms come BEFORE shipment. Agree everything in writing; check your readiness score; arrange export finance.",
    analogy: "Do not cook the feast before the guest confirms the date.",
    steps: [
      "Sign a purchase contract covering: product, grade, quantity, packaging, price/currency, delivery date, destination, shipping method, Incoterm, inspection, insurance, payment method, documents, rejection procedure, claims, customs responsibility.",
      "Complete the Export Readiness Score (Tools page) â€” fix the red items first.",
      "Arrange finance: production costs, certification fees, freight, and working capital until payment arrives.",
      "Agree payment method (see Banking & Export Proceeds): advance, letter of credit, documentary collection, open account, or partial advance + balance."
    ],
    youGet: "Signed contract + readiness plan",
    check: ["Contract assigns customs/clearance responsibility clearly", "Payment method agreed and understood"],
    pitfalls: ["Shipping before a written agreement", "Open account with an unverified buyer"],
    next: "Stage 9 â€” Freight forwarder & clearing agent."
  },
  "stage-freight": {
    n: 9, title: "Engage freight forwarder & clearing agent", agencyId: null, role: "Transporter",
    plain: "GRA requires a licensed clearing agent for port clearance. The forwarder organises international movement; the agent handles customs.",
    analogy: "These are your travel agents for goods â€” choose them the way you would choose a surgeon: verified, experienced, quoted in writing.",
    steps: [
      "Shortlist licensed forwarders/agents (verify registration and references).",
      "Get written quotations from at least two; compare scope (customs? transport? reefer?).",
      "Confirm who provides which documents and by when.",
      "Book your shipment (booking confirmation from the line/airline via the forwarder).",
      "ðŸ›¡ï¸ Pay only company accounts you have verified."
    ],
    youGet: "Agent engaged + shipment booking",
    check: ["Booking reference received", "Document list agreed in writing"],
    pitfalls: ["Unlicensed agents", "Verbal-only quotes", "Reefer cargo with an agent who has never handled cold chain"],
    next: "Stage 10 â€” Consignment certificates & customs."
  },
  "stage-certificates": {
    n: 10, title: "Consignment certificates & customs declaration", agencyId: "gra", role: "Treasurer",
    plain: "Per consignment: obtain the regulator certificates (phytosanitary/veterinary/health per product), FDA clearance, certificate of origin where applicable â€” then your agent lodges the export declaration in ICUMS with all documents attached.",
    analogy: "This is the exam day: every document is an answer sheet â€” one missing paper and the whole class (consignment) waits.",
    carry: "gra.whatToBring", steps: [
      "Collect all product certificates for THIS consignment (fresh: phyto + FDA permit; fish: GSA health cert; animal: VSD health cert; tree crops: TCDA permit).",
      "Prepare commercial invoice, packing list, contract.",
      "Your clearing agent submits the export declaration electronically through ICUMS with permits and certificates attached.",
      "Goods are presented for customs inspection/examination before release.",
      "Confirm the Bank of Ghana foreign-exchange form / Letter of Commitment requirement with your bank and agent."
    ],
    youGet: "Customs declaration accepted + release",
    check: ["All certificate numbers match the declaration", "Declaration details match invoice exactly"],
    pitfalls: ["Certificate/declaration mismatches (top rejection cause)", "Booking the inspection too late"],
    next: "Stage 11 â€” Port/airport & shipment."
  },
  "stage-port": {
    n: 11, title: "Port / airport & shipment", agencyId: "gpha", role: "Transporter",
    plain: "Deliver to the exit point, load into approved transport, and the cargo departs. Reefer cargo uses powered plugs at Tema; air cargo moves through the KIA cargo village.",
    analogy: "Your goods board their flight/ship â€” your paperwork has already gone ahead of them.",
    steps: [
      "Deliver the container/cargo to the terminal in good time (mind the cut-off).",
      "For cold chain: confirm reefer set-point and pre-trip inspection; record temperatures.",
      "Collect the Bill of Lading (sea) or Airway Bill (air).",
      "Insure the cargo where agreed/required.",
      "Keep copies of everything in your export file."
    ],
    youGet: "Bill of Lading / Airway Bill + shipped cargo",
    check: ["BL/AWB details match invoice", "Reefer set-point recorded in writing"],
    pitfalls: ["Missing the vessel/flight cut-off", "Reefer plugs without power monitoring for long stays"],
    next: "Stage 12 â€” Arrival at destination."
  },
  "stage-arrival": {
    n: 12, title: "Arrival, import clearance & delivery", agencyId: null, role: "Buyer",
    plain: "The buyer/importer normally handles destination customs and import clearance unless your contract assigns more to you. Goods pass import inspection before release.",
    analogy: "The second half of the journey happens in your buyer's country â€” your contract decides who carries which burden.",
    steps: [
      "Share documents with your buyer/destination agent in time.",
      "Buyer lodges the import declaration; food/plant/veterinary inspection happens.",
      "Goods are released to the importer's warehouse.",
      "Buyer inspects against the contract specification; claims (if any) follow the contract's rejection procedure."
    ],
    youGet: "Delivered, cleared, accepted goods",
    check: ["Buyer confirms receipt and quality in writing"],
    pitfalls: ["Documents arriving late at destination", "No agreed claims procedure in the contract"],
    next: "Stage 13 â€” Payment & banking."
  },
  "stage-payment": {
    n: 13, title: "Payment & export proceeds", agencyId: "bog", role: "Treasurer",
    plain: "The buyer pays according to your contract. Ghana's Bank of Ghana rules on repatriation of export proceeds apply â€” payments must be processed properly through banks.",
    analogy: "Money, like cargo, must travel on official roads. Keep records of every payment.",
    steps: [
      "Use the agreed payment method: advance / letter of credit / documentary collection / open account / partial advance + balance.",
      "Route payments through your commercial bank.",
      "Complete any Bank of Ghana foreign-exchange documentation (including the Letter of Commitment referenced in export declarations).",
      "Keep payment evidence and proof of export proceeds in your export file."
    ],
    youGet: "Payment received + clean banking records",
    check: ["Payment matches the contract amount and currency"],
    pitfalls: ["Open account with an unknown buyer", "Informal payment channels â€” regulatory and fraud risk"],
    next: "Stage 14 â€” Keep your records; plan the next shipment."
  },
  "stage-records": {
    n: 14, title: "Keep your export file & prepare the next cycle", agencyId: null, role: "Owner",
    plain: "Record-keeping is what turns one shipment into a business. Keep everything; review what went wrong and what went right; then repeat.",
    analogy: "Your export file is the memory of the business â€” businesses without memory repeat their mistakes.",
    steps: [
      "File: business registration, TIN, GEPA + GSA shipper registration, TCDA/VSD/FDA/PPRSD documents, product certificates, invoice, packing list, declaration, BL/AWB, insurance, contract, payment evidence, inspection reports.",
      "Review costs versus the calculator estimate â€” update your numbers.",
      "Collect the buyer's feedback and quality reports.",
      "Plan the next cycle: volumes, buyers, destinations."
    ],
    youGet: "Complete export file + lessons for the next cycle",
    check: ["File complete before starting the next consignment"],
    pitfalls: ["Losing documents â€” scan and back up everything"],
    next: "You have completed the full export cycle."
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   Project Mochi 🍡 — AI Relationship Assistant (Malaysia Edition)
   Complete Application Logic with Malaysia-Specific Date Planning Brain
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: MALAYSIA KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────

const HOME_BASE = {
  you: { name: "Seri Kembangan", lat: 3.0288, lng: 101.7181, area: "seri-kembangan" },
  her: { name: "TTDI, KL", lat: 3.1335, lng: 101.6310, area: "ttdi" }
};

// Real travel estimates (by car in normal traffic, in minutes)
// Key: "origin->destination"
const TRAVEL_TIMES = {
  "seri-kembangan->ttdi": { car: 40, grab: 45, distance: 28 },
  "ttdi->bangsar": { car: 12, grab: 15, distance: 6 },
  "ttdi->bukit-bintang": { car: 18, grab: 22, distance: 10 },
  "ttdi->klcc": { car: 20, grab: 25, distance: 12 },
  "ttdi->mont-kiara": { car: 10, grab: 12, distance: 5 },
  "ttdi->damansara": { car: 8, grab: 10, distance: 4 },
  "ttdi->pj": { car: 15, grab: 18, distance: 8 },
  "ttdi->sunway": { car: 25, grab: 30, distance: 16 },
  "ttdi->desa-park-city": { car: 12, grab: 15, distance: 7 },
  "ttdi->sri-hartamas": { car: 8, grab: 10, distance: 3 },
  "ttdi->publika": { car: 10, grab: 12, distance: 5 },
  "ttdi->mid-valley": { car: 18, grab: 22, distance: 10 },
  "ttdi->petaling-street": { car: 20, grab: 25, distance: 12 },
  "ttdi->cheras": { car: 30, grab: 35, distance: 20 },
  "ttdi->putrajaya": { car: 40, grab: 45, distance: 35 },
  "ttdi->sentul": { car: 20, grab: 25, distance: 12 },
  "ttdi->kepong": { car: 18, grab: 22, distance: 10 },
  "ttdi->ss2": { car: 12, grab: 15, distance: 6 },
  "ttdi->ss15": { car: 18, grab: 22, distance: 10 },
  "ttdi->kota-damansara": { car: 12, grab: 15, distance: 7 },
  "ttdi->ara-damansara": { car: 10, grab: 12, distance: 5 },
  "ttdi->janda-baik": { car: 60, grab: 70, distance: 55 },
  "ttdi->genting": { car: 70, grab: 80, distance: 60 },
  "ttdi->sekinchan": { car: 90, grab: 100, distance: 85 },
  "ttdi->1-utama": { car: 10, grab: 12, distance: 5 },
  "ttdi->the-curve": { car: 10, grab: 12, distance: 5 },
  "ttdi->pavilion": { car: 18, grab: 22, distance: 10 },
  "ttdi->nu-sentral": { car: 18, grab: 22, distance: 10 },
  "seri-kembangan->sunway": { car: 15, grab: 18, distance: 8 },
  "seri-kembangan->putrajaya": { car: 20, grab: 22, distance: 15 },
  "seri-kembangan->bangsar": { car: 25, grab: 30, distance: 18 },
  "seri-kembangan->bukit-bintang": { car: 30, grab: 35, distance: 22 },
  "seri-kembangan->mid-valley": { car: 22, grab: 26, distance: 15 }
};

// Traffic multipliers by day/time
const TRAFFIC_MULTIPLIERS = {
  weekday_morning: 1.5,   // 7-10am
  weekday_lunch: 1.2,     // 12-2pm
  weekday_evening: 1.6,   // 5-8pm
  weekday_night: 0.8,     // 8pm+
  weekend_morning: 0.9,
  weekend_afternoon: 1.3,
  weekend_evening: 1.4,
  weekend_night: 0.8
};

const FUEL_COST_PER_KM = 0.15; // RM per km estimate

// ── Malaysia Venue Database ──────────────────────────────────────────────────

const VENUES_DB = [
  // ═══ CAFES ═══
  { id:"v_001", name:"Niko Neko Matcha", area:"bangsar", type:"cafe", tags:["matcha","desserts","japanese","quiet","aesthetic","instagram"], priceRange:[15,50], estimatedCost:35, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Premium matcha cafe with stunning aesthetic interior, perfect for matcha lovers", vibes:["cozy","aesthetic","romantic"] },
  { id:"v_002", name:"VCR Coffee", area:"bukit-bintang", type:"cafe", tags:["coffee","brunch","western","trendy","aesthetic"], priceRange:[20,55], estimatedCost:40, hours:{open:"08:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Iconic hipster cafe in a heritage shophouse, great brunch and specialty coffee", vibes:["trendy","cozy","instagram"] },
  { id:"v_003", name:"Lisette's Cafe & Bakery", area:"ttdi", type:"cafe", tags:["bakery","pastries","coffee","cozy","neighborhood"], priceRange:[15,40], estimatedCost:30, hours:{open:"08:00",close:"18:00"}, daysOpen:["tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short"], loveLanguages:["quality-time"], description:"Charming neighborhood cafe near her place in TTDI with amazing pastries", vibes:["cozy","casual","sweet"] },
  { id:"v_004", name:"Three Little Birds Coffee", area:"sri-hartamas", type:"cafe", tags:["coffee","brunch","aesthetic","quiet","cozy"], priceRange:[18,45], estimatedCost:35, hours:{open:"08:00",close:"17:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short"], loveLanguages:["quality-time"], description:"Peaceful specialty coffee spot with a relaxed vibe", vibes:["peaceful","artsy","cozy"] },
  { id:"v_005", name:"Kenny Hills Bakers", area:"damansara", type:"cafe", tags:["bakery","coffee","garden","nature","brunch"], priceRange:[20,50], estimatedCost:38, hours:{open:"07:30",close:"19:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Beautiful garden bakery cafe surrounded by greenery, feels like an escape", vibes:["garden","peaceful","romantic"] },
  { id:"v_006", name:"Merchant's Lane", area:"petaling-street", type:"cafe", tags:["heritage","coffee","brunch","aesthetic","photography"], priceRange:[20,50], estimatedCost:38, hours:{open:"10:00",close:"21:00"}, daysOpen:["tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Heritage shophouse cafe above Petaling Street with stunning interiors", vibes:["heritage","aesthetic","romantic"] },
  { id:"v_007", name:"Kaiju Company", area:"kota-damansara", type:"cafe", tags:["coffee","japanese","quiet","cozy","aesthetic"], priceRange:[15,40], estimatedCost:30, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Japanese-inspired specialty coffee shop with minimal aesthetic", vibes:["minimal","quiet","japanese"] },
  { id:"v_008", name:"Podgy & The Owl", area:"sunway", type:"cafe", tags:["desserts","waffles","cute","cozy","sweet"], priceRange:[15,40], estimatedCost:30, hours:{open:"12:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Cute dessert cafe known for amazing waffles and sweet treats", vibes:["cute","sweet","cozy"] },
  { id:"v_009", name:"Feeka Coffee Roasters", area:"bukit-bintang", type:"cafe", tags:["coffee","brunch","aesthetic","trendy","instagrammable"], priceRange:[18,50], estimatedCost:36, hours:{open:"08:00",close:"23:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Trendy cafe with exposed brick walls and great food", vibes:["trendy","urban","cozy"] },
  { id:"v_010", name:"The Breakfast Thieves", area:"bangsar", type:"cafe", tags:["brunch","australian","coffee","healthy","aesthetic"], priceRange:[20,55], estimatedCost:42, hours:{open:"08:00",close:"17:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short"], loveLanguages:["quality-time"], description:"Australian-style brunch cafe, perfect for a lazy morning date", vibes:["bright","healthy","instagram"] },
  { id:"v_011", name:"Bean Brothers", area:"ara-damansara", type:"cafe", tags:["coffee","pastries","quiet","neighborhood","cozy"], priceRange:[12,35], estimatedCost:25, hours:{open:"08:00",close:"18:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short"], loveLanguages:["quality-time"], description:"Cozy neighborhood specialty coffee roaster", vibes:["quiet","local","warm"] },
  { id:"v_012", name:"Dew", area:"bukit-bintang", type:"cafe", tags:["matcha","japanese","desserts","aesthetic","quiet"], priceRange:[18,48], estimatedCost:35, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Japanese-style matcha and dessert cafe with beautiful presentation", vibes:["japanese","aesthetic","serene"] },
  { id:"v_013", name:"Joji's Diner", area:"pj", type:"cafe", tags:["diner","burgers","retro","fun","american"], priceRange:[20,50], estimatedCost:38, hours:{open:"11:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Retro American diner vibes with great burgers and milkshakes", vibes:["retro","fun","casual"] },

  // ═══ RESTAURANTS ═══
  { id:"v_020", name:"Entier French Dining", area:"klcc", type:"restaurant", tags:["french","fine-dining","romantic","special","upscale"], priceRange:[80,250], estimatedCost:160, hours:{open:"12:00",close:"22:30"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"Elegant French restaurant with stunning KLCC views, perfect for special occasions", vibes:["romantic","upscale","special"] },
  { id:"v_021", name:"Marini's on 57", area:"klcc", type:"restaurant", tags:["italian","skybar","romantic","views","special","upscale"], priceRange:[100,300], estimatedCost:200, hours:{open:"12:00",close:"01:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"Rooftop Italian dining at the top of Petronas Tower 3 with breathtaking KL views", vibes:["luxurious","romantic","skyline"] },
  { id:"v_022", name:"Din Tai Fung", area:"pavilion", type:"restaurant", tags:["chinese","taiwanese","dumplings","comfort","reliable"], priceRange:[30,70], estimatedCost:50, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Famous Taiwanese restaurant known for xiao long bao dumplings", vibes:["comfort","familiar","delicious"] },
  { id:"v_023", name:"Sushi Azabu", area:"klcc", type:"restaurant", tags:["sushi","japanese","omakase","special","upscale"], priceRange:[80,200], estimatedCost:130, hours:{open:"12:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["evening"], dateLength:["medium"], loveLanguages:["quality-time","gifts"], description:"Authentic Japanese omakase experience", vibes:["intimate","special","japanese"] },
  { id:"v_024", name:"Jiro KL", area:"pavilion", type:"restaurant", tags:["sushi","japanese","conveyor","fun","reliable"], priceRange:[25,60], estimatedCost:45, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Quality conveyor belt sushi, fun and casual Japanese dining", vibes:["fun","casual","yummy"] },
  { id:"v_025", name:"Kin No Neko", area:"damansara", type:"restaurant", tags:["japanese","ramen","cozy","warm","comfort"], priceRange:[20,50], estimatedCost:38, hours:{open:"11:00",close:"21:30"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Cozy Japanese ramen and rice bowl spot", vibes:["warm","comfort","cozy"] },
  { id:"v_026", name:"Breakfast Thieves Rooftop", area:"klcc", type:"restaurant", tags:["brunch","rooftop","views","aesthetic","western"], priceRange:[30,70], estimatedCost:50, hours:{open:"08:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Brunch with stunning KL skyline views", vibes:["bright","views","trendy"] },
  { id:"v_027", name:"Nasi Lemak Antarabangsa", area:"pj", type:"restaurant", tags:["malay","local","nasi-lemak","cheap","authentic"], priceRange:[8,20], estimatedCost:15, hours:{open:"17:00",close:"04:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["evening","night"], dateLength:["short"], loveLanguages:["quality-time"], description:"Legendary late-night nasi lemak spot, a KL institution", vibes:["local","authentic","casual"] },
  { id:"v_028", name:"Babe by Jeff Ramsey", area:"bangsar", type:"restaurant", tags:["japanese-fusion","fine-dining","special","creative","upscale"], priceRange:[100,250], estimatedCost:180, hours:{open:"18:00",close:"23:00"}, daysOpen:["tue","wed","thu","fri","sat"], introvertFriendly:true, bestTimeSlots:["evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"Award-winning Japanese-French fusion fine dining", vibes:["special","creative","intimate"] },
  { id:"v_029", name:"Village Park Restaurant", area:"damansara", type:"restaurant", tags:["malay","nasi-lemak","local","famous","breakfast"], priceRange:[8,18], estimatedCost:14, hours:{open:"07:00",close:"15:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["morning","afternoon"], dateLength:["short"], loveLanguages:["quality-time"], description:"Famous nasi lemak spot in Damansara, always packed but worth it", vibes:["local","bustling","delicious"] },
  { id:"v_030", name:"Miru Dessert Cafe", area:"damansara", type:"cafe", tags:["desserts","matcha","japanese","aesthetic","sweet"], priceRange:[15,45], estimatedCost:32, hours:{open:"12:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Beautiful Japanese dessert cafe with matcha and mochi specialties", vibes:["aesthetic","japanese","sweet"] },

  // ═══ ENTERTAINMENT ═══
  { id:"v_040", name:"TGV Cinemas 1 Utama", area:"1-utama", type:"movie", tags:["movies","cinema","imax","beanieplex","cozy"], priceRange:[15,50], estimatedCost:35, hours:{open:"10:00",close:"00:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Premium cinema experience with Beanieplex couple seats", vibes:["cozy","entertainment","date-night"] },
  { id:"v_041", name:"GSC Pavilion", area:"pavilion", type:"movie", tags:["movies","cinema","gold-class","luxurious","couple"], priceRange:[20,80], estimatedCost:50, hours:{open:"10:00",close:"00:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Gold Class cinema with recliner seats, blankets, and food service", vibes:["luxurious","cozy","special"] },
  { id:"v_042", name:"LaserBattle Sunway", area:"sunway", type:"entertainment", tags:["laser-tag","active","fun","exciting","competitive"], priceRange:[25,50], estimatedCost:40, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Exciting laser tag arena for a fun competitive date", vibes:["exciting","active","fun"] },
  { id:"v_043", name:"K Bowling Club", area:"bukit-bintang", type:"entertainment", tags:["bowling","neon","fun","active","drinks"], priceRange:[30,70], estimatedCost:50, hours:{open:"12:00",close:"01:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["evening","night"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Neon-lit cosmic bowling with a chill lounge vibe", vibes:["neon","fun","nightlife"] },
  { id:"v_044", name:"Red Dynasty Paintball", area:"sunway", type:"entertainment", tags:["paintball","active","adventure","exciting","outdoor"], priceRange:[40,80], estimatedCost:60, hours:{open:"10:00",close:"19:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["morning","afternoon"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Outdoor paintball for an adventurous date", vibes:["adventure","active","exciting"] },
  { id:"v_045", name:"Neway Karaoke Box", area:"bukit-bintang", type:"entertainment", tags:["karaoke","singing","fun","music","private"], priceRange:[25,60], estimatedCost:45, hours:{open:"12:00",close:"03:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening","night"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Private karaoke rooms, sing your hearts out together", vibes:["fun","private","musical"] },
  { id:"v_046", name:"Escape Room KL", area:"bukit-bintang", type:"entertainment", tags:["escape-room","puzzle","teamwork","exciting","unique"], priceRange:[35,70], estimatedCost:55, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Solve puzzles together in themed escape rooms", vibes:["exciting","teamwork","unique"] },
  { id:"v_047", name:"Timezone Mid Valley", area:"mid-valley", type:"entertainment", tags:["arcade","games","fun","competitive","nostalgic"], priceRange:[20,50], estimatedCost:35, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Classic arcade with claw machines, racing games, and more", vibes:["fun","nostalgic","playful"] },
  { id:"v_048", name:"Camp5 Climbing Gym", area:"1-utama", type:"entertainment", tags:["rock-climbing","active","adventure","fitness","unique"], priceRange:[35,60], estimatedCost:50, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Indoor rock climbing for an active adventurous date", vibes:["active","adventurous","bonding"] },
  { id:"v_049", name:"Craft Pottery Studio", area:"bangsar", type:"entertainment", tags:["pottery","art","creative","hands-on","unique","romantic"], priceRange:[60,120], estimatedCost:90, hours:{open:"10:00",close:"20:00"}, daysOpen:["tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["medium"], loveLanguages:["quality-time","acts"], description:"Make pottery together — romantic and creative couple activity", vibes:["creative","romantic","unique"] },

  // ═══ OUTDOOR & NATURE ═══
  { id:"v_060", name:"KLCC Park", area:"klcc", type:"outdoor", tags:["park","walk","fountain","skyline","free","romantic"], priceRange:[0,10], estimatedCost:5, hours:{open:"07:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Beautiful park with water fountain show and Twin Tower views", vibes:["romantic","peaceful","scenic"] },
  { id:"v_061", name:"Perdana Botanical Garden", area:"mid-valley", type:"outdoor", tags:["garden","nature","walk","peaceful","free","flowers"], priceRange:[0,5], estimatedCost:0, hours:{open:"07:00",close:"20:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"KL's biggest park, beautiful lake and gardens, great for walks", vibes:["peaceful","nature","romantic"] },
  { id:"v_062", name:"Taman Tugu", area:"mont-kiara", type:"outdoor", tags:["forest","nature","trail","peaceful","hiking","free"], priceRange:[0,5], estimatedCost:0, hours:{open:"07:00",close:"19:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Urban forest trail in the heart of KL, feels like another world", vibes:["nature","peaceful","adventure"] },
  { id:"v_063", name:"Desa Park City Central Park", area:"desa-park-city", type:"outdoor", tags:["park","lake","walk","dogs","sunset","free"], priceRange:[0,10], estimatedCost:5, hours:{open:"06:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Beautiful lakeside park with dog-friendly areas, great sunset views", vibes:["relaxing","scenic","cute"] },
  { id:"v_064", name:"Putrajaya Botanical Garden", area:"putrajaya", type:"outdoor", tags:["garden","nature","cycling","huge","free","peaceful"], priceRange:[0,15], estimatedCost:8, hours:{open:"07:00",close:"19:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["medium","long"], loveLanguages:["quality-time"], description:"Massive botanical gardens with themed sections, great for cycling or walking", vibes:["nature","spacious","romantic"] },
  { id:"v_065", name:"FRIM Canopy Walk", area:"kepong", type:"outdoor", tags:["forest","canopy-walk","hiking","nature","adventure"], priceRange:[5,15], estimatedCost:10, hours:{open:"08:00",close:"14:00"}, daysOpen:["mon","tue","wed","thu","fri"], introvertFriendly:true, bestTimeSlots:["morning"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Forest Research Institute with thrilling canopy walkway", vibes:["adventure","nature","active"] },
  { id:"v_066", name:"Broga Hill Sunrise", area:"cheras", type:"outdoor", tags:["hiking","sunrise","mountain","adventure","romantic","views"], priceRange:[0,5], estimatedCost:5, hours:{open:"05:00",close:"12:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning"], dateLength:["long"], loveLanguages:["quality-time"], description:"Beautiful sunrise hike, a bucket-list KL date experience", vibes:["adventure","romantic","breathtaking"] },
  { id:"v_067", name:"Skypark Observation Deck", area:"klcc", type:"outdoor", tags:["skyline","views","photos","iconic","tourist"], priceRange:[30,50], estimatedCost:40, hours:{open:"09:00",close:"21:00"}, daysOpen:["tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Petronas Twin Towers skybridge with incredible city views", vibes:["iconic","scenic","memorable"] },

  // ═══ SHOPPING & MALLS ═══
  { id:"v_070", name:"Pavilion KL", area:"pavilion", type:"shopping", tags:["shopping","luxury","food-court","variety","fashion"], priceRange:[0,200], estimatedCost:80, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"KL's premier luxury mall with amazing food options", vibes:["upscale","variety","exciting"] },
  { id:"v_071", name:"1 Utama Shopping Centre", area:"1-utama", type:"shopping", tags:["shopping","huge","variety","entertainment","food"], priceRange:[0,150], estimatedCost:60, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"Massive mall near TTDI with endless options, her go-to spot", vibes:["variety","convenient","fun"] },
  { id:"v_072", name:"Sunway Pyramid", area:"sunway", type:"shopping", tags:["shopping","entertainment","ice-skating","variety","fun"], priceRange:[0,150], estimatedCost:60, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["afternoon","evening"], dateLength:["medium","long"], loveLanguages:["quality-time","gifts"], description:"Major shopping mall with ice skating rink and theme park nearby", vibes:["exciting","variety","active"] },
  { id:"v_073", name:"BookXcess Tamarind Square", area:"pj", type:"shopping", tags:["books","bookstore","reading","quiet","aesthetic"], priceRange:[0,50], estimatedCost:25, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Massive discount bookstore with amazing interior design", vibes:["quiet","aesthetic","intellectual"] },
  { id:"v_074", name:"The LINC KL", area:"bukit-bintang", type:"shopping", tags:["boutique","aesthetic","cafe","gallery","unique"], priceRange:[0,80], estimatedCost:40, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Boutique lifestyle mall with galleries, cafes, and unique shops", vibes:["artsy","boutique","aesthetic"] },

  // ═══ CULTURAL & ART ═══
  { id:"v_080", name:"Ilham Gallery", area:"klcc", type:"art", tags:["art","gallery","free","culture","quiet","aesthetic"], priceRange:[0,0], estimatedCost:0, hours:{open:"11:00",close:"19:00"}, daysOpen:["tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Free contemporary art gallery in KLCC area with rotating exhibitions", vibes:["artsy","intellectual","peaceful"] },
  { id:"v_081", name:"Islamic Arts Museum", area:"mid-valley", type:"art", tags:["museum","art","culture","beautiful","quiet","educational"], priceRange:[14,14], estimatedCost:14, hours:{open:"09:30",close:"17:30"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Stunning museum with beautiful architecture and art collections", vibes:["beautiful","cultural","peaceful"] },
  { id:"v_082", name:"National Art Gallery", area:"sentul", type:"art", tags:["art","gallery","free","exhibitions","culture","photography"], priceRange:[0,5], estimatedCost:2, hours:{open:"10:00",close:"18:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["medium"], loveLanguages:["quality-time"], description:"Malaysia's national gallery with contemporary and traditional art", vibes:["cultural","quiet","inspiring"] },

  // ═══ NIGHT MARKETS & STREET FOOD ═══
  { id:"v_090", name:"Taman Connaught Night Market", area:"cheras", type:"night-market", tags:["night-market","street-food","cheap","lively","variety"], priceRange:[10,30], estimatedCost:20, hours:{open:"17:00",close:"23:00"}, daysOpen:["wed"], introvertFriendly:false, bestTimeSlots:["evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"KL's longest and most famous pasar malam, Wednesday nights only", vibes:["lively","authentic","fun"] },
  { id:"v_091", name:"Jalan Alor Street Food", area:"bukit-bintang", type:"night-market", tags:["street-food","chinese","hawker","cheap","lively","iconic"], priceRange:[10,35], estimatedCost:25, hours:{open:"17:00",close:"02:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["evening","night"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Iconic KL street food street with amazing Chinese hawker fare", vibes:["lively","authentic","delicious"] },
  { id:"v_092", name:"SS2 Night Market", area:"ss2", type:"night-market", tags:["night-market","street-food","cheap","variety","local"], priceRange:[8,25], estimatedCost:18, hours:{open:"18:00",close:"23:00"}, daysOpen:["mon"], introvertFriendly:false, bestTimeSlots:["evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Monday night market in PJ with great food and bargain finds", vibes:["local","casual","fun"] },

  // ═══ DAY TRIPS (Long Dates) ═══
  { id:"v_100", name:"Janda Baik Retreat", area:"janda-baik", type:"outdoor", tags:["nature","waterfall","kampung","peaceful","romantic","escape"], priceRange:[20,80], estimatedCost:50, hours:{open:"08:00",close:"18:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["long"], loveLanguages:["quality-time","acts"], description:"Charming kampung town with waterfalls, great for a nature day trip", vibes:["nature","romantic","escape"] },
  { id:"v_101", name:"Genting Premium Outlets", area:"genting", type:"shopping", tags:["shopping","outlet","mountain","cool-weather","variety"], priceRange:[50,300], estimatedCost:100, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["morning","afternoon"], dateLength:["long"], loveLanguages:["quality-time","gifts"], description:"Mountain-top outlet mall with cool weather, combine with Genting trip", vibes:["exciting","cool","shopping"] },
  { id:"v_102", name:"Sekinchan Paddy Fields", area:"sekinchan", type:"outdoor", tags:["paddy-fields","photography","rural","romantic","unique","scenic"], priceRange:[30,80], estimatedCost:50, hours:{open:"07:00",close:"18:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["morning","afternoon"], dateLength:["long"], loveLanguages:["quality-time"], description:"Beautiful paddy field town perfect for photography and seafood", vibes:["scenic","peaceful","romantic"] },
  { id:"v_103", name:"Sunway Lagoon Theme Park", area:"sunway", type:"entertainment", tags:["theme-park","waterpark","fun","adventure","active","exciting"], priceRange:[80,150], estimatedCost:120, hours:{open:"10:00",close:"18:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["morning","afternoon"], dateLength:["long"], loveLanguages:["quality-time"], description:"Multi-zone theme park with water rides, perfect for a full-day date", vibes:["exciting","fun","active"] },

  // ═══ UNIQUE EXPERIENCES ═══
  { id:"v_110", name:"Aquaria KLCC", area:"klcc", type:"entertainment", tags:["aquarium","marine","unique","romantic","photos"], priceRange:[40,70], estimatedCost:55, hours:{open:"10:00",close:"20:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Walk-through aquarium with tunnel under sharks and rays", vibes:["unique","fascinating","romantic"] },
  { id:"v_111", name:"The Alchemy Ice Cream", area:"bangsar", type:"cafe", tags:["ice-cream","unique","craft","desserts","fun"], priceRange:[15,35], estimatedCost:25, hours:{open:"12:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Craft ice cream with unique Malaysian-inspired flavors", vibes:["fun","delicious","unique"] },
  { id:"v_112", name:"APW Bangsar", area:"bangsar", type:"art", tags:["art","gallery","cafe","events","creative","photography"], priceRange:[0,40], estimatedCost:20, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Creative arts space with galleries, cafes, and events", vibes:["artsy","creative","trendy"] },
  { id:"v_113", name:"Tamarind Springs", area:"cheras", type:"restaurant", tags:["thai","garden","romantic","nature","special","upscale"], priceRange:[60,150], estimatedCost:100, hours:{open:"12:00",close:"22:30"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["evening"], dateLength:["medium","long"], loveLanguages:["quality-time","acts"], description:"Romantic outdoor Thai dining surrounded by nature and water features", vibes:["romantic","nature","special"] },
  { id:"v_114", name:"Heli Lounge Bar", area:"bukit-bintang", type:"restaurant", tags:["rooftop","bar","views","skyline","unique","nightlife"], priceRange:[40,100], estimatedCost:70, hours:{open:"18:00",close:"01:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:false, bestTimeSlots:["evening","night"], dateLength:["short","medium"], loveLanguages:["quality-time"], description:"Rooftop bar on actual helipad with 360° KL skyline views", vibes:["thrilling","views","nightlife"] },

  // ═══ HOME / NEARBY ═══
  { id:"v_120", name:"Cook at Home", area:"seri-kembangan", type:"home", tags:["cooking","homemade","cozy","intimate","cheap","romantic"], priceRange:[15,40], estimatedCost:25, hours:{open:"00:00",close:"23:59"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short","medium","long"], loveLanguages:["quality-time","acts"], description:"Cook a meal together at home, intimate and meaningful", vibes:["intimate","cozy","romantic"] },
  { id:"v_121", name:"Movie Marathon at Home", area:"seri-kembangan", type:"home", tags:["movies","cozy","snacks","blankets","intimate","cheap"], priceRange:[10,25], estimatedCost:15, hours:{open:"00:00",close:"23:59"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening","night"], dateLength:["medium","long"], loveLanguages:["quality-time"], description:"Cozy movie marathon with snacks, blankets, and her favorite films", vibes:["cozy","intimate","relaxing"] },
  { id:"v_122", name:"Bake Together", area:"seri-kembangan", type:"home", tags:["baking","desserts","fun","homemade","cute","romantic"], priceRange:[15,35], estimatedCost:22, hours:{open:"00:00",close:"23:59"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["short","medium"], loveLanguages:["quality-time","acts"], description:"Bake cookies, brownies, or a cake together — sweet in every way", vibes:["sweet","fun","romantic"] },

  // ═══ BUBBLE TEA & QUICK STOPS ═══
  { id:"v_130", name:"The Alley", area:"various", type:"cafe", tags:["bubble-tea","drinks","quick","cute","trendy"], priceRange:[10,18], estimatedCost:14, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Aesthetic bubble tea chain with great brown sugar options", vibes:["quick","cute","sweet"] },
  { id:"v_131", name:"Tiger Sugar", area:"various", type:"cafe", tags:["bubble-tea","brown-sugar","drinks","quick","popular"], priceRange:[10,16], estimatedCost:13, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon","evening"], dateLength:["short"], loveLanguages:["quality-time"], description:"Famous brown sugar boba, perfect grab-and-go stop", vibes:["quick","trendy","sweet"] },

  // ═══ SPA & WELLNESS ═══
  { id:"v_140", name:"Hammam Spa", area:"bangsar", type:"entertainment", tags:["spa","relaxing","moroccan","pampering","luxury","unique"], priceRange:[80,200], estimatedCost:140, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["medium","long"], loveLanguages:["quality-time","acts"], description:"Luxurious Moroccan-themed spa experience for a pampering date", vibes:["luxurious","relaxing","romantic"] },
  { id:"v_141", name:"UR SPA", area:"mont-kiara", type:"entertainment", tags:["spa","couple-spa","relaxing","pampering","romantic"], priceRange:[60,150], estimatedCost:100, hours:{open:"10:00",close:"22:00"}, daysOpen:["mon","tue","wed","thu","fri","sat","sun"], introvertFriendly:true, bestTimeSlots:["afternoon"], dateLength:["medium"], loveLanguages:["quality-time","acts"], description:"Couple spa treatments with relaxing ambiance", vibes:["relaxing","romantic","pampering"] }
];


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: TRAVEL ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function getTravelKey(fromArea, toArea) {
  if (fromArea === toArea) return null;
  const key1 = `${fromArea}->${toArea}`;
  const key2 = `${toArea}->${fromArea}`;
  return TRAVEL_TIMES[key1] || TRAVEL_TIMES[key2] || null;
}

function getTrafficMultiplier(dayType, timeSlot) {
  const isWeekend = dayType === "weekend";
  const timeMap = {
    "morning": isWeekend ? "weekend_morning" : "weekday_morning",
    "afternoon": isWeekend ? "weekend_afternoon" : "weekday_lunch",
    "evening": isWeekend ? "weekend_evening" : "weekday_evening",
    "night": isWeekend ? "weekend_night" : "weekday_night"
  };
  return TRAFFIC_MULTIPLIERS[timeMap[timeSlot] || "weekday_lunch"] || 1.0;
}

function estimateTravelTime(fromArea, toArea, dayType, timeSlot) {
  if (fromArea === toArea) return { minutes: 5, distance: 0, fuelCost: 0 };
  const travel = getTravelKey(fromArea, toArea);
  if (!travel) {
    // Estimate based on straight-line distance
    return { minutes: 25, distance: 15, fuelCost: 15 * FUEL_COST_PER_KM };
  }
  const multiplier = getTrafficMultiplier(dayType, timeSlot);
  const adjustedTime = Math.round(travel.car * multiplier);
  const fuelCost = Math.round(travel.distance * FUEL_COST_PER_KM * 2); // round trip factor
  return { minutes: adjustedTime, distance: travel.distance, fuelCost };
}

function calculateRouteDetails(route, dayType, startTimeSlot) {
  let totalMinutes = 0;
  let totalDistance = 0;
  let totalFuelCost = 0;
  const legs = [];

  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i];
    const to = route[i + 1];
    const timeSlot = i === 0 ? startTimeSlot : getTimeSlotFromMinutes(totalMinutes, startTimeSlot);
    const travel = estimateTravelTime(from, to, dayType, timeSlot);
    legs.push({
      from, to,
      minutes: travel.minutes,
      distance: travel.distance,
      fuelCost: travel.fuelCost
    });
    totalMinutes += travel.minutes;
    totalDistance += travel.distance;
    totalFuelCost += travel.fuelCost;
  }

  return { totalMinutes, totalDistance, totalFuelCost: Math.round(totalFuelCost), legs };
}

function getTimeSlotFromMinutes(elapsedMinutes, startSlot) {
  const slotStarts = { morning: 480, afternoon: 720, evening: 1080, night: 1260 };
  const startMin = slotStarts[startSlot] || 720;
  const currentMin = startMin + elapsedMinutes;
  if (currentMin < 720) return "morning";
  if (currentMin < 1080) return "afternoon";
  if (currentMin < 1260) return "evening";
  return "night";
}

function calculateFatigue(totalTravelMinutes, totalActivityMinutes, venueCount) {
  // Fatigue score 0-10 (0 = no fatigue, 10 = exhausting)
  const travelFatigue = Math.min(5, totalTravelMinutes / 30);
  const activityFatigue = Math.min(3, totalActivityMinutes / 120);
  const venueHopping = Math.min(2, (venueCount - 1) * 0.5);
  return Math.min(10, Math.round((travelFatigue + activityFatigue + venueHopping) * 10) / 10);
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: DATA LAYER (Preserves all existing localStorage data)
// ─────────────────────────────────────────────────────────────────────────────

function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function setData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ── Profile ──────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  name: "", birthday: "", loveLanguage: "quality-time", introvertLevel: 5,
  budgetComfort: "medium",
  likes: { food: [], activities: [], aesthetic: [] },
  dislikes: { food: [], activities: [] },
  emotionalTriggers: { happy: [], stress: [], comfort: [] },
  specialDates: { anniversary: "", firstDate: "", memorable: [] }
};

function getProfile() {
  const stored = getData("mochi_profile", null);
  if (!stored) return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  return {
    ...DEFAULT_PROFILE, ...stored,
    likes: { ...DEFAULT_PROFILE.likes, ...(stored.likes || {}) },
    dislikes: { ...DEFAULT_PROFILE.dislikes, ...(stored.dislikes || {}) },
    emotionalTriggers: { ...DEFAULT_PROFILE.emotionalTriggers, ...(stored.emotionalTriggers || {}) },
    specialDates: { ...DEFAULT_PROFILE.specialDates, ...(stored.specialDates || {}) }
  };
}
function saveProfile(profile) { setData("mochi_profile", profile); updateSidebarName(); }

// ── Dates ────────────────────────────────────────────────────────────────────
function getDates() { return getData("mochi_dates", []).sort((a, b) => (b.date || "").localeCompare(a.date || "")); }
function addDate(dateEntry) { const dates = getData("mochi_dates", []); dates.push(dateEntry); setData("mochi_dates", dates); }
function deleteDate(id) { setData("mochi_dates", getData("mochi_dates", []).filter(d => d.id !== id)); }

// ── Budget ───────────────────────────────────────────────────────────────────
const DEFAULT_BUDGET = { monthlyBudget: 300, currency: "RM", expenses: [] };
function getBudget() {
  const stored = getData("mochi_budget", null);
  if (!stored) return { ...DEFAULT_BUDGET, expenses: [] };
  return { ...DEFAULT_BUDGET, ...stored, expenses: stored.expenses || [] };
}
function saveBudget(budget) { setData("mochi_budget", budget); }
function addExpense(expense) { const b = getBudget(); b.expenses.push(expense); saveBudget(b); }
function deleteExpense(id) { const b = getBudget(); b.expenses = b.expenses.filter(e => e.id !== id); saveBudget(b); }
function getCurrentMonthExpenses() {
  const budget = getBudget(); const now = new Date();
  return budget.expenses.filter(e => { if (!e.date) return false; const d = new Date(e.date + "T00:00:00"); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
}
function getMonthlySpent() { return getCurrentMonthExpenses().reduce((s, e) => s + (parseFloat(e.amount) || 0), 0); }
function getRemainingBudget() { return Math.max(0, getBudget().monthlyBudget - getMonthlySpent()); }

// ── Gifts ────────────────────────────────────────────────────────────────────
function getGifts() { return getData("mochi_gifts", []); }
function addGift(gift) { const g = getGifts(); g.push(gift); setData("mochi_gifts", g); }
function toggleGiftGiven(id) { const g = getGifts(); const gift = g.find(x => x.id === id); if (gift) { gift.given = !gift.given; setData("mochi_gifts", g); } }
function deleteGift(id) { setData("mochi_gifts", getGifts().filter(g => g.id !== id)); }

// ── Reminders ────────────────────────────────────────────────────────────────
function getReminders() { return getData("mochi_reminders", []); }
function addReminder(r) { const rems = getReminders(); rems.push(r); setData("mochi_reminders", rems); }
function deleteReminder(id) { setData("mochi_reminders", getReminders().filter(r => r.id !== id)); }
function getUpcomingReminders() {
  const reminders = getReminders(); const now = new Date(); now.setHours(0,0,0,0);
  return reminders.map(r => {
    let target = new Date(r.date + "T00:00:00");
    if (r.recurring && r.recurring !== "none") {
      const today = new Date(now);
      if (r.recurring === "yearly") { target.setFullYear(today.getFullYear()); if (target < today) target.setFullYear(today.getFullYear() + 1); }
      else if (r.recurring === "monthly") { target.setFullYear(today.getFullYear()); target.setMonth(today.getMonth()); if (target < today) target.setMonth(today.getMonth() + 1); }
      else if (r.recurring === "weekly") { const diff = ((target.getDay() - today.getDay()) + 7) % 7 || 7; target = new Date(today); target.setDate(today.getDate() + (diff === 7 && target >= today ? 0 : diff)); }
    }
    const daysUntilVal = Math.ceil((target - now) / 86400000);
    return { ...r, _daysUntil: daysUntilVal, _nextDate: target };
  }).sort((a, b) => a._daysUntil - b._daysUntil);
}

// ── NEW: Venue Performance Data ──────────────────────────────────────────────
function getVenuePerformance() { return getData("mochi_venue_performance", {}); }
function saveVenuePerformance(data) { setData("mochi_venue_performance", data); }
function recordVenueVisit(venueId, rating, herRating, notes) {
  const perf = getVenuePerformance();
  if (!perf[venueId]) perf[venueId] = { visits: 0, totalRating: 0, totalHerRating: 0, lastVisit: null, history: [] };
  perf[venueId].visits++;
  perf[venueId].totalRating += rating;
  perf[venueId].totalHerRating += herRating;
  perf[venueId].lastVisit = todayStr();
  perf[venueId].history.push({ date: todayStr(), rating, herRating, notes });
  saveVenuePerformance(perf);
}

// ── NEW: Date Plans History ──────────────────────────────────────────────────
function getDatePlans() { return getData("mochi_date_plans", []); }
function saveDatePlan(plan) { const plans = getDatePlans(); plans.push(plan); setData("mochi_date_plans", plans); }
function updateDatePlan(planId, updates) {
  const plans = getDatePlans();
  const idx = plans.findIndex(p => p.id === planId);
  if (idx >= 0) { plans[idx] = { ...plans[idx], ...updates }; setData("mochi_date_plans", plans); }
}

// ── NEW: Discovery Log ───────────────────────────────────────────────────────
function getDiscoveryLog() { return getData("mochi_discovery", {}); }
function saveDiscoveryLog(log) { setData("mochi_discovery", log); }
function markVenueDiscovered(venueId) {
  const log = getDiscoveryLog();
  if (!log[venueId]) log[venueId] = { discovered: todayStr(), visited: false };
  saveDiscoveryLog(log);
}
function markVenueVisited(venueId) {
  const log = getDiscoveryLog();
  if (!log[venueId]) log[venueId] = { discovered: todayStr(), visited: true, firstVisit: todayStr() };
  else { log[venueId].visited = true; log[venueId].firstVisit = log[venueId].firstVisit || todayStr(); }
  saveDiscoveryLog(log);
}
function getUnvisitedVenues() {
  const log = getDiscoveryLog();
  return VENUES_DB.filter(v => !log[v.id] || !log[v.id].visited);
}

// ── NEW: Learning Weights ────────────────────────────────────────────────────
function getLearningWeights() {
  return getData("mochi_learning", {
    preferredAreas: {},    // area -> score based on past ratings
    preferredTypes: {},    // type -> score
    preferredVibes: {},    // vibe -> score
    preferredTags: {},     // tag -> score
    avoidAreas: {},        // areas with bad experiences
    bestTimeSlots: {},     // timeSlot -> avg rating
    optimalBudgetRange: { min: 30, max: 100 },
    optimalTravelTime: 30, // preferred max one-way travel in minutes
    totalDatesAnalyzed: 0
  });
}
function saveLearningWeights(w) { setData("mochi_learning", w); }
function updateLearningFromDate(dateEntry, venues) {
  const w = getLearningWeights();
  w.totalDatesAnalyzed++;
  const rating = dateEntry.rating || 5;
  const weight = rating / 10;

  venues.forEach(v => {
    // Update area preference
    w.preferredAreas[v.area] = (w.preferredAreas[v.area] || 5) * 0.8 + rating * 0.2;
    // Update type preference
    w.preferredTypes[v.type] = (w.preferredTypes[v.type] || 5) * 0.8 + rating * 0.2;
    // Update vibe preferences
    (v.vibes || []).forEach(vibe => {
      w.preferredVibes[vibe] = (w.preferredVibes[vibe] || 5) * 0.8 + rating * 0.2;
    });
    // Update tag preferences
    (v.tags || []).forEach(tag => {
      w.preferredTags[tag] = (w.preferredTags[tag] || 5) * 0.8 + rating * 0.2;
    });
    // Track bad experiences
    if (rating <= 3) {
      w.avoidAreas[v.area] = (w.avoidAreas[v.area] || 0) + 1;
    }
  });

  saveLearningWeights(w);
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: DATE PLANNING BRAIN 🧠 (Hub-Based Natural Flow)
// ─────────────────────────────────────────────────────────────────────────────
// Instead of hopping between different locations for 1 activity each,
// this planner picks ONE area/mall hub and plans multiple activities there.
// The flow feels natural: arrive → meal → activity → walk/shop → dessert → drive back → car moments → goodbye

// Areas that are close enough to walk between
const NEARBY_AREAS = {
  "mid-valley": ["mid-valley"],
  "bangsar": ["bangsar"],
  "bukit-bintang": ["bukit-bintang"],
  "klcc": ["klcc"],
  "sunway": ["sunway"],
  "1-utama": ["1-utama", "ttdi"],
  "ttdi": ["ttdi", "1-utama"],
  "damansara": ["damansara", "kota-damansara", "ara-damansara"],
  "kota-damansara": ["kota-damansara", "damansara"],
  "ara-damansara": ["ara-damansara", "damansara"],
  "pj": ["pj", "ss2", "ss15"],
  "ss2": ["ss2", "pj"],
  "ss15": ["ss15", "pj"],
  "sri-hartamas": ["sri-hartamas", "mont-kiara", "desa-park-city", "publika"],
  "mont-kiara": ["mont-kiara", "sri-hartamas", "publika"],
  "desa-park-city": ["desa-park-city", "kepong"],
  "publika": ["publika", "sri-hartamas", "mont-kiara"],
  "petaling-street": ["petaling-street"],
  "cheras": ["cheras"],
  "putrajaya": ["putrajaya"],
  "sentul": ["sentul"],
  "seri-kembangan": ["seri-kembangan"],
  "pavilion": ["pavilion", "bukit-bintang"],
  "kepong": ["kepong", "desa-park-city"],
  "nu-sentral": ["nu-sentral"],
  "the-curve": ["the-curve", "1-utama"]
};

// Car moments — the best part of the drive back
const CAR_MOMENTS = [
  {
    title: "Car Singing Session",
    emoji: "🎵",
    description: "Crank up the Bluetooth, play your couple playlist, and belt out songs together. The worse you sing, the more she'll laugh!",
    duration: 15,
    tips: ["Queue her fav songs beforehand on Spotify", "Include Disney duets & Ed Sheeran", "Record a funny video if she's comfortable", "Prepare a 'guess the song' game"],
    timePreference: "any"
  },
  {
    title: "Park & Heart-to-Heart",
    emoji: "💬",
    description: "Find a quiet spot near her place, recline the seats slightly, and just talk. About dreams, memories, silly what-ifs. No phones allowed.",
    duration: 20,
    tips: ["Find a quiet residential street or empty parking area", "Bring a small snack to share during the chat", "Ask deep questions — future plans, childhood memories, fears", "Hold her hand while talking"],
    timePreference: "evening"
  },
  {
    title: "Make Out & Cuddle Session",
    emoji: "💋",
    description: "Before saying goodbye, park somewhere private. Hold her close, tell her something specific you loved about today. Make the goodbye unforgettable.",
    duration: 15,
    tips: ["Find a dimly lit but safe parking spot", "Have mints ready (trust me on this one)", "Tell her one specific thing you loved about the date", "Play soft R&B in the background", "Don't rush it — let the moment breathe"],
    timePreference: "evening"
  },
  {
    title: "Scenic Night Cruise",
    emoji: "🌃",
    description: "Take a slightly longer scenic route back through KL's city lights. Drive slow, windows down, neon reflections everywhere. Main character energy.",
    duration: 20,
    tips: ["Route through KLCC / Jalan Sultan Ismail for skyline views", "Play lo-fi or chill R&B playlist", "Point out pretty buildings and lights together", "Stop at a nice viewpoint if you spot one"],
    timePreference: "night"
  },
  {
    title: "Stargazing from the Car",
    emoji: "🌟",
    description: "Drive to a spot with less light pollution, recline seats, and look at the sky through the windshield together. Peaceful and romantic.",
    duration: 25,
    tips: ["Putrajaya or Cyberjaya has less light pollution", "Download a stargazing app to identify constellations", "Bring a small blanket in case you sit outside", "Play calming ambient music softly"],
    timePreference: "night"
  },
  {
    title: "Drive-Through Snack Run",
    emoji: "🍦",
    description: "Hit up a McD drive-through or grab ice cream together on the way back. Simple, sweet, and gives you more time to chat in the car.",
    duration: 15,
    tips: ["McD McFlurry or Baskin Robbins drive-through works great", "Share one dessert for extra cuteness points", "Park and eat together in the car while talking"],
    timePreference: "any"
  }
];

// What activity slots to fill based on time & duration
function getActivityOrder(startTime, dateType) {
  const orders = {
    morning: {
      quick: ["meal"],
      short: ["meal", "activity"],
      half: ["meal", "activity", "walk_or_shop", "dessert"],
      full: ["meal", "activity", "walk_or_shop", "meal2", "activity2", "dessert"]
    },
    afternoon: {
      quick: ["meal"],
      short: ["meal", "activity"],
      half: ["meal", "activity", "dessert_or_cafe", "walk_or_shop"],
      full: ["meal", "activity", "walk_or_shop", "dessert_or_cafe", "meal2"]
    },
    evening: {
      quick: ["meal"],
      short: ["meal", "activity"],
      half: ["meal", "activity", "dessert_or_cafe"],
      full: ["activity", "meal", "dessert_or_cafe", "walk_or_shop"]
    },
    night: {
      quick: ["meal"],
      short: ["meal", "activity"],
      half: ["meal", "activity", "dessert"],
      full: ["meal", "activity", "dessert", "walk_or_shop"]
    }
  };
  return orders[startTime]?.[dateType] || ["meal", "activity"];
}

// Map each slot to acceptable venue types
const SLOT_TO_TYPES = {
  meal: ["restaurant", "cafe"],
  meal2: ["restaurant", "cafe"],
  activity: ["movie", "entertainment", "outdoor", "art"],
  activity2: ["entertainment", "outdoor", "art"],
  walk_or_shop: ["shopping", "outdoor"],
  dessert: ["cafe"],
  dessert_or_cafe: ["cafe"],
  dessert_or_drinks: ["cafe"],
  walk: ["outdoor", "shopping"]
};

function getSlotLabel(slot) {
  const labels = {
    meal: "Meal time", meal2: "Second meal",
    activity: "Main activity", activity2: "Bonus activity",
    walk_or_shop: "Walk around & explore", dessert: "Dessert break",
    dessert_or_cafe: "Cafe / Dessert stop", dessert_or_drinks: "Drinks / Dessert",
    walk: "Walk & chill"
  };
  return labels[slot] || "Activity";
}

function getTypeEmoji(type) {
  return { cafe: "☕", restaurant: "🍽️", movie: "🎬", outdoor: "🌿", entertainment: "🎮", shopping: "🛍️", art: "🎨", "night-market": "🏮", home: "🏠" }[type] || "✨";
}

function getActivityDuration(venue) {
  return { cafe: 45, restaurant: 75, movie: 150, outdoor: 60, entertainment: 90, shopping: 60, art: 60, "night-market": 60, home: 60 }[venue.type] || 60;
}

function getTravelKey(from, to) {
  const key1 = `${from}->${to}`;
  const key2 = `${to}->${from}`;
  return TRAVEL_TIMES[key1] || TRAVEL_TIMES[key2] || null;
}

// ── CORE PLANNER ────────────────────────────────────────────────────────────

function generateDatePlans(options) {
  const { dateType, budget, dayType, startTime, herMood, preferences } = options;
  const profile = getProfile();
  const venuePerf = getVenuePerformance();
  const learning = getLearningWeights();
  const thinkingLog = [];

  thinkingLog.push({ step: "🔍 Analyzing your date", detail: `RM${budget} | ${dateType} | ${dayType} ${startTime}` });

  // Step 1: Determine natural activity flow
  const activityOrder = getActivityOrder(startTime, dateType);
  thinkingLog.push({ step: "📋 Planned natural flow", detail: activityOrder.map(s => s.replace(/_/g, " ")).join(" → ") });

  // Step 2: Find hub areas that can support the whole flow
  const hubCandidates = findHubAreas(activityOrder, dayType);
  thinkingLog.push({ step: "📍 Found hub areas", detail: `${hubCandidates.length} areas with all needed activities` });

  // Step 3: Score each hub based on preferences, travel, past dates
  const scoredHubs = hubCandidates.map(hub =>
    scoreHub(hub, profile, venuePerf, learning, budget, preferences, herMood)
  );
  scoredHubs.sort((a, b) => b.score - a.score);
  if (scoredHubs.length > 0) {
    thinkingLog.push({ step: "🧠 Top area pick", detail: `${scoredHubs[0].hubName} (score: ${scoredHubs[0].score})` });
  }

  // Step 4: Build full date plans from the best hubs
  const plans = [];
  const usedAreas = new Set();

  for (const hub of scoredHubs.slice(0, 10)) {
    if (usedAreas.has(hub.mainArea)) continue;
    usedAreas.add(hub.mainArea);

    const plan = buildPlanFromHub(hub, activityOrder, profile, venuePerf, budget, dayType, startTime, herMood, preferences, dateType);
    if (plan) plans.push(plan);
    if (plans.length >= 5) break;
  }

  thinkingLog.push({ step: "📝 Plans generated", detail: `${plans.length} natural date flows ready` });
  thinkingLog.push({ step: "💝 Adding car moments", detail: "Singing sessions, heart-to-hearts & sweet goodbyes included" });

  plans.sort((a, b) => b.overallScore - a.overallScore);
  return { plans, thinkingLog };
}

function findHubAreas(activityOrder, dayType) {
  const dayName = dayType === "weekend" ? "sat" : "mon";

  // Group all venues by their walkable area cluster
  const areaVenues = {};
  VENUES_DB.forEach(v => {
    const isOpen = v.daysOpen.includes(dayName) || (dayType === "weekend" && (v.daysOpen.includes("sat") || v.daysOpen.includes("sun")));
    if (!isOpen) return;

    const cluster = NEARBY_AREAS[v.area] || [v.area];
    cluster.forEach(hubKey => {
      if (!areaVenues[hubKey]) areaVenues[hubKey] = [];
      if (!areaVenues[hubKey].find(x => x.id === v.id)) {
        areaVenues[hubKey].push(v);
      }
    });
    // Always add to own area
    if (!areaVenues[v.area]) areaVenues[v.area] = [];
    if (!areaVenues[v.area].find(x => x.id === v.id)) {
      areaVenues[v.area].push(v);
    }
  });

  // Check which areas can satisfy all activity slots
  const hubs = [];
  for (const [area, venues] of Object.entries(areaVenues)) {
    const availableTypes = new Set(venues.map(v => v.type));

    let canSatisfy = true;
    for (const slot of activityOrder) {
      const neededTypes = SLOT_TO_TYPES[slot];
      if (!neededTypes) continue;
      if (!neededTypes.some(t => availableTypes.has(t))) { canSatisfy = false; break; }
    }

    if (canSatisfy && venues.length >= activityOrder.length) {
      hubs.push({
        mainArea: area,
        hubName: area.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        venues,
        types: availableTypes,
        diversity: availableTypes.size
      });
    }
  }
  return hubs;
}

function scoreHub(hub, profile, venuePerf, learning, budget, preferences, herMood) {
  let score = 50;
  const reasons = [];
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());

  // Travel convenience from TTDI
  const travel = getTravelKey("ttdi", hub.mainArea);
  if (travel) {
    if (travel.car <= 12) { score += 15; reasons.push("Very close to her place — minimal driving!"); }
    else if (travel.car <= 20) { score += 8; reasons.push("Easy drive from TTDI"); }
    else if (travel.car <= 30) { score += 3; }
    else if (travel.car > 45) { score -= 10; reasons.push("Long drive — might be tiring"); }
  }

  // How well venues match her likes
  let likeMatches = 0;
  hub.venues.forEach(v => {
    v.tags.forEach(tag => {
      if (allLikes.some(l => tag.toLowerCase().includes(l) || l.includes(tag.toLowerCase()))) likeMatches++;
    });
  });
  score += Math.min(20, likeMatches * 2);
  if (likeMatches >= 5) reasons.push("Lots of things she loves here");

  // Area diversity
  if (hub.diversity >= 4) { score += 8; reasons.push("Great variety — food, fun, shopping all in one spot"); }
  else if (hub.diversity >= 3) { score += 4; reasons.push("Good mix of activities"); }

  // Past performance in this area
  hub.venues.forEach(v => {
    const perf = venuePerf[v.id];
    if (perf && perf.visits > 0) {
      const avg = perf.totalHerRating / perf.visits;
      if (avg >= 8) { score += 3; }
      else if (avg < 4) { score -= 2; }
    }
  });

  // Mood match
  if (herMood === "stressed" || herMood === "tired") {
    const hasQuiet = hub.venues.some(v => v.introvertFriendly);
    if (hasQuiet) { score += 5; reasons.push("Has relaxing spots for her mood"); }
  }

  // Learning weights
  if (learning.preferredAreas && learning.preferredAreas[hub.mainArea] > 7) {
    score += 8; reasons.push("You both love this area");
  }

  // User preferences match
  preferences.forEach(pref => {
    const p = pref.toLowerCase();
    const m = hub.venues.filter(v =>
      v.tags.some(t => t.toLowerCase().includes(p)) ||
      v.name.toLowerCase().includes(p) ||
      v.description.toLowerCase().includes(p)
    );
    if (m.length > 0) { score += 10; reasons.push(`Has "${pref}" options`); }
  });

  // Budget check — area average cost
  const avgCost = hub.venues.reduce((s, v) => s + v.estimatedCost, 0) / hub.venues.length;
  if (avgCost <= budget * 0.2) { score += 5; reasons.push("Very budget-friendly area"); }

  return { ...hub, score: Math.max(0, Math.min(100, score)), reasons };
}

function buildPlanFromHub(hub, activityOrder, profile, venuePerf, budget, dayType, startTime, herMood, preferences, dateType) {
  const planVenues = [];
  let planBudget = 0;
  const usedIds = new Set();
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());
  const allDislikes = [...(profile.dislikes.food || []), ...(profile.dislikes.activities || [])].map(d => d.toLowerCase());

  for (const slot of activityOrder) {
    const neededTypes = SLOT_TO_TYPES[slot];
    if (!neededTypes) continue;

    let candidates = hub.venues.filter(v =>
      neededTypes.includes(v.type) && !usedIds.has(v.id) && (planBudget + v.estimatedCost) <= budget * 1.15
    );
    if (candidates.length === 0) continue;

    candidates = candidates.map(v => {
      let s = 50;
      v.tags.forEach(tag => {
        const t = tag.toLowerCase();
        if (allLikes.some(l => t.includes(l) || l.includes(t))) s += 8;
        if (allDislikes.some(d => t.includes(d) || d.includes(t))) s -= 15;
      });
      if (herMood === "stressed" && v.introvertFriendly) s += 10;
      if (herMood === "excited" && !v.introvertFriendly) s += 5;
      if (profile.introvertLevel >= 7 && v.introvertFriendly) s += 5;
      if (v.loveLanguages && v.loveLanguages.includes(profile.loveLanguage)) s += 5;

      const perf = venuePerf[v.id];
      if (perf && perf.visits > 0) {
        const avg = perf.totalHerRating / perf.visits;
        if (avg >= 8) s += 12;
        else if (avg >= 6) s += 5;
        else if (avg < 4) s -= 15;
        if (perf.lastVisit && daysAgo(perf.lastVisit) < 14) s -= 10;
      } else {
        s += 4;
      }

      preferences.forEach(pref => {
        const p = pref.toLowerCase();
        if (v.tags.some(t => t.toLowerCase().includes(p)) || v.name.toLowerCase().includes(p)) s += 10;
      });

      return { ...v, _slotScore: s };
    });

    candidates.sort((a, b) => b._slotScore - a._slotScore);
    const picked = candidates[0];
    if (picked) {
      planVenues.push({ ...picked, _slot: slot });
      usedIds.add(picked.id);
      planBudget += picked.estimatedCost;
    }
  }

  if (planVenues.length < 2) return null;

  // Build itinerary
  const itinerary = [];
  let currentTime = startTime === "morning" ? 480 : startTime === "afternoon" ? 720 : startTime === "evening" ? 1080 : 1260;

  // Pickup
  const pickupTravel = estimateTravelTime("seri-kembangan", "ttdi", dayType, startTime);
  itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🚗 Leave from Seri Kembangan", detail: `Head to TTDI to pick her up (~${pickupTravel.minutes} min)`, duration: pickupTravel.minutes, type: "travel" });
  currentTime += pickupTravel.minutes;

  itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "💕 Pick her up from TTDI", detail: "Greet her with a smile — maybe bring her a drink or small snack you prepared", duration: 5, type: "moment" });
  currentTime += 5;

  // Drive to hub
  const hubTravel = estimateTravelTime("ttdi", hub.mainArea, dayType, startTime);
  if (hubTravel.minutes > 5) {
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: `🚗 Drive to ${hub.hubName}`, detail: `Chat and vibe on the way (~${hubTravel.minutes} min, ${hubTravel.distance}km)`, duration: hubTravel.minutes, type: "travel" });
    currentTime += hubTravel.minutes;
  }

  // Activities at the hub
  planVenues.forEach((venue, i) => {
    if (i > 0) {
      itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🚶 Walk over", detail: `Short stroll to ${venue.name} (~5 min)`, duration: 5, type: "transition" });
      currentTime += 5;
    }
    const slotLabel = getSlotLabel(venue._slot);
    const actTime = getActivityDuration(venue);
    const emoji = getTypeEmoji(venue.type);
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: `${emoji} ${venue.name}`, detail: `${slotLabel} — ${venue.description} (~${actTime} min, ~RM${venue.estimatedCost})`, duration: actTime, venueId: venue.id, type: "activity" });
    currentTime += actTime;
  });

  // Drive back + car moments
  const returnTravel = estimateTravelTime(hub.mainArea, "ttdi", dayType, "evening");

  itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🚗 Head back toward her place", detail: `Start driving back to TTDI (~${returnTravel.minutes} min)`, duration: returnTravel.minutes, type: "travel" });
  currentTime += returnTravel.minutes;

  // Pick car moments
  const carMomentsPicked = pickCarMoments(startTime, currentTime);
  carMomentsPicked.forEach(cm => {
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: `${cm.emoji} ${cm.title}`, detail: cm.description, duration: cm.duration, type: "car_moment", tips: cm.tips });
    currentTime += cm.duration;
  });

  // Sweet goodbye
  itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "💝 Sweet goodbye at her place", detail: "Walk her to her door, hug tight, tell her you had an amazing time. Kiss goodnight 💋", duration: 10, type: "moment" });
  currentTime += 10;

  // Drive home
  const homeTravel = estimateTravelTime("ttdi", "seri-kembangan", dayType, "night");
  itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🏠 Drive home", detail: `Back to Seri Kembangan (~${homeTravel.minutes} min). Text her 'reached home safely' 📱`, duration: homeTravel.minutes, type: "travel" });

  // Totals
  const activityMinutes = planVenues.reduce((sum, v) => sum + getActivityDuration(v), 0);
  const travelMinutes = pickupTravel.minutes + (hubTravel.minutes || 0) + returnTravel.minutes + homeTravel.minutes;
  const carMomentMinutes = carMomentsPicked.reduce((s, m) => s + m.duration, 0);
  const walkMinutes = Math.max(0, (planVenues.length - 1) * 5);
  const totalMinutes = travelMinutes + activityMinutes + carMomentMinutes + walkMinutes + 15;
  const totalDistance = (pickupTravel.distance || 0) + (hubTravel.distance || 0) + (returnTravel.distance || 0) + (homeTravel.distance || 0);
  const fuelCost = Math.round(totalDistance * FUEL_COST_PER_KM);
  const totalCost = planBudget + fuelCost;
  const fatigue = calculateFatigue(travelMinutes, activityMinutes, 1);

  const theme = generatePlanTheme(planVenues, hub.hubName);

  return {
    id: generateId("plan"),
    theme,
    hubArea: hub.hubName,
    venues: planVenues.map(v => ({
      id: v.id, name: v.name, area: v.area, type: v.type,
      cost: v.estimatedCost, score: v._slotScore, slot: v._slot,
      reasons: getVenueReasons(v, profile, venuePerf, preferences)
    })),
    itinerary,
    carMoments: carMomentsPicked.map(m => m.title),
    route: ["seri-kembangan", "ttdi", hub.mainArea, "ttdi", "seri-kembangan"],
    budget: { food: planBudget, transport: fuelCost, total: totalCost },
    time: { travel: travelMinutes, activity: activityMinutes, carMoments: carMomentMinutes, total: totalMinutes },
    distance: totalDistance,
    fatigue,
    dateType,
    overallScore: Math.round(planVenues.reduce((s, v) => s + v._slotScore, 0) / planVenues.length)
  };
}

function pickCarMoments(startTime, currentTimeMinutes) {
  const timeOfDay = currentTimeMinutes >= 1260 ? "night" : currentTimeMinutes >= 1080 ? "evening" : "afternoon";
  const moments = [...CAR_MOMENTS];

  // Shuffle for variety
  for (let i = moments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moments[i], moments[j]] = [moments[j], moments[i]];
  }

  const picked = [];

  if (timeOfDay === "night" || timeOfDay === "evening") {
    // Romantic moments: always include make out + one more
    const makeOut = moments.find(m => m.title.includes("Make Out"));
    if (makeOut) picked.push(makeOut);
    const others = moments.filter(m => !m.title.includes("Make Out") && (m.timePreference === "any" || m.timePreference === timeOfDay));
    if (others.length > 0) picked.push(others[0]);
  } else {
    // Daytime: fun moments
    const singing = moments.find(m => m.title.includes("Singing"));
    if (singing) picked.push(singing);
    const talk = moments.find(m => m.title.includes("Heart"));
    if (talk) picked.push(talk);
  }

  return picked.length > 0 ? picked : [moments[0]];
}

function getVenueReasons(venue, profile, venuePerf, preferences) {
  const reasons = [];
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());

  let likeMatches = 0;
  venue.tags.forEach(tag => {
    if (allLikes.some(l => tag.toLowerCase().includes(l) || l.includes(tag.toLowerCase()))) likeMatches++;
  });
  if (likeMatches > 0) reasons.push(`Matches ${likeMatches} of her likes`);

  const perf = venuePerf[venue.id];
  if (perf && perf.visits > 0) {
    const avg = (perf.totalHerRating / perf.visits).toFixed(1);
    if (avg >= 8) reasons.push("She loved it last time! (" + avg + "/10)");
    else if (avg >= 6) reasons.push("Good past experience (" + avg + "/10)");
  } else {
    reasons.push("New spot to explore together!");
  }

  if (venue.introvertFriendly && profile.introvertLevel >= 7) reasons.push("Quiet & comfortable for her");
  if (venue.loveLanguages && venue.loveLanguages.includes(profile.loveLanguage)) reasons.push("Matches her love language");

  preferences.forEach(pref => {
    if (venue.tags.some(t => t.toLowerCase().includes(pref.toLowerCase())) || venue.name.toLowerCase().includes(pref.toLowerCase())) {
      reasons.push('You wanted: "' + pref + '"');
    }
  });

  return reasons;
}

function generatePlanTheme(venues, hubName) {
  const types = venues.map(v => v.type);
  const area = hubName || "the area";

  if (types.includes("movie") && types.includes("restaurant")) return "🎬 Dinner & Movie at " + area;
  if (types.includes("movie") && types.includes("cafe")) return "🎬 Movie & Cafe Day at " + area;
  if (types.includes("movie")) return "🎬 Movie Date at " + area;
  if (types.includes("entertainment") && types.includes("restaurant")) return "🎮 Fun & Food at " + area;
  if (types.includes("outdoor") && types.includes("cafe")) return "🌿 Nature & Cafe Vibes at " + area;
  if (types.includes("outdoor")) return "🌿 Outdoor Day at " + area;
  if (types.includes("art")) return "🎨 Artsy Date at " + area;
  if (types.includes("shopping") && types.includes("restaurant")) return "🛍️ Eat, Shop & Chill at " + area;
  if (types.includes("cafe") && types.length <= 2) return "☕ Cozy Cafe Date at " + area;
  if (types.includes("restaurant") && types.includes("shopping")) return "🍽️ Dine & Explore at " + area;
  return "💕 Day Out at " + area;
}

function formatTimeFromMinutes(minutes) {
  let h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + String(m).padStart(2, "0") + " " + ampm;
}

function daysAgo(dateString) {
  if (!dateString) return Infinity;
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: SUGGESTION SCORING ENGINE (Enhanced)
// ─────────────────────────────────────────────────────────────────────────────

// Legacy suggestions mapped to venues for backward compat
const SUGGESTIONS_DB = VENUES_DB.map(v => ({
  name: v.name,
  type: v.type,
  tags: v.tags,
  estimatedCost: v.estimatedCost,
  description: v.description,
  introvertFriendly: v.introvertFriendly,
  loveLanguages: v.loveLanguages || ["quality-time"],
  category: v.type === "cafe" || v.type === "restaurant" ? "food" : v.type === "outdoor" ? "outdoor" : "entertainment",
  venueId: v.id,
  area: v.area
}));

function calculateLikeMatch(suggestion, profile) {
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());
  const allDislikes = [...(profile.dislikes.food || []), ...(profile.dislikes.activities || [])].map(d => d.toLowerCase());
  const suggestionTags = suggestion.tags.map(t => t.toLowerCase());

  let matchCount = 0, dislikeCount = 0;
  for (const tag of suggestionTags) {
    if (allLikes.some(l => tag.includes(l) || l.includes(tag))) matchCount++;
    if (allDislikes.some(d => tag.includes(d) || d.includes(tag))) dislikeCount++;
  }

  let introvertBonus = 0;
  if (profile.introvertLevel >= 7 && suggestion.introvertFriendly) introvertBonus = 1;
  if (profile.introvertLevel <= 3 && !suggestion.introvertFriendly) introvertBonus = 1;

  let loveBonus = 0;
  if (suggestion.loveLanguages && suggestion.loveLanguages.includes(profile.loveLanguage)) loveBonus = 1;

  const maxPossible = Math.max(suggestionTags.length, 1);
  let score = ((matchCount - dislikeCount) / maxPossible) * 8 + introvertBonus + loveBonus;

  // Learning bonus
  const learning = getLearningWeights();
  if (suggestion.area && learning.preferredAreas[suggestion.area] > 7) score += 1;
  suggestion.tags.forEach(tag => {
    if (learning.preferredTags[tag.toLowerCase()] > 7) score += 0.3;
  });

  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

function calculateBudgetFit(suggestion, remainingBudget) {
  if (remainingBudget <= 0) return suggestion.estimatedCost <= 0 ? 10 : 1;
  if (suggestion.estimatedCost <= remainingBudget) return 10;
  if (suggestion.estimatedCost <= remainingBudget * 1.2) return 7;
  if (suggestion.estimatedCost <= remainingBudget * 1.5) return 4;
  return 1;
}

function calculatePastSuccess(suggestion, dates) {
  // Check venue performance first
  if (suggestion.venueId) {
    const perf = getVenuePerformance()[suggestion.venueId];
    if (perf && perf.visits > 0) {
      const avg = perf.totalHerRating / perf.visits;
      return Math.max(0, Math.min(10, avg));
    }
  }
  const matchingDates = dates.filter(d => {
    if (d.type === suggestion.type) return true;
    const dTags = (d.tags || []).map(t => t.toLowerCase());
    const sTags = suggestion.tags.map(t => t.toLowerCase());
    return sTags.some(st => dTags.includes(st));
  });
  if (matchingDates.length === 0) return 5;
  return Math.max(0, Math.min(10, matchingDates.reduce((sum, d) => sum + (d.rating || 5), 0) / matchingDates.length));
}

function calculateNovelty(suggestion, dates) {
  if (suggestion.venueId) {
    const perf = getVenuePerformance()[suggestion.venueId];
    if (!perf || perf.visits === 0) return 10; // Never visited
    const daysSince = daysAgo(perf.lastVisit);
    if (daysSince > 60) return 9;
    if (daysSince > 30) return 7;
    if (daysSince > 14) return 5;
    if (daysSince >= 7) return 3;
    return 1;
  }
  const matchingDates = dates.filter(d => d.type === suggestion.type);
  if (matchingDates.length === 0) return 10;
  const sorted = matchingDates.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const daysSince = daysAgo(sorted[0].date);
  if (daysSince > 30) return 8;
  if (daysSince > 14) return 5;
  if (daysSince >= 7) return 3;
  return 2;
}

function scoreSuggestion(suggestion, profile, dates, remainingBudget) {
  const likeMatch = calculateLikeMatch(suggestion, profile);
  const budgetFit = calculateBudgetFit(suggestion, remainingBudget);
  const pastSuccess = calculatePastSuccess(suggestion, dates);
  const novelty = calculateNovelty(suggestion, dates);
  const total = (likeMatch * 0.35) + (budgetFit * 0.25) + (pastSuccess * 0.25) + (novelty * 0.15);
  return {
    total: Math.round(total * 10) / 10,
    likeMatch: Math.round(likeMatch * 10) / 10,
    budgetFit: Math.round(budgetFit * 10) / 10,
    pastSuccess: Math.round(pastSuccess * 10) / 10,
    novelty: Math.round(novelty * 10) / 10
  };
}

function getRankedSuggestions() {
  const profile = getProfile();
  const dates = getDates();
  const remaining = getRemainingBudget();
  return SUGGESTIONS_DB.map(suggestion => {
    const scores = scoreSuggestion(suggestion, profile, dates, remaining);
    return { ...suggestion, scores };
  }).sort((a, b) => b.scores.total - a.scores.total);
}


// ── Elaborate Surprise Generator ──────────────────────────────────────────────

const SURPRISE_PLANS = [
  {
    title: "Sunset Picnic Surprise",
    emoji: "🌅",
    theme: "romantic",
    description: "Set up a beautiful picnic by the lake at Desa Park City during golden hour. She thinks it's just a walk, but you've prepared everything.",
    location: "Desa Park City Central Park or Taman Tasik Titiwangsa",
    bestTime: "5:00 PM - 7:00 PM",
    duration: "~2.5 hours",
    budgetRange: { min: 50, max: 100 },
    whatToBring: [
      "Aesthetic picnic mat/blanket (Shopee ~RM20-30)",
      "Her favourite snacks + drinks",
      "Sandwiches or sushi from a nice deli (or homemade!)",
      "Bluetooth speaker (soft music playlist ready)",
      "Battery-powered fairy lights/LED candles (~RM15)",
      "Small bouquet of flowers",
      "Wet wipes, napkins, plastic bags for cleanup",
      "Insect repellent spray",
      "Power bank + phone for photos"
    ],
    setupSteps: [
      "1. Buy and prep everything the day before",
      "2. Arrive 30 min early to set up near the lake/park",
      "3. Lay out blanket, arrange food aesthetically",
      "4. Place fairy lights/candles around the setup",
      "5. Put flowers where she'll sit",
      "6. Queue up a romantic playlist (Lo-fi / Ed Sheeran / her favs)",
      "7. Text her: 'Picking you up in 20 min, dress comfy'"
    ],
    surpriseMoment: "When you arrive at the park, tell her you want to 'show her something.' Guide her to the spot. When she sees the setup, have your phone ready to capture her reaction! Then sit down, pour her a drink, and enjoy the sunset together.",
    giftIdeas: [
      { item: "Handwritten letter about your favourite memories together", cost: 0, whereToBuy: "Write it yourself the night before" },
      { item: "Custom photo album (Photobook app / Lalaland)", cost: 35, whereToBuy: "Photobook.com.my or Lalaland app" },
      { item: "A small potted succulent in a cute pot", cost: 20, whereToBuy: "Any plant nursery or Shopee" },
      { item: "Matching couple bracelets", cost: 30, whereToBuy: "Shopee / Pandora outlet if budget allows" }
    ],
    proTips: [
      "Check weather forecast 2 days before! Have backup indoor plan",
      "Arrive early to claim a good lakeside spot (weekends get busy)",
      "Take photos of the setup before she arrives",
      "Bring extra food — appetite in the open air is real",
      "If she loves IG, set up a cute angle for her to take photos"
    ],
    tags: ["romantic", "outdoor", "sunset", "picnic", "aesthetic"]
  },
  {
    title: "Secret Karaoke Room Party",
    emoji: "🎤",
    theme: "fun",
    description: "Tell her you're going for dinner. But secretly, you've booked and decorated a private karaoke room with balloons and her favourite snacks.",
    location: "Neway Karaoke (Bukit Bintang / 1 Utama / Mid Valley)",
    bestTime: "7:00 PM - 10:00 PM",
    duration: "~3 hours",
    budgetRange: { min: 80, max: 150 },
    whatToBring: [
      "Small helium balloons (party shop ~RM15-20 for a set)",
      "Her favourite candy/chocolate/snacks",
      "A cute card with lyrics from 'your song'",
      "Extra phone charger",
      "A surprise gift (see ideas below)",
      "List of duet songs you want to sing together"
    ],
    setupSteps: [
      "1. Book the karaoke room 1-2 days in advance (call ahead)",
      "2. Tell them you want to arrive early to 'set up' the room",
      "3. Arrive 20 min early with the balloons and decorations",
      "4. Arrange balloons, scatter some candy on the table",
      "5. Place the card on the mic stand or her seat",
      "6. Pre-select her favourite songs in the system queue",
      "7. Pick her up and go to 'dinner' first at a nearby restaurant"
    ],
    surpriseMoment: "After dinner, say 'I have one more stop tonight.' Walk her to the karaoke place. When you open the door to the decorated room, watch her jaw drop! Start with 'your song' as the first track.",
    giftIdeas: [
      { item: "Custom Spotify code keychain/plaque of 'your song'", cost: 25, whereToBuy: "Shopee — search 'custom Spotify code'" },
      { item: "Matching couple phone cases", cost: 40, whereToBuy: "Shopee or CASETiFY" },
      { item: "Wireless earbuds (for when she misses your singing)", cost: 60, whereToBuy: "Shopee / any electronics store" }
    ],
    proTips: [
      "Include her ALL-TIME fav songs, not just current hits",
      "Don't hog the mic — take turns!",
      "Record at least one duet video together",
      "Order drinks/food from the karaoke menu too — karaoke makes you hungry",
      "End with a slow romantic song dedicated to her"
    ],
    tags: ["fun", "music", "karaoke", "surprise", "celebration", "indoor"]
  },
  {
    title: "Home-Cooked Dinner Date",
    emoji: "👨‍🍳",
    theme: "intimate",
    description: "Cook her favourite meal at your place (or hers if her family's out). Candlelight, good music, and effort that shows you really care.",
    location: "Your place or her place (when family is away)",
    bestTime: "6:00 PM - 10:00 PM",
    duration: "~3-4 hours",
    budgetRange: { min: 40, max: 80 },
    whatToBring: [
      "All ingredients for the meal (buy fresh on the day)",
      "Candles (tea lights are safest, ~RM10 for a pack)",
      "Nice plates/bowls (if yours are basic, get some from Daiso ~RM12)",
      "A small tablecloth or placemat",
      "Bluetooth speaker",
      "Fresh flowers for the table",
      "Dessert (bakery cake or homemade brownies)",
      "A handwritten menu card (cute touch!)"
    ],
    setupSteps: [
      "1. Plan the menu 2-3 days ahead. Keep it simple but impressive (pasta/steak/Korean BBQ)",
      "2. Practice cooking it once if you're not confident!",
      "3. Buy fresh ingredients on the morning of the date",
      "4. Start cooking 1.5 hours before she arrives",
      "5. Set up the dining area: tablecloth, candles, flowers, dim lights",
      "6. Write a cute handwritten menu card (name the dishes funny things)",
      "7. Queue up dinner playlist: jazz or lo-fi",
      "8. Change into something nice before she arrives"
    ],
    surpriseMoment: "When she walks in and sees the candlelit setup with you in an apron saying 'Welcome to Chez Nash, table for two?', she'll melt. Present the handwritten menu dramatically like a waiter.",
    giftIdeas: [
      { item: "A jar of handwritten 'reasons I love you' notes", cost: 5, whereToBuy: "DIY — mason jar from Daiso + coloured paper" },
      { item: "Matching couple mugs for future morning coffees", cost: 25, whereToBuy: "Shopee / Typo" },
      { item: "Her favourite perfume/body mist", cost: 40, whereToBuy: "Sephora / Watson's" }
    ],
    proTips: [
      "PRACTICE the recipe beforehand! First attempt should not be on date night",
      "Keep the menu to 2-3 courses max (starter, main, dessert)",
      "Clean as you cook — nobody wants a messy kitchen",
      "Have a backup delivery app ready just in case 😅",
      "Ask about food allergies/restrictions beforehand (obviously)",
      "After dinner: do dishes together → it's actually a cute bonding moment"
    ],
    tags: ["intimate", "cooking", "home", "romantic", "effort", "indoor"]
  },
  {
    title: "Surprise Movie Marathon",
    emoji: "🎬",
    theme: "cozy",
    description: "Transform your living room into a mini cinema with projector/laptop, fairy lights, blanket fort, and all her comfort snacks.",
    location: "Your place",
    bestTime: "4:00 PM - 11:00 PM",
    duration: "~5-6 hours",
    budgetRange: { min: 30, max: 60 },
    whatToBring: [
      "Laptop or projector (borrow/rent one if needed)",
      "White bedsheet as screen (if using projector)",
      "Fairy lights & LED strip lights for ambiance",
      "ALL the blankets and pillows you own",
      "Her favourite movie snacks: popcorn, chocolate, drinks",
      "Printed 'movie tickets' with the films listed",
      "A cozy oversized hoodie for her to wear"
    ],
    setupSteps: [
      "1. Clean your room/living area thoroughly!",
      "2. Build a blanket fort or cozy nest with pillows",
      "3. String up fairy lights around the viewing area",
      "4. Set up the screen/laptop at a good viewing angle",
      "5. Prepare snack station: bowls of popcorn, candy, drinks",
      "6. Print cute 'movie tickets' (design on Canva for free)",
      "7. Download her fav movies in advance (no buffering!)",
      "8. Dim all other lights for cinema vibes"
    ],
    surpriseMoment: "Pick her up and say 'we're going to the cinema.' But instead, drive home. When she sees the transformed room, give her the printed ticket and the hoodie. Let her pick the first movie!",
    giftIdeas: [
      { item: "Matching couple pyjama set", cost: 35, whereToBuy: "Shopee / Cotton On" },
      { item: "A custom blanket with your photos printed", cost: 50, whereToBuy: "Printcious.com or Shopee" },
      { item: "Her favourite movie on Blu-ray/special edition", cost: 30, whereToBuy: "Shopee / MPH" }
    ],
    proTips: [
      "Let her choose at least half the movies",
      "Include one movie she's been wanting to watch but hasn't yet",
      "Intermission break between movies — stretch, refill snacks, bathroom",
      "No phones during the movie (both of you!)",
      "Cuddle. That's the real point of this whole thing."
    ],
    tags: ["cozy", "indoor", "movies", "blanket-fort", "relaxed"]
  },
  {
    title: "Surprise Adventure Day Trip",
    emoji: "🚗",
    theme: "adventurous",
    description: "Tell her to pack a bag and not ask questions. Take her on a surprise day trip to somewhere beautiful she hasn't been.",
    location: "Janda Baik / Sekinchan / Kuala Selangor / Broga Hill",
    bestTime: "7:00 AM (leave early!)",
    duration: "Full day ~8-10 hours",
    budgetRange: { min: 80, max: 200 },
    whatToBring: [
      "Full tank of petrol + RM50 cash for tolls/parking",
      "Packed breakfast sandwiches & drinks for the drive",
      "Sunscreen & insect repellent",
      "Extra clothes for her (in case it gets dirty/wet)",
      "Portable phone charger",
      "Umbrella (Malaysian weather is unpredictable!)",
      "Camera or phone with space for photos",
      "A curated road trip playlist",
      "Wet wipes, tissue, hand sanitizer",
      "Surprise gift to give at a scenic viewpoint"
    ],
    setupSteps: [
      "1. Research the destination 3-4 days ahead (check if anything is closed)",
      "2. Plan rest stops and meals along the way",
      "3. Download offline maps (signal can be bad in rural areas!)",
      "4. Pack everything in the car the night before",
      "5. Prepare breakfast for the car ride",
      "6. Tell her the night before: 'Be ready by 7 AM, wear comfy clothes, don't ask why'",
      "7. Pick her up with breakfast ready in the car"
    ],
    surpriseMoment: "When she gets in the car and asks 'Where are we going?', just smile and say 'You'll see.' Play her favourite road trip songs. The surprise unfolds with every kilometer as the scenery changes. Give her the gift at the most scenic spot.",
    giftIdeas: [
      { item: "Polaroid camera to capture the day (rent or buy)", cost: 60, whereToBuy: "Shopee (Instax Mini) or rent from camera shops" },
      { item: "Matching adventure couple T-shirts", cost: 30, whereToBuy: "Uniqlo / Shopee" },
      { item: "A scratch-off travel map of Malaysia", cost: 25, whereToBuy: "Shopee / Typo" }
    ],
    proTips: [
      "Check road conditions and weather forecast!",
      "Have a backup nearby destination in case of bad weather",
      "Stop at interesting roadside stalls — that's part of the fun",
      "Let her DJ the playlist sometimes",
      "Take lots of photos — candids are the best ones",
      "Plan to be back before dark unless she's comfortable with night driving"
    ],
    tags: ["adventure", "road-trip", "nature", "outdoor", "day-trip"]
  },
  {
    title: "Scrapbook & Letters Date",
    emoji: "📖",
    theme: "sentimental",
    description: "Prepare a handmade scrapbook or love letter collection and present it during a cozy cafe date. Maximum emotional damage (the good kind).",
    location: "Any cozy quiet cafe (Lisette's TTDI, Niko Neko, or a bookstore cafe)",
    bestTime: "3:00 PM - 6:00 PM",
    duration: "~2-3 hours",
    budgetRange: { min: 30, max: 60 },
    whatToBring: [
      "The completed scrapbook/letter collection",
      "Printed photos of your favourite moments together",
      "Stickers, washi tape, markers (in case she wants to add to it)",
      "A nice pen for her to write back to you",
      "Tissue packets (there WILL be happy tears)",
      "A small gift box to present it in"
    ],
    setupSteps: [
      "1. Start making the scrapbook 1-2 weeks before",
      "2. Print your best couple photos (at least 15-20)",
      "3. Write captions and memories for each photo",
      "4. Add love letters between the pages — things you've never said",
      "5. Decorate with stickers and washi tape",
      "6. Leave empty pages at the back 'for memories we haven't made yet'",
      "7. Put it in a nice gift box/bag"
    ],
    surpriseMoment: "After ordering drinks at the cafe, casually pull out the gift box and say 'I made something for you.' Watch her face as she flips through each page. Have tissues ready. This will make her cry happy tears guaranteed.",
    giftIdeas: [
      { item: "The scrapbook itself IS the gift — it's priceless", cost: 15, whereToBuy: "DIY — scrapbook from Popular/Kinokuniya + Shopee supplies" },
      { item: "A piece of jewellery she's been eyeing", cost: 50, whereToBuy: "Pandora / Shopee / her favourite brand" },
      { item: "A star map of the night sky on your anniversary/first date", cost: 30, whereToBuy: "Shopee — search 'custom star map'" }
    ],
    proTips: [
      "Start early! Good scrapbooks take time and thought",
      "Include inside jokes and references only you two understand",
      "Use nice handwriting (or print if your writing is messy)",
      "Add some silly/ugly photos too — not just perfect ones",
      "The effort matters more than how 'artsy' it looks"
    ],
    tags: ["sentimental", "creative", "diy", "letters", "heartfelt"]
  },
  {
    title: "Fairy Light Rooftop Night",
    emoji: "✨",
    theme: "romantic",
    description: "Find a rooftop or balcony, string up fairy lights, bring cushions and set up a magical nighttime hangout spot under the stars.",
    location: "Your apartment rooftop / balcony / Heli Lounge Bar KL (for the view)",
    bestTime: "8:00 PM - 11:00 PM",
    duration: "~3 hours",
    budgetRange: { min: 40, max: 80 },
    whatToBring: [
      "Fairy lights (at least 2-3 strings, battery-powered ~RM30)",
      "Cushions and a blanket",
      "Bluetooth speaker",
      "Wine/drinks + cheese/charcuterie board or pizza",
      "LED candles for ambiance",
      "A Polaroid camera or phone with timer for couple selfies",
      "Bug spray (you're outdoors!)"
    ],
    setupSteps: [
      "1. Scout the rooftop/balcony area beforehand (check access!)",
      "2. String fairy lights along railings, walls, or overhead",
      "3. Lay out cushions and blanket to create a cozy corner",
      "4. Set up the food/drinks station nearby",
      "5. Light the LED candles",
      "6. Test the speaker and queue up a stargazing/chill playlist",
      "7. Pick her up and bring her up blindfolded (if safe!)"
    ],
    surpriseMoment: "Lead her up to the rooftop with her eyes closed. When she opens them and sees the fairy light paradise you created — with the city skyline as backdrop — she'll be speechless. Dance together under the lights.",
    giftIdeas: [
      { item: "A constellation necklace (her zodiac sign)", cost: 35, whereToBuy: "Shopee / Pandora" },
      { item: "A 'reasons I love you' jar with 52 notes (one for each week)", cost: 10, whereToBuy: "DIY — Daiso mason jar + coloured paper" },
      { item: "A couple's experience voucher (spa/pottery class)", cost: 60, whereToBuy: "Fave app / Klook" }
    ],
    proTips: [
      "Check that you have rooftop access and it's safe!",
      "Set everything up before picking her up",
      "Have mosquito repellent — don't let bugs ruin the moment",
      "Play her favourite slow songs and ask her to dance",
      "Take candid photos of her reaction"
    ],
    tags: ["romantic", "rooftop", "fairy-lights", "night", "aesthetic", "outdoor"]
  },
  {
    title: "Surprise Spa & Pamper Day",
    emoji: "💆",
    theme: "relaxing",
    description: "Book a couple's spa treatment or set up a DIY spa at home. Perfect when she's been stressed or working hard.",
    location: "Hammam Spa (Bangsar) / UR SPA (Mid Valley) / DIY at home",
    bestTime: "2:00 PM - 6:00 PM",
    duration: "~3-4 hours",
    budgetRange: { min: 50, max: 200 },
    whatToBring: [
      "Spa booking confirmation (if going to a spa)",
      "For DIY: face masks, bath bombs, essential oils (~RM40 total from Watson's)",
      "Fluffy towels and bathrobes",
      "Cucumber slices (classic!)",
      "Relaxing music playlist",
      "Her favourite herbal tea",
      "A comfy outfit for after the spa",
      "Moisturizer and skincare stuff"
    ],
    setupSteps: [
      "1. Option A: Book a couple's spa package 3-5 days ahead",
      "2. Option B (DIY): Buy supplies from Watson's/Guardian",
      "3. For DIY: Clean the bathroom/bedroom thoroughly",
      "4. Set up ambient lighting (candles, dim lights)",
      "5. Prepare warm towels (microwave damp towels for 30 sec)",
      "6. Queue up spa music playlist (nature sounds or lo-fi)",
      "7. Make herbal tea to have ready",
      "8. Tell her: 'Wear something comfy, I have a surprise'"
    ],
    surpriseMoment: "If spa: Drive her there and check in as 'Mr. and Mrs.' to make her blush. If DIY: Transform your bathroom with candles and when she walks in, present her with a 'spa menu' of treatments you'll give her.",
    giftIdeas: [
      { item: "A luxury skincare set (her favourite brand)", cost: 60, whereToBuy: "Sephora / Watson's / Guardian" },
      { item: "Silk pillowcase (great for skin + hair)", cost: 30, whereToBuy: "Shopee / Blissy" },
      { item: "A cute matching bathrobe set", cost: 50, whereToBuy: "Shopee / Muji" }
    ],
    proTips: [
      "If she's been stressed, this is THE perfect surprise",
      "For DIY: watch a YouTube tutorial on how to give a basic massage",
      "Have snacks ready for after the spa (fruit platter works great)",
      "Take turns pampering each other if doing DIY",
      "Don't skimp on the towels — cold wet towels ruin the vibe"
    ],
    tags: ["relaxing", "spa", "pamper", "self-care", "stress-relief"]
  }
];

// Gift idea categories for the gift suggestions part of surprises
const SURPRISE_GIFT_CATEGORIES = [
  {
    category: "Sentimental & Handmade",
    gifts: [
      { item: "Handwritten love letter collection (12 letters, one for each month)", cost: 0, effort: "high" },
      { item: "Custom photo book of your journey together", cost: 35, effort: "medium" },
      { item: "Mason jar with 365 reasons I love you", cost: 15, effort: "high" },
      { item: "Scrapbook with tickets, photos, and memories", cost: 20, effort: "high" },
      { item: "Custom star map of a special date (first date/anniversary)", cost: 30, effort: "low" },
      { item: "A video montage of your best moments together", cost: 0, effort: "medium" }
    ]
  },
  {
    category: "Wearable & Accessories",
    gifts: [
      { item: "Matching couple bracelets (simple & elegant)", cost: 30, effort: "low" },
      { item: "Constellation necklace (her zodiac)", cost: 35, effort: "low" },
      { item: "A watch she's been eyeing", cost: 100, effort: "low" },
      { item: "Custom name/initial ring", cost: 40, effort: "low" },
      { item: "Silk scrunchie set in her fav colours", cost: 20, effort: "low" }
    ]
  },
  {
    category: "Experience Gifts",
    gifts: [
      { item: "Couple pottery class voucher", cost: 60, effort: "low" },
      { item: "Cooking class together", cost: 80, effort: "low" },
      { item: "Spa/massage voucher for two", cost: 100, effort: "low" },
      { item: "Escape room booking", cost: 50, effort: "low" },
      { item: "Art jamming session for two", cost: 60, effort: "low" }
    ]
  },
  {
    category: "Tech & Practical",
    gifts: [
      { item: "Wireless earbuds in her favourite colour", cost: 60, effort: "low" },
      { item: "Kindle Paperwhite (if she reads)", cost: 150, effort: "low" },
      { item: "Cute portable fan for hot Malaysian days", cost: 25, effort: "low" },
      { item: "Custom phone case with your couple photo", cost: 25, effort: "low" }
    ]
  },
  {
    category: "Sweet & Edible",
    gifts: [
      { item: "Custom cake with a personal message", cost: 50, effort: "medium" },
      { item: "Chocolate bouquet (handmade)", cost: 30, effort: "medium" },
      { item: "Her favourite boba subscription (weekly order for a month)", cost: 60, effort: "low" },
      { item: "Homemade cookies/brownies in a cute jar", cost: 15, effort: "high" }
    ]
  }
];

function generateSurprise() {
  const profile = getProfile();
  const dates = getDates();
  const venuePerf = getVenuePerformance();

  // Filter surprise plans by what matches her profile
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());
  const introvertLevel = profile.introvertLevel || 5;

  // Score each plan
  const scoredPlans = SURPRISE_PLANS.map(plan => {
    let score = 50;
    const matchReasons = [];

    plan.tags.forEach(tag => {
      if (allLikes.some(l => tag.includes(l) || l.includes(tag))) {
        score += 8;
        matchReasons.push(tag);
      }
    });

    if (introvertLevel >= 7 && (plan.theme === "cozy" || plan.theme === "intimate")) score += 10;
    if (introvertLevel <= 3 && (plan.theme === "fun" || plan.theme === "adventurous")) score += 10;
    if (introvertLevel >= 7 && plan.theme === "adventurous") score -= 5;

    // Check if the surprise involves any venue she loved
    plan.tags.forEach(tag => {
      Object.entries(venuePerf).forEach(([vid, perf]) => {
        if (perf.visits > 0 && perf.totalHerRating / perf.visits >= 8) score += 2;
      });
    });

    // Variety — avoid repeating themes from recent dates
    const recentThemes = dates.slice(0, 5).map(d => (d.notes || "").toLowerCase());
    if (recentThemes.some(t => plan.tags.some(tag => t.includes(tag)))) score -= 5;

    return { ...plan, _score: score, _matchReasons: matchReasons };
  });

  scoredPlans.sort((a, b) => b._score - a._score);

  // Pick from top 3 with some randomness
  const topPlans = scoredPlans.slice(0, 3);
  const picked = topPlans[Math.floor(Math.random() * topPlans.length)];

  // Pick gift suggestions from categories
  const giftCategory = SURPRISE_GIFT_CATEGORIES[Math.floor(Math.random() * SURPRISE_GIFT_CATEGORIES.length)];

  return {
    plan: picked,
    bonusGiftCategory: giftCategory,
    message: picked._matchReasons.length > 0
      ? "Based on what she loves (" + picked._matchReasons.slice(0, 3).join(", ") + "), here's a surprise she'll adore:"
      : "Here's a surprise idea to sweep her off her feet:"
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function escapeHTML(str) { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; }
function generateId(prefix = "id") { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}
function formatCurrency(amount) {
  const b = getBudget();
  return `${b.currency || "RM"} ${parseFloat(amount || 0).toFixed(2)}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return 999;
  const d = new Date(dateStr + "T00:00:00");
  return Math.ceil((d - new Date()) / 86400000);
}

// Toast notification
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Modal
function openModal(title, bodyHTML, onConfirm, confirmLabel = "Save") {
  let overlay = document.getElementById("modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header"><h3>${title}</h3><button class="modal-close" id="btn-modal-close">×</button></div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="btn-modal-confirm">${confirmLabel}</button>
      </div>
    </div>
  `;
  overlay.classList.add("active");
  document.getElementById("btn-modal-close").addEventListener("click", closeModal);
  document.getElementById("btn-modal-cancel").addEventListener("click", closeModal);
  document.getElementById("btn-modal-confirm").addEventListener("click", onConfirm);
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) { overlay.classList.remove("active"); overlay.innerHTML = ""; }
}

function renderTagsInContainer(container, tags, onRemove) {
  container.innerHTML = tags.map((t, i) =>
    `<span class="tag">${escapeHTML(t)} <button class="tag-remove" data-index="${i}">×</button></span>`
  ).join("");
  container.querySelectorAll(".tag-remove").forEach(btn => {
    btn.addEventListener("click", () => onRemove(parseInt(btn.dataset.index)));
  });
}

function updateSidebarName() {
  const el = document.getElementById("sidebar-partner-name");
  if (el) { const p = getProfile(); el.textContent = p.name ? `for ${p.name} 💕` : ""; }
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: SECTION RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════════════
// Dashboard
// ══════════════════════════════════════════════════════════════════════════════

function renderDashboard() {
  const profile = getProfile();
  const dates = getDates();
  const budget = getBudget();
  const spent = getMonthlySpent();
  const remaining = getRemainingBudget();
  const upcomingReminders = getUpcomingReminders().slice(0, 3);
  const ranked = getRankedSuggestions().slice(0, 3);
  const venuePerf = getVenuePerformance();
  const unvisited = getUnvisitedVenues();

  // Stats
  const statsEl = document.getElementById("dash-stats");
  statsEl.innerHTML = `
    <div class="stat-card"><div class="stat-icon">💕</div><div class="stat-value">${dates.length}</div><div class="stat-label">Total Dates</div></div>
    <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">${formatCurrency(remaining)}</div><div class="stat-label">Budget Left</div></div>
    <div class="stat-card"><div class="stat-icon">🗺️</div><div class="stat-value">${Object.keys(venuePerf).length}/${VENUES_DB.length}</div><div class="stat-label">Places Visited</div></div>
    <div class="stat-card"><div class="stat-icon">🆕</div><div class="stat-value">${unvisited.length}</div><div class="stat-label">New Spots</div></div>
  `;

  // Top Date Ideas
  const sugEl = document.getElementById("dash-suggestions");
  sugEl.innerHTML = `<h3>Top Date Ideas</h3>` + (ranked.length ? ranked.map(s =>
    `<div class="suggestion-mini"><span class="suggestion-name">${escapeHTML(s.name)}</span><span class="suggestion-area badge">${s.area ? s.area.replace(/-/g,' ') : ''}</span><span class="score-badge">${s.scores.total}</span></div>`
  ).join("") : `<div class="empty-state"><p>Add her profile to get suggestions!</p></div>`);

  // Budget summary
  const budEl = document.getElementById("dash-budget-summary");
  const pct = budget.monthlyBudget > 0 ? Math.min(100, (spent / budget.monthlyBudget) * 100) : 0;
  budEl.innerHTML = `
    <h3>Budget This Month</h3>
    <div class="budget-bar-container"><div class="budget-bar" style="width:${pct}%"></div></div>
    <p style="margin-top:8px; color:var(--text-secondary)">${formatCurrency(spent)} / ${formatCurrency(budget.monthlyBudget)} spent</p>
  `;

  // Recent dates
  const recentEl = document.getElementById("dash-recent");
  const recent = dates.slice(0, 4);
  recentEl.innerHTML = `<h3>Recent Dates</h3>` + (recent.length ? recent.map(d =>
    `<div class="date-mini"><span>${formatDate(d.date)}</span><strong>${escapeHTML(d.location || d.type || '—')}</strong><span class="score-badge">${d.rating || '—'}</span></div>`
  ).join("") : `<div class="empty-state"><p>No dates logged yet!</p></div>`);

  // Upcoming reminders
  const remEl = document.getElementById("dash-reminders");
  remEl.innerHTML = `<h3>Upcoming Reminders</h3>` + (upcomingReminders.length ? upcomingReminders.map(r =>
    `<div class="reminder-mini"><span class="reminder-days ${r._daysUntil <= 3 ? 'urgent' : ''}">${r._daysUntil === 0 ? 'TODAY!' : r._daysUntil === 1 ? 'Tomorrow' : r._daysUntil + 'd'}</span><span>${escapeHTML(r.label)}</span></div>`
  ).join("") : `<div class="empty-state"><p>No upcoming reminders</p></div>`);
}


// ══════════════════════════════════════════════════════════════════════════════
// Profile
// ══════════════════════════════════════════════════════════════════════════════

function renderProfile() {
  const profile = getProfile();
  document.getElementById('input-name').value = profile.name || '';
  document.getElementById('input-birthday').value = profile.birthday || '';
  document.getElementById('input-love-language').value = profile.loveLanguage || 'quality-time';
  document.getElementById('input-introvert').value = profile.introvertLevel || 5;
  document.getElementById('introvert-value').textContent = profile.introvertLevel || 5;
  document.getElementById('input-budget-comfort').value = profile.budgetComfort || 'medium';
  document.getElementById('input-anniversary').value = profile.specialDates.anniversary || '';
  document.getElementById('input-first-date').value = profile.specialDates.firstDate || '';
  renderProfileTags(profile);
  renderMemorableEvents(profile);
  setupProfileEventHandlers();
}

function renderProfileTags(profile) {
  const tagSections = [
    { containerId: 'profile-likes-food', tags: profile.likes.food, path: 'likes.food' },
    { containerId: 'profile-likes-activities', tags: profile.likes.activities, path: 'likes.activities' },
    { containerId: 'profile-likes-aesthetic', tags: profile.likes.aesthetic, path: 'likes.aesthetic' },
    { containerId: 'profile-dislikes-food', tags: profile.dislikes.food, path: 'dislikes.food' },
    { containerId: 'profile-dislikes-activities', tags: profile.dislikes.activities, path: 'dislikes.activities' },
    { containerId: 'profile-happy', tags: profile.emotionalTriggers.happy, path: 'emotionalTriggers.happy' },
    { containerId: 'profile-stress', tags: profile.emotionalTriggers.stress, path: 'emotionalTriggers.stress' },
    { containerId: 'profile-comfort', tags: profile.emotionalTriggers.comfort, path: 'emotionalTriggers.comfort' }
  ];
  tagSections.forEach(({ containerId, tags, path }) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    renderTagsInContainer(container, tags || [], (idx) => {
      const p = getProfile();
      const parts = path.split('.');
      const arr = parts.reduce((obj, key) => obj[key], p);
      arr.splice(idx, 1);
      saveProfile(p);
      renderProfileTags(p);
    });
  });
}

function renderMemorableEvents(profile) {
  const container = document.getElementById('profile-memorable');
  if (!container) return;
  const memorable = profile.specialDates.memorable || [];
  container.innerHTML = memorable.map((m, i) =>
    `<span class="tag">${escapeHTML(m.label)} (${formatDate(m.date)}) <button class="tag-remove" data-index="${i}">×</button></span>`
  ).join('');
  container.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const p = getProfile();
      p.specialDates.memorable.splice(idx, 1);
      saveProfile(p);
      renderMemorableEvents(p);
    });
  });
}

function setupProfileEventHandlers() {
  const saveBtn = document.getElementById('btn-save-profile');
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  newSaveBtn.addEventListener('click', () => {
    const profile = getProfile();
    profile.name = document.getElementById('input-name').value.trim();
    profile.birthday = document.getElementById('input-birthday').value;
    profile.loveLanguage = document.getElementById('input-love-language').value;
    profile.introvertLevel = parseInt(document.getElementById('input-introvert').value);
    profile.budgetComfort = document.getElementById('input-budget-comfort').value;
    profile.specialDates.anniversary = document.getElementById('input-anniversary').value;
    profile.specialDates.firstDate = document.getElementById('input-first-date').value;
    saveProfile(profile);
    showToast('Profile saved! 💝');
  });

  const slider = document.getElementById('input-introvert');
  const newSlider = slider.cloneNode(true);
  slider.parentNode.replaceChild(newSlider, slider);
  newSlider.addEventListener('input', () => {
    document.getElementById('introvert-value').textContent = newSlider.value;
  });

  // Tag add buttons
  document.querySelectorAll('.tag-add-btn').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      const input = newBtn.parentElement.querySelector('.tag-input');
      if (!input) return;
      const val = input.value.trim();
      if (!val) return;
      const path = newBtn.dataset.path;
      const p = getProfile();
      const parts = path.split('.');
      const arr = parts.reduce((obj, key) => obj[key], p);
      if (!arr.includes(val)) arr.push(val);
      saveProfile(p);
      input.value = '';
      renderProfileTags(p);
    });
  });

  // Add memorable event
  const addMemBtn = document.getElementById('btn-add-memorable');
  if (addMemBtn) {
    const newMemBtn = addMemBtn.cloneNode(true);
    addMemBtn.parentNode.replaceChild(newMemBtn, addMemBtn);
    newMemBtn.addEventListener('click', () => {
      const label = document.getElementById('input-memorable-label').value.trim();
      const date = document.getElementById('input-memorable-date').value;
      if (!label || !date) { showToast('Fill in both fields', 'error'); return; }
      const p = getProfile();
      if (!p.specialDates.memorable) p.specialDates.memorable = [];
      p.specialDates.memorable.push({ label, date });
      saveProfile(p);
      document.getElementById('input-memorable-label').value = '';
      document.getElementById('input-memorable-date').value = '';
      renderMemorableEvents(p);
      showToast('Memorable event added! 🌟');
    });
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// Date Planner (THE BRAIN 🧠)
// ══════════════════════════════════════════════════════════════════════════════

let currentPlans = [];
let activeDatePlan = null;

function renderDatePlanner() {
  const container = document.getElementById("section-planner");
  if (!container) return;

  // Check if there's an active date
  const activePlan = getDatePlans().find(p => p.status === "active");
  if (activePlan) {
    renderActiveDateView(activePlan);
    return;
  }

  const plannerContent = document.getElementById("planner-content");
  if (!plannerContent) return;

  // If we have generated plans, show them
  if (currentPlans.length > 0) {
    renderGeneratedPlans();
  }
}

function runDatePlanner() {
  const dateType = document.getElementById("planner-date-type").value;
  const budget = parseInt(document.getElementById("planner-budget").value) || 100;
  const dayType = document.getElementById("planner-day-type").value;
  const startTime = document.getElementById("planner-start-time").value;
  const herMood = document.getElementById("planner-mood").value;
  const prefInput = document.getElementById("planner-preferences").value;
  const preferences = prefInput ? prefInput.split(",").map(p => p.trim()).filter(Boolean) : [];

  // Show thinking animation
  const resultArea = document.getElementById("planner-results");
  resultArea.innerHTML = `<div class="thinking-animation"><div class="thinking-brain">🧠</div><div class="thinking-steps" id="thinking-steps"></div></div>`;

  const stepsEl = document.getElementById("thinking-steps");

  const result = generateDatePlans({ dateType, budget, dayType, startTime, herMood, preferences });
  currentPlans = result.plans;

  // Animate thinking steps
  let stepIdx = 0;
  const thinkingInterval = setInterval(() => {
    if (stepIdx >= result.thinkingLog.length) {
      clearInterval(thinkingInterval);
      setTimeout(() => renderGeneratedPlans(), 500);
      return;
    }
    const step = result.thinkingLog[stepIdx];
    const stepEl = document.createElement("div");
    stepEl.className = "thinking-step fade-in";
    stepEl.innerHTML = `<strong>${step.step}</strong><span>${step.detail}</span>`;
    stepsEl.appendChild(stepEl);
    stepIdx++;
  }, 600);
}

function renderGeneratedPlans() {
  var resultArea = document.getElementById("planner-results");
  if (currentPlans.length === 0) {
    resultArea.innerHTML = '<div class="empty-state"><p>Could not generate plans with these constraints. Try adjusting the budget, date length, or area!</p></div>';
    return;
  }

  resultArea.innerHTML = '<h3 style="margin-bottom:16px">' + currentPlans.length + ' Natural Date Flows Generated</h3>' +
    currentPlans.map(function(plan, idx) {
      return [
        '<div class="date-plan-card ' + (idx === 0 ? "recommended" : "") + '">',
        '  <div class="plan-header">',
        '    <div>',
        '      <h4>' + plan.theme + '</h4>',
        (idx === 0 ? '<span class="badge badge-primary">Top Pick</span>' : ''),
        '      <span class="badge badge-score">Score: ' + plan.overallScore + '/100</span>',
        '      <span class="badge badge-travel">' + plan.hubArea + '</span>',
        '    </div>',
        '    <button class="btn btn-primary btn-sm" onclick="tryDatePlan(' + idx + ')">Try This Date</button>',
        '  </div>',
        '',
        '  <div class="plan-stats">',
        '    <div class="plan-stat"><span class="plan-stat-icon">💰</span><span>RM ' + plan.budget.total + '</span><span class="plan-stat-label">Total Cost</span></div>',
        '    <div class="plan-stat"><span class="plan-stat-icon">⏱️</span><span>' + (Math.round(plan.time.total / 60 * 10) / 10) + ' hrs</span><span class="plan-stat-label">Total Time</span></div>',
        '    <div class="plan-stat"><span class="plan-stat-icon">🚗</span><span>' + plan.distance + ' km</span><span class="plan-stat-label">Driving</span></div>',
        '    <div class="plan-stat"><span class="plan-stat-icon">😴</span><span>' + plan.fatigue + '/10</span><span class="plan-stat-label">Fatigue</span></div>',
        '  </div>',
        '',
        '  <div class="plan-flow-summary" style="margin-bottom:12px;padding:12px;background:#fef8fa;border-radius:8px">',
        '    <strong style="color:var(--primary-dark);font-size:0.85rem">The Flow:</strong>',
        '    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;align-items:center">',
        '      <span class="badge">🚗 Pick up</span>',
        '      <span style="color:var(--text-light)">→</span>',
        '      <span class="badge badge-travel">📍 ' + plan.hubArea + '</span>',
        '      <span style="color:var(--text-light)">→</span>',
                plan.venues.map(function(v) { return '<span class="badge badge-type">' + getTypeEmoji(v.type) + ' ' + escapeHTML(v.name) + '</span>'; }).join('<span style="color:var(--text-light)">→</span>'),
        '      <span style="color:var(--text-light)">→</span>',
                (plan.carMoments || []).map(function(cm) { return '<span class="badge" style="background:#fff3e0;color:#e65100">' + cm + '</span>'; }).join(''),
        '      <span style="color:var(--text-light)">→</span>',
        '      <span class="badge">💝 Sweet goodbye</span>',
        '    </div>',
        '  </div>',
        '',
        '  <details class="plan-itinerary-toggle">',
        '    <summary>View Full Itinerary</summary>',
        '    <div class="plan-itinerary">',
              plan.itinerary.map(function(item) {
                var extraClass = item.type === "car_moment" ? ' style="background:#fff8e1;border-left:3px solid #ff9800;padding-left:12px;margin-left:-4px"' : item.type === "moment" ? ' style="background:#fce4ec;border-left:3px solid var(--primary);padding-left:12px;margin-left:-4px"' : "";
                var tipsHtml = (item.tips && item.tips.length > 0) ? '<div style="margin-top:6px;font-size:0.8rem;color:var(--text-secondary)"><strong>Tips:</strong><ul style="margin:4px 0 0 16px">' + item.tips.map(function(t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' : '';
                return '<div class="itinerary-item"' + extraClass + '>' +
                  '<span class="itinerary-time">' + item.time + '</span>' +
                  '<div class="itinerary-content"><strong>' + item.action + '</strong><span>' + item.detail + '</span>' + tipsHtml + '</div>' +
                  '</div>';
              }).join(''),
        '    </div>',
        '  </details>',
        '',
        '  <details class="plan-reasoning-toggle" style="margin-top:4px">',
        '    <summary>Why these picks?</summary>',
        '    <div class="plan-reasoning">',
              plan.venues.map(function(v) {
                return '<div class="venue-reasoning"><strong>' + getTypeEmoji(v.type) + ' ' + escapeHTML(v.name) + '</strong>' +
                  (v.reasons && v.reasons.length > 0 ? '<ul>' + v.reasons.map(function(r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' : '<ul><li>Good fit for your date</li></ul>') +
                  '</div>';
              }).join(''),
        '    </div>',
        '  </details>',
        '</div>'
      ].join('\n');
    }).join('');
}

function tryDatePlan(planIndex) {
  const plan = currentPlans[planIndex];
  if (!plan) return;

  plan.status = "active";
  plan.startedAt = new Date().toISOString();
  saveDatePlan(plan);

  // Mark venues as discovered
  plan.venues.forEach(v => markVenueDiscovered(v.id));

  showToast("Date plan activated! Have an amazing time 💕");
  renderActiveDateView(plan);
}

function renderActiveDateView(plan) {
  const plannerContent = document.getElementById("planner-content");
  const resultArea = document.getElementById("planner-results");

  plannerContent.style.display = "none";
  resultArea.innerHTML = `
    <div class="active-date-card">
      <div class="active-date-header">
        <h3>🎯 Active Date: ${plan.theme}</h3>
        <button class="btn btn-primary" onclick="completeDatePlan('${plan.id}')">✅ Complete Date</button>
      </div>

      <div class="plan-stats">
        <div class="plan-stat"><span class="plan-stat-icon">💰</span><span>RM ${plan.budget.total}</span><span class="plan-stat-label">Budget</span></div>
        <div class="plan-stat"><span class="plan-stat-icon">⏱️</span><span>${Math.round(plan.time.total / 60 * 10) / 10} hrs</span><span class="plan-stat-label">Duration</span></div>
        <div class="plan-stat"><span class="plan-stat-icon">🚗</span><span>${plan.distance} km</span><span class="plan-stat-label">Distance</span></div>
      </div>

      <h4 style="margin:16px 0 8px">📋 Your Itinerary</h4>
      <div class="active-itinerary">
        ${plan.itinerary.map((item, i) => `
          <div class="itinerary-item active-item">
            <span class="itinerary-time">${item.time}</span>
            <div class="itinerary-content">
              <strong>${item.action}</strong>
              <span>${item.detail}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:16px;text-align:center">
        <button class="btn btn-secondary" onclick="cancelActiveDatePlan('${plan.id}')">❌ Cancel Date</button>
      </div>
    </div>
  `;
}

function cancelActiveDatePlan(planId) {
  updateDatePlan(planId, { status: "cancelled" });
  currentPlans = [];
  const plannerContent = document.getElementById("planner-content");
  plannerContent.style.display = "";
  document.getElementById("planner-results").innerHTML = "";
  showToast("Date plan cancelled");
}

function completeDatePlan(planId) {
  const plans = getDatePlans();
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;

  const venuesHTML = plan.venues.map(v => `
    <div class="form-group" style="border:1px solid var(--border);padding:12px;border-radius:var(--radius-sm);margin-bottom:8px">
      <strong>${escapeHTML(v.name)}</strong>
      <div class="form-row" style="margin-top:8px">
        <div class="form-group">
          <label>Your Rating (1-10)</label>
          <input type="number" class="venue-your-rating" data-venue-id="${v.id}" min="1" max="10" value="7">
        </div>
        <div class="form-group">
          <label>Her Enjoyment (1-10)</label>
          <input type="number" class="venue-her-rating" data-venue-id="${v.id}" min="1" max="10" value="7">
        </div>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <input type="text" class="venue-notes" data-venue-id="${v.id}" placeholder="What stood out?">
      </div>
    </div>
  `).join('');

  const html = `
    <div class="form-group">
      <label>Overall Date Rating (1-10)</label>
      <input type="number" id="modal-overall-rating" min="1" max="10" value="8">
    </div>
    <div class="form-group">
      <label>Her Overall Mood After</label>
      <select id="modal-her-mood-after">
        <option value="loved-it">😍 Loved it!</option>
        <option value="happy">😊 Happy</option>
        <option value="okay">😐 It was okay</option>
        <option value="meh">😕 Meh</option>
        <option value="didnt-like">😞 Didn't like it</option>
      </select>
    </div>
    <div class="form-group">
      <label>Actual Total Spent (RM)</label>
      <input type="number" id="modal-actual-spent" min="0" value="${plan.budget.total}">
    </div>
    <h4 style="margin:16px 0 8px">Rate Each Venue</h4>
    ${venuesHTML}
    <div class="form-group">
      <label>Overall Notes</label>
      <textarea id="modal-date-notes" rows="3" placeholder="What would you do differently? Any highlights?"></textarea>
    </div>
  `;

  openModal("✅ How Was The Date?", html, () => {
    const overallRating = parseInt(document.getElementById("modal-overall-rating").value) || 7;
    const herMoodAfter = document.getElementById("modal-her-mood-after").value;
    const actualSpent = parseFloat(document.getElementById("modal-actual-spent").value) || plan.budget.total;
    const notes = document.getElementById("modal-date-notes").value.trim();

    // Record each venue's performance
    const venueRatings = {};
    document.querySelectorAll(".venue-your-rating").forEach(input => {
      const vid = input.dataset.venueId;
      const yourRating = parseInt(input.value) || 7;
      const herRating = parseInt(document.querySelector(`.venue-her-rating[data-venue-id="${vid}"]`).value) || 7;
      const venueNotes = document.querySelector(`.venue-notes[data-venue-id="${vid}"]`).value.trim();
      recordVenueVisit(vid, yourRating, herRating, venueNotes);
      markVenueVisited(vid);
      venueRatings[vid] = { yourRating, herRating, notes: venueNotes };
    });

    // Update the plan
    updateDatePlan(planId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      overallRating,
      herMoodAfter,
      actualSpent,
      notes,
      venueRatings
    });

    // Add to date log
    addDate({
      id: generateId("d"),
      date: todayStr(),
      type: plan.venues[0]?.type || "other",
      location: plan.venues.map(v => v.name).join(" → "),
      rating: overallRating,
      mood: herMoodAfter,
      notes,
      tags: plan.venues.flatMap(v => {
        const venue = VENUES_DB.find(vv => vv.id === v.id);
        return venue ? venue.tags.slice(0, 3) : [];
      }),
      budget: actualSpent,
      planId
    });

    // Add expense
    addExpense({
      id: generateId("e"),
      date: todayStr(),
      description: `Date: ${plan.theme}`,
      amount: actualSpent,
      category: "food"
    });

    // Update learning from this experience
    const venuesData = plan.venues.map(v => VENUES_DB.find(vv => vv.id === v.id)).filter(Boolean);
    updateLearningFromDate({ rating: overallRating }, venuesData);

    closeModal();
    currentPlans = [];
    const plannerContent = document.getElementById("planner-content");
    plannerContent.style.display = "";
    document.getElementById("planner-results").innerHTML = "";
    showToast(`Date completed! Rating: ${overallRating}/10 — learning saved 🧠💕`);
    renderDashboard();
  }, "Save & Learn");
}


// ══════════════════════════════════════════════════════════════════════════════
// Date Log
// ══════════════════════════════════════════════════════════════════════════════

function renderDates() {
  const dates = getDates();
  const listEl = document.getElementById("dates-list");

  if (dates.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><p>No dates logged yet. Start planning with the Date Planner! 🧠</p></div>`;
    return;
  }

  listEl.innerHTML = dates.map(d => `
    <div class="date-card">
      <div class="date-card-header">
        <div>
          <strong>${escapeHTML(d.location || d.type || 'Date')}</strong>
          <span class="date-card-date">${formatDate(d.date)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="score-badge ${(d.rating || 0) >= 8 ? 'score-high' : (d.rating || 0) >= 5 ? 'score-mid' : 'score-low'}">${d.rating || '—'}/10</span>
          <button class="btn btn-sm btn-danger" data-delete-date="${d.id}" title="Delete">×</button>
        </div>
      </div>
      ${d.mood ? `<span class="badge">${escapeHTML(d.mood)}</span>` : ''}
      ${d.budget ? `<span class="badge">💰 ${formatCurrency(d.budget)}</span>` : ''}
      ${d.tags && d.tags.length ? `<div class="tag-list">${d.tags.map(t => `<span class="tag tag-sm">${escapeHTML(t)}</span>`).join('')}</div>` : ''}
      ${d.notes ? `<p class="date-notes">${escapeHTML(d.notes)}</p>` : ''}
    </div>
  `).join('');

  listEl.querySelectorAll('[data-delete-date]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this date entry?')) {
        deleteDate(btn.dataset.deleteDate);
        renderDates();
        showToast('Date entry deleted');
      }
    });
  });
}

function openAddDateModal() {
  const html = `
    <div class="form-row">
      <div class="form-group"><label>Date</label><input type="date" id="modal-date-date" value="${todayStr()}"></div>
      <div class="form-group">
        <label>Type</label>
        <select id="modal-date-type">
          <option value="cafe">☕ Cafe</option>
          <option value="restaurant">🍽️ Restaurant</option>
          <option value="movie">🎬 Movie</option>
          <option value="outdoor">🌿 Outdoor</option>
          <option value="entertainment">🎮 Entertainment</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="home">🏠 Home</option>
          <option value="other">✨ Other</option>
        </select>
      </div>
    </div>
    <div class="form-group"><label>Location / Activity</label><input type="text" id="modal-date-location" placeholder="e.g. Niko Neko Matcha, Bangsar" autocomplete="off"></div>
    <div class="form-row">
      <div class="form-group"><label>Rating (1-10)</label><input type="number" id="modal-date-rating" min="1" max="10" value="7"></div>
      <div class="form-group"><label>Amount Spent</label><input type="number" id="modal-date-budget" min="0" step="0.01" placeholder="0"></div>
    </div>
    <div class="form-group">
      <label>Her Mood</label>
      <select id="modal-date-mood">
        <option value="loved-it">😍 Loved it</option>
        <option value="happy">😊 Happy</option>
        <option value="okay">😐 Okay</option>
        <option value="meh">😕 Meh</option>
        <option value="didnt-like">😞 Didn't like</option>
      </select>
    </div>
    <div class="form-group"><label>Notes</label><textarea id="modal-date-notes" rows="2" placeholder="How was it?"></textarea></div>
  `;

  openModal('📅 Log a Date', html, () => {
    const entry = {
      id: generateId('d'),
      date: document.getElementById('modal-date-date').value,
      type: document.getElementById('modal-date-type').value,
      location: document.getElementById('modal-date-location').value.trim(),
      rating: parseInt(document.getElementById('modal-date-rating').value) || 5,
      budget: parseFloat(document.getElementById('modal-date-budget').value) || 0,
      mood: document.getElementById('modal-date-mood').value,
      notes: document.getElementById('modal-date-notes').value.trim(),
      tags: []
    };

    if (!entry.date) { showToast('Please select a date', 'error'); return; }
    addDate(entry);
    closeModal();
    renderDates();
    showToast('Date logged! 💕');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Suggestions (Enhanced)
// ══════════════════════════════════════════════════════════════════════════════

function openVisitRatingModal(venueId) {
  const venue = VENUES_DB.find(v => v.id === venueId);
  if (!venue) return;

  const perf = getVenuePerformance();
  const existing = perf[venueId];

  const html = [
    '<div style="text-align:center;margin-bottom:16px">',
    '<span style="font-size:2rem">' + getTypeEmoji(venue.type) + '</span>',
    '<h4 style="margin-top:8px">' + escapeHTML(venue.name) + '</h4>',
    '<span class="badge">' + venue.area.replace(/-/g, " ") + '</span>',
    '</div>',
    '<div class="form-group">',
    '<label>Your Rating (1-10)</label>',
    '<input type="range" id="modal-visit-your-rating" min="1" max="10" value="' + (existing ? Math.round(existing.totalYourRating / Math.max(1, existing.visits)) : 7) + '" oninput="document.getElementById(\'your-rating-val\').textContent=this.value">',
    '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-secondary)"><span>1 😐</span><span id="your-rating-val">' + (existing ? Math.round(existing.totalYourRating / Math.max(1, existing.visits)) : 7) + '</span><span>10 🤩</span></div>',
    '</div>',
    '<div class="form-group">',
    '<label>Her Enjoyment (1-10)</label>',
    '<input type="range" id="modal-visit-her-rating" min="1" max="10" value="' + (existing ? Math.round(existing.totalHerRating / Math.max(1, existing.visits)) : 7) + '" oninput="document.getElementById(\'her-rating-val\').textContent=this.value">',
    '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-secondary)"><span>1 😐</span><span id="her-rating-val">' + (existing ? Math.round(existing.totalHerRating / Math.max(1, existing.visits)) : 7) + '</span><span>10 😍</span></div>',
    '</div>',
    '<div class="form-group">',
    '<label>Notes (what you did, what she liked, etc.)</label>',
    '<textarea id="modal-visit-notes" rows="3" placeholder="e.g. She loved the matcha latte, the ambiance was 10/10, will come back!"></textarea>',
    '</div>',
    existing ? '<div style="background:#e8f5e9;padding:8px 12px;border-radius:8px;font-size:0.85rem;margin-bottom:8px">✅ Previously visited ' + existing.visits + ' time(s). This will add a new visit record.</div>' : ''
  ].join('');

  openModal("✅ Rate Your Visit — " + venue.name, html, function() {
    var yourRating = parseInt(document.getElementById("modal-visit-your-rating").value) || 7;
    var herRating = parseInt(document.getElementById("modal-visit-her-rating").value) || 7;
    var notes = document.getElementById("modal-visit-notes").value.trim();

    // Update venue performance
    var perf = getVenuePerformance();
    if (!perf[venueId]) {
      perf[venueId] = { visits: 0, totalYourRating: 0, totalHerRating: 0, lastVisit: null, notes: [] };
    }
    perf[venueId].visits += 1;
    perf[venueId].totalYourRating += yourRating;
    perf[venueId].totalHerRating += herRating;
    perf[venueId].lastVisit = new Date().toISOString().split("T")[0];
    if (notes) perf[venueId].notes = (perf[venueId].notes || []).concat([{ date: new Date().toISOString().split("T")[0], text: notes, yourRating: yourRating, herRating: herRating }]);
    setData("mochi_venue_performance", perf);

    // Update discovery log
    var discovery = getDiscoveryLog();
    if (!discovery.find(function(d) { return d.venueId === venueId; })) {
      discovery.push({ venueId: venueId, date: new Date().toISOString().split("T")[0], source: "manual" });
      setData("mochi_discovery_log", discovery);
    }

    // Update learning weights
    var learning = getLearningWeights();
    // Boost area preference
    if (!learning.preferredAreas) learning.preferredAreas = {};
    var currentAreaScore = learning.preferredAreas[venue.area] || 5;
    if (herRating >= 8) learning.preferredAreas[venue.area] = Math.min(10, currentAreaScore + 0.5);
    else if (herRating <= 4) learning.preferredAreas[venue.area] = Math.max(0, currentAreaScore - 0.5);

    // Boost type preference
    if (!learning.preferredTypes) learning.preferredTypes = {};
    var currentTypeScore = learning.preferredTypes[venue.type] || 5;
    if (herRating >= 8) learning.preferredTypes[venue.type] = Math.min(10, currentTypeScore + 0.5);
    else if (herRating <= 4) learning.preferredTypes[venue.type] = Math.max(0, currentTypeScore - 0.5);

    setData("mochi_learning_weights", learning);

    closeModal();
    showToast("Visit recorded! The AI will learn from this 🧠");

    // Refresh the current view
    var activeSection = document.querySelector(".section.active");
    if (activeSection) {
      if (activeSection.id === "section-suggestions") renderSuggestions();
      else if (activeSection.id === "section-places") renderPlaces();
    }
  });
}

function renderSuggestions() {
  var scored = scoreAllVenues();
  var perf = getVenuePerformance();
  var listEl = document.getElementById("suggestions-list");
  var filterType = document.getElementById("suggestion-filter");
  var filterVal = filterType ? filterType.value : "all";

  var filtered = filterVal === "all" ? scored : scored.filter(function(v) { return v.type === filterVal; });
  var top = filtered.slice(0, 20);

  if (top.length === 0) {
    listEl.innerHTML = '<div class="empty-state"><p>No suggestions match the current filter.</p></div>';
    return;
  }

  listEl.innerHTML = top.map(function(v) {
    var visited = perf[v.id] && perf[v.id].visits > 0;
    var visitCount = visited ? perf[v.id].visits : 0;
    var avgHer = visited ? (perf[v.id].totalHerRating / perf[v.id].visits).toFixed(1) : null;
    var visitBadge = visited
      ? '<span class="badge" style="background:#e8f5e9;color:#2e7d32">Visited ' + visitCount + 'x' + (avgHer ? ' · Her: ' + avgHer + '/10' : '') + '</span>'
      : '<span class="badge" style="background:#e3f2fd;color:#1565c0">New!</span>';

    return [
      '<div class="suggestion-card">',
      '  <div class="suggestion-card-header">',
      '    <div>',
      '      <h4>' + escapeHTML(v.name) + '</h4>',
      '      <span class="badge badge-type">' + v.type + '</span>',
      '      <span class="badge">' + v.area.replace(/-/g, " ") + '</span>',
      '      ' + visitBadge,
      '      <span class="badge">~RM' + v.estimatedCost + '</span>',
      '    </div>',
      '    <div class="score-badge ' + (v._score >= 70 ? "score-high" : v._score >= 45 ? "score-mid" : "score-low") + '">' + v._score + '</div>',
      '  </div>',
      '  <p class="suggestion-desc">' + escapeHTML(v.description) + '</p>',
      '  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">',
           v.tags.slice(0, 5).map(function(t) { return '<span class="tag tag-sm">' + t + '</span>'; }).join(''),
      '  </div>',
      '  <div style="display:flex;gap:8px;align-items:center">',
      '    <button class="btn btn-primary btn-sm" onclick="openVisitRatingModal(\'' + v.id + '\')">',
           visited ? '⭐ Rate Again' : '✅ Been Here!',
      '    </button>',
      '    <span style="font-size:0.75rem;color:var(--text-light)">Click to log your visit & rate it</span>',
      '  </div>',
      '</div>'
    ].join('\n');
  }).join('');
}


// ══════════════════════════════════════════════════════════════════════════════
// Budget
// ══════════════════════════════════════════════════════════════════════════════

function renderBudget() {
  const budget = getBudget();
  const spent = getMonthlySpent();
  const remaining = getRemainingBudget();
  const pct = budget.monthlyBudget > 0 ? Math.min(100, (spent / budget.monthlyBudget) * 100) : 0;

  // Overview
  const overviewEl = document.getElementById('budget-overview');
  overviewEl.innerHTML = `
    <h3>Monthly Overview</h3>
    <div class="budget-big-number">${formatCurrency(remaining)}<span class="budget-label"> remaining</span></div>
    <div class="budget-bar-container"><div class="budget-bar ${pct > 90 ? 'over' : ''}" style="width:${pct}%"></div></div>
    <p style="margin-top:8px;color:var(--text-secondary)">${formatCurrency(spent)} of ${formatCurrency(budget.monthlyBudget)} spent (${Math.round(pct)}%)</p>
  `;

  // Settings
  const settingsEl = document.getElementById('budget-settings');
  settingsEl.innerHTML = `
    <h3>Budget Settings</h3>
    <div class="form-row">
      <div class="form-group"><label>Monthly Budget</label><input type="number" id="input-monthly-budget" min="0" value="${budget.monthlyBudget}"></div>
      <div class="form-group"><label>Currency</label><input type="text" id="input-currency" value="${budget.currency || 'RM'}" maxlength="5"></div>
    </div>
    <button class="btn btn-primary" id="btn-save-budget">💾 Save Budget</button>
  `;
  document.getElementById('btn-save-budget').addEventListener('click', () => {
    const b = getBudget();
    b.monthlyBudget = parseFloat(document.getElementById('input-monthly-budget').value) || 0;
    b.currency = document.getElementById('input-currency').value.trim() || 'RM';
    saveBudget(b);
    renderBudget();
    showToast('Budget saved! 💰');
  });

  // Expenses
  const expensesEl = document.getElementById('budget-expenses');
  const allExpenses = (budget.expenses || []).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (allExpenses.length === 0) {
    expensesEl.innerHTML = `<h3>Recent Expenses</h3><div class="empty-state"><p>No expenses recorded yet.</p></div>`;
  } else {
    expensesEl.innerHTML = `
      <h3>Recent Expenses</h3>
      <table style="width:100%;border-collapse:collapse;margin-top:10px"><thead>
        <tr style="text-align:left;border-bottom:2px solid #e8d5e0">
          <th style="padding:8px">Date</th><th style="padding:8px">Description</th>
          <th style="padding:8px">Category</th><th style="padding:8px;text-align:right">Amount</th><th style="padding:8px;width:40px"></th>
        </tr></thead><tbody>
        ${allExpenses.slice(0, 20).map(e => `
          <tr style="border-bottom:1px solid #f0e0e8">
            <td style="padding:8px;color:#666">${formatDate(e.date)}</td>
            <td style="padding:8px">${escapeHTML(e.description || '—')}</td>
            <td style="padding:8px"><span class="badge">${e.category || 'other'}</span></td>
            <td style="padding:8px;text-align:right;font-weight:600">${formatCurrency(e.amount)}</td>
            <td style="padding:8px"><button class="btn btn-sm btn-danger" data-delete-expense="${e.id}" title="Delete">×</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    `;
    expensesEl.querySelectorAll('[data-delete-expense]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this expense?')) {
          deleteExpense(btn.dataset.deleteExpense);
          renderBudget();
          showToast('Expense deleted');
        }
      });
    });
  }
}

function openExpenseModal() {
  const html = `
    <div class="form-group"><label>Description</label><input type="text" id="modal-expense-desc" placeholder="e.g. Sushi dinner" autocomplete="off"></div>
    <div class="form-row">
      <div class="form-group"><label>Amount</label><input type="number" id="modal-expense-amount" min="0" step="0.01" placeholder="0"></div>
      <div class="form-group"><label>Category</label>
        <select id="modal-expense-category">
          <option value="food">🍽️ Food</option><option value="entertainment">🎬 Entertainment</option>
          <option value="gift">🎁 Gift</option><option value="transport">🚗 Transport</option><option value="other">💫 Other</option>
        </select>
      </div>
    </div>
    <div class="form-group"><label>Date</label><input type="date" id="modal-expense-date" value="${todayStr()}"></div>
  `;
  openModal('💰 Add Expense', html, () => {
    const description = document.getElementById('modal-expense-desc').value.trim();
    const amount = parseFloat(document.getElementById('modal-expense-amount').value);
    const category = document.getElementById('modal-expense-category').value;
    const date = document.getElementById('modal-expense-date').value;
    if (!description) { showToast('Please enter a description', 'error'); return; }
    if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
    addExpense({ id: generateId('e'), date, description, amount, category });
    closeModal();
    renderBudget();
    showToast('Expense added! 🧾');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Gifts
// ══════════════════════════════════════════════════════════════════════════════

function renderGifts() {
  const gifts = getGifts();
  const listEl = document.getElementById('gifts-list');

  if (gifts.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><p>No gift ideas yet. Start adding!</p></div>`;
    return;
  }

  const pending = gifts.filter(g => !g.given);
  const given = gifts.filter(g => g.given);

  listEl.innerHTML = `
    ${pending.length ? `<h4 style="margin-bottom:8px">🎯 Ideas (${pending.length})</h4>` + pending.map(g => renderGiftCard(g)).join('') : ''}
    ${given.length ? `<h4 style="margin:16px 0 8px">✅ Given (${given.length})</h4>` + given.map(g => renderGiftCard(g)).join('') : ''}
  `;

  listEl.querySelectorAll('[data-toggle-gift]').forEach(btn => {
    btn.addEventListener('click', () => { toggleGiftGiven(btn.dataset.toggleGift); renderGifts(); });
  });
  listEl.querySelectorAll('[data-delete-gift]').forEach(btn => {
    btn.addEventListener('click', () => { if (confirm('Delete this gift?')) { deleteGift(btn.dataset.deleteGift); renderGifts(); showToast('Gift removed'); } });
  });
}

function renderGiftCard(gift) {
  return `
    <div class="gift-card ${gift.given ? 'gift-given' : ''}">
      <div style="flex:1">
        <strong>${escapeHTML(gift.name)}</strong>
        ${gift.budget ? `<span class="badge">~${formatCurrency(gift.budget)}</span>` : ''}
        ${gift.occasion ? `<span class="badge badge-type">${escapeHTML(gift.occasion)}</span>` : ''}
        ${gift.notes ? `<p class="date-notes">${escapeHTML(gift.notes)}</p>` : ''}
      </div>
      <div style="display:flex;gap:4px">
        <button class="btn btn-sm ${gift.given ? 'btn-secondary' : 'btn-primary'}" data-toggle-gift="${gift.id}">${gift.given ? '↩️' : '✅'}</button>
        <button class="btn btn-sm btn-danger" data-delete-gift="${gift.id}">×</button>
      </div>
    </div>
  `;
}

function openAddGiftModal() {
  const html = `
    <div class="form-group"><label>Gift Idea</label><input type="text" id="modal-gift-name" placeholder="e.g. Matcha gift set" autocomplete="off"></div>
    <div class="form-row">
      <div class="form-group"><label>Budget</label><input type="number" id="modal-gift-budget" min="0" placeholder="0"></div>
      <div class="form-group"><label>Occasion</label><input type="text" id="modal-gift-occasion" placeholder="e.g. Birthday"></div>
    </div>
    <div class="form-group"><label>Notes</label><textarea id="modal-gift-notes" rows="2" placeholder="Where to buy, etc."></textarea></div>
  `;
  openModal('🎁 Add Gift Idea', html, () => {
    const name = document.getElementById('modal-gift-name').value.trim();
    if (!name) { showToast('Please enter a gift name', 'error'); return; }
    addGift({
      id: generateId('g'),
      name,
      budget: parseFloat(document.getElementById('modal-gift-budget').value) || 0,
      occasion: document.getElementById('modal-gift-occasion').value.trim(),
      notes: document.getElementById('modal-gift-notes').value.trim(),
      given: false
    });
    closeModal();
    renderGifts();
    showToast('Gift idea added! 🎁');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Surprises
// ══════════════════════════════════════════════════════════════════════════════

function renderSurprises() {
  var result = generateSurprise();
  var plan = result.plan;
  var giftCat = result.bonusGiftCategory;
  var el = document.getElementById("surprise-result");

  el.innerHTML = [
    '<p class="surprise-attribution">' + result.message + '</p>',
    '',
    '<div class="surprise-plan-card" style="background:white;border-radius:16px;padding:24px;box-shadow:var(--shadow);border:2px solid var(--primary);margin-bottom:20px">',
    '  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">',
    '    <span style="font-size:2.5rem">' + plan.emoji + '</span>',
    '    <div>',
    '      <h3 style="margin-bottom:4px">' + escapeHTML(plan.title) + '</h3>',
    '      <span class="badge badge-type">' + plan.theme + '</span>',
    '      <span class="badge">RM' + plan.budgetRange.min + '-' + plan.budgetRange.max + '</span>',
    '      <span class="badge badge-travel">' + plan.duration + '</span>',
    '    </div>',
    '  </div>',
    '',
    '  <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.95rem">' + escapeHTML(plan.description) + '</p>',
    '',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">',
    '    <div style="padding:10px;background:#fef8fa;border-radius:8px"><strong style="font-size:0.8rem;color:var(--text-secondary)">📍 Location</strong><p style="font-size:0.9rem;margin-top:4px">' + escapeHTML(plan.location) + '</p></div>',
    '    <div style="padding:10px;background:#fef8fa;border-radius:8px"><strong style="font-size:0.8rem;color:var(--text-secondary)">🕐 Best Time</strong><p style="font-size:0.9rem;margin-top:4px">' + escapeHTML(plan.bestTime) + '</p></div>',
    '  </div>',
    '',
    '  <details style="margin-bottom:12px" open>',
    '    <summary style="font-weight:600;color:var(--primary);cursor:pointer;padding:8px 0">🎒 What to Bring (Checklist)</summary>',
    '    <div style="padding:8px 0">',
          plan.whatToBring.map(function(item) {
            return '<label style="display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:0.9rem;cursor:pointer"><input type="checkbox" style="margin-top:3px;accent-color:var(--primary)"> ' + escapeHTML(item) + '</label>';
          }).join(''),
    '    </div>',
    '  </details>',
    '',
    '  <details style="margin-bottom:12px">',
    '    <summary style="font-weight:600;color:var(--primary);cursor:pointer;padding:8px 0">📋 Setup Steps</summary>',
    '    <div style="padding:8px 0">',
          plan.setupSteps.map(function(step) {
            return '<div style="padding:6px 0;font-size:0.9rem;border-bottom:1px solid #f5eff2">' + escapeHTML(step) + '</div>';
          }).join(''),
    '    </div>',
    '  </details>',
    '',
    '  <div style="background:#fff8e1;border-radius:12px;padding:16px;margin-bottom:12px;border:1px solid #ffe082">',
    '    <strong style="color:#e65100">✨ The Surprise Moment</strong>',
    '    <p style="margin-top:8px;font-size:0.9rem;color:var(--text)">' + escapeHTML(plan.surpriseMoment) + '</p>',
    '  </div>',
    '',
    '  <details style="margin-bottom:12px">',
    '    <summary style="font-weight:600;color:var(--primary);cursor:pointer;padding:8px 0">🎁 Gift Ideas for This Surprise</summary>',
    '    <div style="padding:8px 0">',
          plan.giftIdeas.map(function(g) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f5eff2">' +
              '<div><strong style="font-size:0.9rem">' + escapeHTML(g.item) + '</strong>' +
              (g.whereToBuy ? '<br><span style="font-size:0.8rem;color:var(--text-secondary)">Where: ' + escapeHTML(g.whereToBuy) + '</span>' : '') +
              '</div><span class="badge">~RM' + g.cost + '</span></div>';
          }).join(''),
    '    </div>',
    '  </details>',
    '',
    '  <details style="margin-bottom:8px">',
    '    <summary style="font-weight:600;color:var(--primary);cursor:pointer;padding:8px 0">💡 Pro Tips</summary>',
    '    <ul style="padding:8px 0 8px 20px;font-size:0.9rem;color:var(--text-secondary)">',
          plan.proTips.map(function(tip) { return '<li style="padding:2px 0">' + escapeHTML(tip) + '</li>'; }).join(''),
    '    </ul>',
    '  </details>',
    '</div>',
    '',
    '<div class="card" style="margin-bottom:16px">',
    '  <h3>🎁 Bonus Gift Ideas: ' + escapeHTML(giftCat.category) + '</h3>',
    '  <div style="margin-top:12px">',
        giftCat.gifts.map(function(g) {
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f5eff2">' +
            '<div style="flex:1"><strong style="font-size:0.9rem">' + escapeHTML(g.item) + '</strong>' +
            '<br><span style="font-size:0.8rem;color:var(--text-secondary)">Effort: ' + g.effort + '</span></div>' +
            '<span class="badge">~RM' + g.cost + '</span></div>';
        }).join(''),
    '  </div>',
    '</div>',
    '',
    '<button class="btn btn-primary" style="margin-top:8px" onclick="renderSurprises()">🔄 Generate Another Surprise Plan</button>'
  ].join('\n');
}


// ══════════════════════════════════════════════════════════════════════════════
// Reminders
// ══════════════════════════════════════════════════════════════════════════════

function renderReminders() {
  var upcoming = getUpcomingReminders();
  var listEl = document.getElementById("reminders-list");

  if (upcoming.length === 0) {
    listEl.innerHTML = '<div class="empty-state"><p>No reminders set. Add important dates so you never forget!</p></div>';
    return;
  }

  listEl.innerHTML = upcoming.map(function(r) {
    var emailBadge = r.emailReminder ? '<span class="badge" style="background:#e3f2fd;color:#1565c0">📧 Email On</span>' : '';
    return [
      '<div class="reminder-card ' + (r._daysUntil <= 3 ? "reminder-urgent" : r._daysUntil <= 7 ? "reminder-soon" : "") + '">',
      '  <div style="flex:1">',
      '    <strong>' + escapeHTML(r.label) + '</strong>',
      '    <div style="color:var(--text-secondary);font-size:0.85em">',
           (r._daysUntil === 0 ? "TODAY!" : r._daysUntil === 1 ? "Tomorrow" : r._daysUntil + " days away"),
      '      &middot; ' + formatDate(r.date),
           (r.recurring && r.recurring !== "none" ? " &middot; 🔁 " + r.recurring : ""),
      '      ' + emailBadge,
      '    </div>',
      '  </div>',
      '  <button class="btn btn-sm btn-danger" data-delete-reminder="' + r.id + '">&times;</button>',
      '</div>'
    ].join('\n');
  }).join('');

  listEl.querySelectorAll("[data-delete-reminder]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      if (confirm("Delete this reminder?")) {
        deleteReminder(btn.dataset.deleteReminder);
        renderReminders();
        showToast("Reminder deleted");
      }
    });
  });
}

function openAddReminderModal() {
  var html = [
    '<div class="form-group"><label>What to remember</label><input type="text" id="modal-reminder-label" placeholder="e.g. Anniversary dinner" autocomplete="off"></div>',
    '<div class="form-row">',
    '  <div class="form-group"><label>Date</label><input type="date" id="modal-reminder-date"></div>',
    '  <div class="form-group"><label>Recurring</label>',
    '    <select id="modal-reminder-recurring"><option value="none">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>',
    '  </div>',
    '</div>',
    '<div class="form-group" style="padding:12px;background:#e3f2fd;border-radius:8px">',
    '  <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:0">',
    '    <input type="checkbox" id="modal-reminder-email" style="accent-color:var(--primary);width:18px;height:18px">',
    '    <span><strong>📧 Send email reminder</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">Get notified at heyrannash@gmail.com when this is due</span></span>',
    '  </label>',
    '</div>'
  ].join('');

  openModal("🔔 Add Reminder", html, function() {
    var label = document.getElementById("modal-reminder-label").value.trim();
    var date = document.getElementById("modal-reminder-date").value;
    var recurring = document.getElementById("modal-reminder-recurring").value;
    var emailReminder = document.getElementById("modal-reminder-email").checked;
    if (!label || !date) { showToast("Please fill in all fields", "error"); return; }
    addReminder({ id: generateId("r"), label: label, date: date, recurring: recurring, emailReminder: emailReminder });
    closeModal();
    renderReminders();
    showToast(emailReminder ? "Reminder set with email notification! 📧🔔" : "Reminder set! 🔔");
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Places Explorer (NEW)
// ══════════════════════════════════════════════════════════════════════════════

function renderPlaces() {
  var perf = getVenuePerformance();
  var discovery = getDiscoveryLog();
  var container = document.getElementById("places-list");
  var filterEl = document.getElementById("places-filter-status");
  var filterVal = filterEl ? filterEl.value : "all";

  // Build place list from VENUES_DB
  var places = VENUES_DB.map(function(v) {
    var p = perf[v.id];
    var visited = p && p.visits > 0;
    var avgHer = visited ? (p.totalHerRating / p.visits).toFixed(1) : null;
    var avgYou = visited ? (p.totalYourRating / p.visits).toFixed(1) : null;
    return {
      ...v,
      _visited: visited,
      _visits: visited ? p.visits : 0,
      _avgHer: avgHer,
      _avgYou: avgYou,
      _lastVisit: visited ? p.lastVisit : null,
      _notes: visited && p.notes ? p.notes : []
    };
  });

  // Filter
  if (filterVal === "visited") places = places.filter(function(p) { return p._visited; });
  else if (filterVal === "new") places = places.filter(function(p) { return !p._visited; });

  // Sort: visited with high ratings first, then new
  places.sort(function(a, b) {
    if (a._visited && !b._visited) return -1;
    if (!a._visited && b._visited) return 1;
    if (a._visited && b._visited) return parseFloat(b._avgHer || 0) - parseFloat(a._avgHer || 0);
    return 0;
  });

  if (places.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No places match this filter.</p></div>';
    return;
  }

  container.innerHTML = places.slice(0, 30).map(function(v) {
    var visitBadge = v._visited
      ? '<span class="badge" style="background:#e8f5e9;color:#2e7d32">✅ Visited ' + v._visits + 'x</span>'
      : '<span class="badge" style="background:#e3f2fd;color:#1565c0">🆕 Not visited yet</span>';

    var ratingHtml = v._visited
      ? '<div style="display:flex;gap:12px;font-size:0.85rem;margin-top:6px">' +
        '<span>Your rating: <strong>' + v._avgYou + '/10</strong></span>' +
        '<span>Her rating: <strong>' + v._avgHer + '/10</strong></span>' +
        (v._lastVisit ? '<span style="color:var(--text-light)">Last: ' + v._lastVisit + '</span>' : '') +
        '</div>'
      : '';

    var notesHtml = v._notes.length > 0
      ? '<div style="margin-top:6px;font-size:0.8rem;color:var(--text-secondary);font-style:italic">"' + escapeHTML(v._notes[v._notes.length - 1].text) + '"</div>'
      : '';

    return [
      '<div class="place-card ' + (v._visited ? "place-visited" : "place-new") + '">',
      '  <div class="place-header">',
      '    <div>',
      '      <h4>' + getTypeEmoji(v.type) + ' ' + escapeHTML(v.name) + '</h4>',
      '      <span class="badge badge-type">' + v.type + '</span>',
      '      <span class="badge">' + v.area.replace(/-/g, " ") + '</span>',
      '      ' + visitBadge,
      '      <span class="badge">~RM' + v.estimatedCost + '</span>',
      '    </div>',
      '  </div>',
      '  <p style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">' + escapeHTML(v.description) + '</p>',
      ratingHtml,
      notesHtml,
      '  <div style="margin-top:8px">',
      '    <button class="btn btn-primary btn-sm" onclick="openVisitRatingModal(\'' + v.id + '\')">' + (v._visited ? '⭐ Rate Again' : '✅ Been Here — Rate It!') + '</button>',
      '  </div>',
      '</div>'
    ].join('\n');
  }).join('');
}

function getTopRatedArea() {
  const perf = getVenuePerformance();
  const areaScores = {};
  Object.entries(perf).forEach(([vid, data]) => {
    const venue = VENUES_DB.find(v => v.id === vid);
    if (venue && data.visits > 0) {
      if (!areaScores[venue.area]) areaScores[venue.area] = { total: 0, count: 0 };
      areaScores[venue.area].total += data.totalHerRating / data.visits;
      areaScores[venue.area].count++;
    }
  });
  let best = "—";
  let bestScore = 0;
  Object.entries(areaScores).forEach(([area, data]) => {
    const avg = data.total / data.count;
    if (avg > bestScore) { bestScore = avg; best = area.replace(/-/g,' '); }
  });
  return best;
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: NAVIGATION & EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

function switchTab(tabId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const section = document.getElementById(`section-${tabId}`);
  if (section) section.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (navItem) navItem.classList.add('active');

  // Render the section
  switch (tabId) {
    case 'dashboard': renderDashboard(); break;
    case 'profile': renderProfile(); break;
    case 'planner': renderDatePlanner(); break;
    case 'dates': renderDates(); break;
    case 'suggestions': renderSuggestions(); break;
    case 'budget': renderBudget(); break;
    case 'gifts': renderGifts(); break;
    case 'surprises': renderSurprises(); break;
    case 'reminders': renderReminders(); break;
    case 'places': renderPlaces(); break;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Setup navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Setup buttons
  document.getElementById('btn-run-planner')?.addEventListener('click', runDatePlanner);
  document.getElementById('btn-add-date')?.addEventListener('click', openAddDateModal);
  document.getElementById('btn-add-expense')?.addEventListener('click', openExpenseModal);
  document.getElementById('btn-add-gift')?.addEventListener('click', openAddGiftModal);
  document.getElementById('btn-add-reminder')?.addEventListener('click', openAddReminderModal);

  // Suggestion filters
  document.getElementById('filter-type')?.addEventListener('change', renderSuggestions);
  document.getElementById('filter-area')?.addEventListener('change', renderSuggestions);

  // Places filters
  document.getElementById('places-filter-area')?.addEventListener('change', renderPlaces);
  document.getElementById('places-filter-type')?.addEventListener('change', renderPlaces);
  document.getElementById('places-filter-status')?.addEventListener('change', renderPlaces);

  // Sidebar name
  updateSidebarName();

  // Render dashboard
  renderDashboard();
});

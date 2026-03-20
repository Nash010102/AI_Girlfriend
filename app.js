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
// SECTION 4: DATE PLANNING BRAIN 🧠
// ─────────────────────────────────────────────────────────────────────────────

const DATE_TYPES = {
  quick: { label: "Quick Date (1-2 hrs)", maxVenues: 1, maxTravelMin: 30, timeRange: [60, 120] },
  short: { label: "Short Date (2-4 hrs)", maxVenues: 2, maxTravelMin: 45, timeRange: [120, 240] },
  half: { label: "Half Day (4-6 hrs)", maxVenues: 3, maxTravelMin: 60, timeRange: [240, 360] },
  full: { label: "Full Day (6+ hrs)", maxVenues: 4, maxTravelMin: 90, timeRange: [360, 600] }
};

function generateDatePlans(options) {
  const {
    dateType = "short",
    budget = 100,
    dayType = "weekend",
    startTime = "afternoon",
    herMood = "happy",
    preferences = []
  } = options;

  const profile = getProfile();
  const dates = getDates();
  const venuePerf = getVenuePerformance();
  const learning = getLearningWeights();
  const discovery = getDiscoveryLog();
  const dateConfig = DATE_TYPES[dateType];

  // Step 1: THINK - Filter venues based on constraints
  const thinkingLog = [];
  thinkingLog.push({ step: "🔍 Analyzing constraints", detail: `Budget: RM${budget} | Type: ${dateConfig.label} | Day: ${dayType} | Start: ${startTime}` });

  // Filter venues that are open on this day type
  const dayName = dayType === "weekend" ? "sat" : "mon"; // simplified
  let candidates = VENUES_DB.filter(v => {
    const isOpen = v.daysOpen.includes(dayName) || v.daysOpen.includes("sat") || v.daysOpen.includes("sun");
    const fitsTime = v.bestTimeSlots.includes(startTime);
    const fitsLength = v.dateLength.some(dl => {
      if (dateType === "quick") return dl === "short";
      if (dateType === "short") return dl === "short" || dl === "medium";
      if (dateType === "half") return dl === "medium" || dl === "long";
      return true;
    });
    return isOpen && (fitsTime || dateType === "full") && fitsLength;
  });
  thinkingLog.push({ step: "📋 Found venues open & matching time", detail: `${candidates.length} venues available` });

  // Step 2: Score each venue
  const scoredVenues = candidates.map(venue => {
    let score = 50; // base score
    const reasons = [];

    // Profile match
    const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());
    const allDislikes = [...(profile.dislikes.food || []), ...(profile.dislikes.activities || [])].map(d => d.toLowerCase());

    let likeMatches = 0;
    let dislikeMatches = 0;
    venue.tags.forEach(tag => {
      const t = tag.toLowerCase();
      if (allLikes.some(l => t.includes(l) || l.includes(t))) { likeMatches++; score += 8; }
      if (allDislikes.some(d => t.includes(d) || d.includes(t))) { dislikeMatches++; score -= 15; }
    });
    if (likeMatches > 0) reasons.push(`Matches ${likeMatches} of her likes`);
    if (dislikeMatches > 0) reasons.push(`⚠️ Touches ${dislikeMatches} dislikes`);

    // Mood-based adjustments
    if (herMood === "stressed" || herMood === "tired") {
      if (venue.introvertFriendly) { score += 10; reasons.push("Relaxing for her current mood"); }
      else { score -= 8; reasons.push("Might be too much energy right now"); }
    }
    if (herMood === "excited" && !venue.introvertFriendly) { score += 5; reasons.push("Matches her excited energy"); }

    // Introvert level
    if (profile.introvertLevel >= 7) {
      if (venue.introvertFriendly) score += 5;
      else score -= 5;
    }

    // Love language match
    if (venue.loveLanguages && venue.loveLanguages.includes(profile.loveLanguage)) { score += 5; reasons.push("Matches her love language"); }

    // Budget fit
    if (venue.estimatedCost <= budget * 0.5) { score += 8; reasons.push("Very budget-friendly"); }
    else if (venue.estimatedCost <= budget * 0.8) { score += 4; reasons.push("Within budget"); }
    else if (venue.estimatedCost > budget) { score -= 20; reasons.push("Over budget"); }

    // Travel convenience (closer to TTDI = better since you pick her up)
    const travel = getTravelKey("ttdi", venue.area);
    if (travel) {
      if (travel.car <= 15) { score += 8; reasons.push("Very close, easy drive"); }
      else if (travel.car <= 25) { score += 3; }
      else if (travel.car > 40) { score -= 5; reasons.push("Far drive"); }
    }

    // Past performance learning
    const perfData = venuePerf[venue.id];
    if (perfData) {
      const avgRating = perfData.totalHerRating / perfData.visits;
      if (avgRating >= 8) { score += 12; reasons.push(`She loved it before! (${avgRating.toFixed(1)}/10)`); }
      else if (avgRating >= 6) { score += 5; reasons.push(`Good past experience (${avgRating.toFixed(1)}/10)`); }
      else if (avgRating < 4) { score -= 15; reasons.push("She didn't enjoy this before"); }

      // Novelty penalty if visited recently
      if (perfData.lastVisit) {
        const daysSince = daysAgo(perfData.lastVisit);
        if (daysSince < 14) { score -= 10; reasons.push("Visited recently, less novel"); }
        else if (daysSince < 30) { score -= 3; }
      }
    } else {
      // Never visited = discovery bonus
      score += 4;
      reasons.push("🆕 Never tried before!");
    }

    // Learning weights bonus
    if (learning.preferredAreas[venue.area] > 7) { score += 5; reasons.push("You both love this area"); }
    if (learning.preferredTypes[venue.type] > 7) { score += 3; }
    (venue.vibes || []).forEach(vibe => {
      if (learning.preferredVibes[vibe] > 7) score += 2;
    });

    // Preference keywords match
    preferences.forEach(pref => {
      const p = pref.toLowerCase();
      if (venue.tags.some(t => t.toLowerCase().includes(p)) || venue.name.toLowerCase().includes(p) || venue.description.toLowerCase().includes(p)) {
        score += 10;
        reasons.push(`Matches your preference: "${pref}"`);
      }
    });

    return { ...venue, _score: Math.max(0, Math.min(100, score)), _reasons: reasons };
  });

  scoredVenues.sort((a, b) => b._score - a._score);
  thinkingLog.push({ step: "🧠 Scored all venues", detail: `Top: ${scoredVenues[0]?.name} (${scoredVenues[0]?._score}pts)` });

  // Step 3: Build date itineraries
  const plans = [];
  const usedVenueIds = new Set();

  for (let planNum = 0; planNum < 5; planNum++) {
    const planVenues = [];
    let planBudget = 0;
    let planTravelTime = 0;
    const maxVenues = dateConfig.maxVenues;

    // Pick primary venue (highest scored unused)
    const primary = scoredVenues.find(v => !usedVenueIds.has(v.id) && v.estimatedCost <= budget && v._score > 20);
    if (!primary) continue;

    planVenues.push(primary);
    usedVenueIds.add(primary.id);
    planBudget += primary.estimatedCost;

    // Pick secondary venues if date type allows
    if (maxVenues >= 2 && planBudget < budget * 0.7) {
      // Find a complementary venue nearby
      const secondary = scoredVenues.find(v =>
        !usedVenueIds.has(v.id) &&
        v.id !== primary.id &&
        v.type !== primary.type &&
        (planBudget + v.estimatedCost) <= budget &&
        v._score > 15
      );
      if (secondary) {
        planVenues.push(secondary);
        usedVenueIds.delete(secondary.id); // Allow reuse across plans
        planBudget += secondary.estimatedCost;
      }
    }

    if (maxVenues >= 3 && planBudget < budget * 0.5 && planVenues.length === 2) {
      const tertiary = scoredVenues.find(v =>
        !planVenues.some(pv => pv.id === v.id) &&
        (planBudget + v.estimatedCost) <= budget &&
        v.type !== planVenues[0].type && v.type !== planVenues[1].type &&
        v._score > 10
      );
      if (tertiary) {
        planVenues.push(tertiary);
        planBudget += tertiary.estimatedCost;
      }
    }

    // Calculate route: You (SK) -> Her (TTDI) -> Venue1 -> Venue2 -> ... -> Her (TTDI) -> You (SK)
    const routeAreas = ["seri-kembangan", "ttdi", ...planVenues.map(v => v.area), "ttdi", "seri-kembangan"];
    const routeDetails = calculateRouteDetails(routeAreas, dayType, startTime);

    // Calculate total time
    const activityMinutes = planVenues.reduce((sum, v) => {
      if (v.type === "cafe" || v.type === "home") return sum + 60;
      if (v.type === "restaurant") return sum + 90;
      if (v.type === "movie") return sum + 150;
      if (v.type === "outdoor") return sum + 90;
      if (v.type === "entertainment") return sum + 120;
      if (v.type === "shopping") return sum + 120;
      return sum + 75;
    }, 0);

    const totalMinutes = routeDetails.totalMinutes + activityMinutes;
    const totalCost = planBudget + routeDetails.totalFuelCost;
    const fatigue = calculateFatigue(routeDetails.totalMinutes, activityMinutes, planVenues.length);

    // Build human-readable itinerary
    const itinerary = [];
    let currentTime = startTime === "morning" ? 480 : startTime === "afternoon" ? 720 : startTime === "evening" ? 1080 : 1260;

    // Pickup
    const pickupTravel = estimateTravelTime("seri-kembangan", "ttdi", dayType, startTime);
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🚗 Leave from Seri Kembangan", detail: `Drive to TTDI to pick her up (~${pickupTravel.minutes} min, ${pickupTravel.distance}km)`, duration: pickupTravel.minutes });
    currentTime += pickupTravel.minutes;
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "💕 Pick up from TTDI", detail: "Meet at her place", duration: 5 });
    currentTime += 5;

    planVenues.forEach((venue, i) => {
      const prev = i === 0 ? "ttdi" : planVenues[i-1].area;
      const travelToVenue = estimateTravelTime(prev, venue.area, dayType, startTime);
      if (travelToVenue.minutes > 5) {
        itinerary.push({ time: formatTimeFromMinutes(currentTime), action: `🚗 Drive to ${venue.area.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}`, detail: `~${travelToVenue.minutes} min drive`, duration: travelToVenue.minutes });
        currentTime += travelToVenue.minutes;
      }
      const actTime = venue.type === "restaurant" ? 90 : venue.type === "movie" ? 150 : venue.type === "entertainment" ? 120 : venue.type === "outdoor" ? 90 : 60;
      const emoji = venue.type === "cafe" ? "☕" : venue.type === "restaurant" ? "🍽️" : venue.type === "movie" ? "🎬" : venue.type === "outdoor" ? "🌿" : venue.type === "entertainment" ? "🎮" : venue.type === "shopping" ? "🛍️" : venue.type === "art" ? "🎨" : "✨";
      itinerary.push({ time: formatTimeFromMinutes(currentTime), action: `${emoji} ${venue.name}`, detail: `${venue.description} (~${actTime} min, ~RM${venue.estimatedCost})`, duration: actTime, venueId: venue.id });
      currentTime += actTime;
    });

    // Drive back
    const lastVenueArea = planVenues[planVenues.length - 1].area;
    const returnTravel = estimateTravelTime(lastVenueArea, "ttdi", dayType, "evening");
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🚗 Drive back to TTDI", detail: `Drop her off (~${returnTravel.minutes} min)`, duration: returnTravel.minutes });
    currentTime += returnTravel.minutes;
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "💝 Drop off & goodnight", detail: "End the date on a sweet note", duration: 5 });
    currentTime += 5;
    const homeTravel = estimateTravelTime("ttdi", "seri-kembangan", dayType, "night");
    itinerary.push({ time: formatTimeFromMinutes(currentTime), action: "🏠 Drive home", detail: `Back to Seri Kembangan (~${homeTravel.minutes} min)`, duration: homeTravel.minutes });

    // Build plan theme
    const theme = generatePlanTheme(planVenues);

    const plan = {
      id: generateId("plan"),
      theme,
      venues: planVenues.map(v => ({ id: v.id, name: v.name, area: v.area, type: v.type, cost: v.estimatedCost, score: v._score, reasons: v._reasons })),
      itinerary,
      route: routeAreas,
      routeDetails,
      budget: { food: planBudget, transport: routeDetails.totalFuelCost, total: totalCost },
      time: { travel: routeDetails.totalMinutes, activity: activityMinutes, total: totalMinutes },
      distance: routeDetails.totalDistance,
      fatigue,
      dateType,
      overallScore: Math.round(planVenues.reduce((s, v) => s + v._score, 0) / planVenues.length)
    };
    plans.push(plan);
  }

  thinkingLog.push({ step: "📝 Generated date plans", detail: `${plans.length} unique plans created` });
  plans.sort((a, b) => b.overallScore - a.overallScore);

  return { plans, thinkingLog };
}

function generatePlanTheme(venues) {
  const types = venues.map(v => v.type);
  const vibes = venues.flatMap(v => v.vibes || []);

  if (vibes.includes("romantic") && vibes.includes("nature")) return "🌿 Romantic Nature Escape";
  if (vibes.includes("luxurious") || vibes.includes("upscale")) return "✨ Fancy Date Night";
  if (vibes.includes("adventure") || vibes.includes("active")) return "🏃 Adventure Date";
  if (types.includes("cafe") && types.includes("outdoor")) return "☕ Cafe & Chill Walk";
  if (types.every(t => t === "cafe")) return "☕ Cafe Hopping";
  if (types.includes("movie")) return "🎬 Movie Date";
  if (types.includes("restaurant") && types.length === 1) return "🍽️ Dinner Date";
  if (vibes.includes("cozy") || vibes.includes("intimate")) return "🫶 Cozy & Intimate";
  if (vibes.includes("fun") || vibes.includes("exciting")) return "🎉 Fun Day Out";
  if (vibes.includes("aesthetic") || vibes.includes("artsy")) return "🎨 Aesthetic Date";
  if (types.includes("home")) return "🏠 Stay-in Date";
  return "💕 Sweet Date Plan";
}

function formatTimeFromMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${String(mins).padStart(2,'0')} ${period}`;
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


// ── Surprise Generator ───────────────────────────────────────────────────────

const SURPRISE_ACTIVITIES = [
  { text: "Take her for a surprise bubble tea run 🧋", tags: ["bubble-tea", "sweet", "spontaneous"], cost: 15 },
  { text: "Bring her favorite food unannounced 🍜", tags: ["food", "surprise", "thoughtful"], cost: 25 },
  { text: "Plan a secret sunset drive to Desa Park City 🌅", tags: ["driving", "sunset", "romantic"], cost: 10 },
  { text: "Surprise matcha cafe visit at Niko Neko 🍵", tags: ["matcha", "cafe", "aesthetic"], cost: 40 },
  { text: "Pack a surprise picnic at KLCC Park 🧺", tags: ["picnic", "outdoor", "romantic"], cost: 30 },
  { text: "Book a surprise pottery class together 🏺", tags: ["creative", "hands-on", "unique"], cost: 90 },
  { text: "Take her stargazing at Putrajaya Lake 🌟", tags: ["romantic", "night", "stars"], cost: 5 },
  { text: "Surprise spa day booking at Hammam Spa 💆", tags: ["spa", "pampering", "luxury"], cost: 140 },
  { text: "Spontaneous bookstore trip to BookXcess 📚", tags: ["books", "quiet", "thoughtful"], cost: 30 },
  { text: "Night drive through KL with city lights 🌃", tags: ["driving", "night", "romantic"], cost: 10 },
  { text: "Bring a home-cooked meal to her place 🍳", tags: ["cooking", "homemade", "acts"], cost: 20 },
  { text: "Surprise dessert delivery from her fav spot 🍰", tags: ["desserts", "sweet", "surprise"], cost: 25 },
  { text: "Take her to a new cafe she hasn't tried ☕", tags: ["cafe", "discovery", "adventure"], cost: 35 },
  { text: "Buy her a book from her wish list and leave it at her door 📖", tags: ["books", "gifts", "thoughtful"], cost: 40 }
];

const SURPRISE_GIFTS = [
  { text: "Customized phone case with your couple photo 📱", tags: ["tech", "photos", "personal"], cost: 40 },
  { text: "A handwritten love letter in a nice envelope 💌", tags: ["writing", "romantic", "personal"], cost: 5 },
  { text: "Her favorite snacks in a cute basket 🎀", tags: ["food", "cute", "thoughtful"], cost: 30 },
  { text: "A small succulent plant for her room 🪴", tags: ["nature", "cute", "aesthetic"], cost: 20 },
  { text: "Matching keychains or bracelets 🔑", tags: ["matching", "cute", "accessories"], cost: 25 },
  { text: "A cozy blanket for movie nights 🧣", tags: ["cozy", "home", "comfort"], cost: 40 },
  { text: "Photo collage of your memories together 📸", tags: ["photos", "memories", "personal"], cost: 15 },
  { text: "A matcha kit for her to make at home 🍵", tags: ["matcha", "foodie", "unique"], cost: 50 },
  { text: "Flowers from a local florist 🌸", tags: ["flowers", "romantic", "classic"], cost: 30 },
  { text: "A journal or planner she'd love 📓", tags: ["stationery", "thoughtful", "practical"], cost: 25 },
  { text: "Surprise concert/event tickets 🎫", tags: ["events", "music", "exciting"], cost: 100 },
  { text: "Scented candle in her favorite fragrance 🕯️", tags: ["candles", "cozy", "aesthetic"], cost: 35 }
];

function generateSurprise() {
  const profile = getProfile();
  const allLikes = [...(profile.likes.food || []), ...(profile.likes.activities || []), ...(profile.likes.aesthetic || [])].map(l => l.toLowerCase());
  const hasProfile = allLikes.length > 0;

  let activities = SURPRISE_ACTIVITIES.map(a => {
    let score = 0;
    if (hasProfile) {
      for (const tag of a.tags) {
        for (const like of allLikes) {
          if (tag.toLowerCase().includes(like) || like.includes(tag.toLowerCase())) { score++; break; }
        }
      }
    }
    return { ...a, _score: score };
  });

  let gifts = SURPRISE_GIFTS.map(g => {
    let score = 0;
    if (hasProfile) {
      for (const tag of g.tags) {
        for (const like of allLikes) {
          if (tag.toLowerCase().includes(like) || like.includes(tag.toLowerCase())) { score++; break; }
        }
      }
    }
    return { ...g, _score: score };
  });

  activities.sort((a, b) => b._score - a._score);
  gifts.sort((a, b) => b._score - a._score);

  let pickedActivity, pickedGift;
  if (hasProfile && activities[0]._score > 0) {
    const topA = activities.filter(a => a._score === activities[0]._score);
    pickedActivity = topA[Math.floor(Math.random() * topA.length)];
  } else {
    pickedActivity = activities[Math.floor(Math.random() * activities.length)];
  }
  if (hasProfile && gifts[0]._score > 0) {
    const topG = gifts.filter(g => g._score === gifts[0]._score);
    pickedGift = topG[Math.floor(Math.random() * topG.length)];
  } else {
    pickedGift = gifts[Math.floor(Math.random() * gifts.length)];
  }

  return {
    activity: pickedActivity,
    gift: pickedGift,
    message: hasProfile ? "✨ Based on what she loves" : "✨ Random surprise (add her profile for personalized ones)"
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
function daysAgo(dateStr) {
  if (!dateStr) return 999;
  const d = new Date(dateStr + "T00:00:00");
  return Math.floor((new Date() - d) / 86400000);
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
  const resultArea = document.getElementById("planner-results");
  if (currentPlans.length === 0) {
    resultArea.innerHTML = `<div class="empty-state"><p>🤔 Couldn't generate plans with these constraints. Try adjusting the budget or date type!</p></div>`;
    return;
  }

  resultArea.innerHTML = `<h3 style="margin-bottom:16px">💡 ${currentPlans.length} Date Plans Generated</h3>` +
    currentPlans.map((plan, idx) => `
      <div class="date-plan-card ${idx === 0 ? 'recommended' : ''}">
        <div class="plan-header">
          <div>
            <h4>${plan.theme}</h4>
            ${idx === 0 ? '<span class="badge badge-primary">⭐ Top Pick</span>' : ''}
            <span class="badge badge-score">Score: ${plan.overallScore}/100</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="tryDatePlan(${idx})">🎯 Try This Date</button>
        </div>

        <div class="plan-stats">
          <div class="plan-stat"><span class="plan-stat-icon">💰</span><span>RM ${plan.budget.total}</span><span class="plan-stat-label">Total Cost</span></div>
          <div class="plan-stat"><span class="plan-stat-icon">⏱️</span><span>${Math.round(plan.time.total / 60 * 10) / 10} hrs</span><span class="plan-stat-label">Total Time</span></div>
          <div class="plan-stat"><span class="plan-stat-icon">🚗</span><span>${plan.distance} km</span><span class="plan-stat-label">Driving</span></div>
          <div class="plan-stat"><span class="plan-stat-icon">😴</span><span>${plan.fatigue}/10</span><span class="plan-stat-label">Fatigue</span></div>
        </div>

        <div class="plan-venues">
          ${plan.venues.map(v => `
            <div class="plan-venue-chip">
              <strong>${escapeHTML(v.name)}</strong>
              <span class="badge">${v.area.replace(/-/g,' ')}</span>
              <span style="color:var(--text-secondary)">~RM${v.cost}</span>
            </div>
          `).join('')}
        </div>

        <details class="plan-itinerary-toggle">
          <summary>📋 View Full Itinerary</summary>
          <div class="plan-itinerary">
            ${plan.itinerary.map(item => `
              <div class="itinerary-item">
                <span class="itinerary-time">${item.time}</span>
                <div class="itinerary-content">
                  <strong>${item.action}</strong>
                  <span>${item.detail}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </details>

        <details class="plan-reasoning-toggle">
          <summary>🧠 Why This Plan</summary>
          <div class="plan-reasoning">
            ${plan.venues.map(v => `
              <div class="venue-reasoning">
                <strong>${escapeHTML(v.name)}</strong>
                <ul>${v.reasons.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
            `).join('')}
          </div>
        </details>
      </div>
    `).join('');
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

function renderSuggestions() {
  const ranked = getRankedSuggestions();
  const listEl = document.getElementById("suggestions-list");

  const filterType = document.getElementById("filter-type")?.value || "all";
  const filterArea = document.getElementById("filter-area")?.value || "all";

  let filtered = ranked;
  if (filterType !== "all") filtered = filtered.filter(s => s.type === filterType || s.category === filterType);
  if (filterArea !== "all") filtered = filtered.filter(s => s.area === filterArea);

  listEl.innerHTML = filtered.slice(0, 20).map((s, i) => `
    <div class="suggestion-card">
      <div class="suggestion-card-header">
        <div>
          <h4>${escapeHTML(s.name)}</h4>
          <span class="badge">${s.area ? s.area.replace(/-/g,' ') : 'General'}</span>
          <span class="badge badge-type">${s.type}</span>
        </div>
        <span class="score-badge score-lg">${s.scores.total}</span>
      </div>
      <p class="suggestion-desc">${escapeHTML(s.description)}</p>
      <div class="score-breakdown">
        <span title="Like Match">💝 ${s.scores.likeMatch}</span>
        <span title="Budget Fit">💰 ${s.scores.budgetFit}</span>
        <span title="Past Success">📊 ${s.scores.pastSuccess}</span>
        <span title="Novelty">🆕 ${s.scores.novelty}</span>
      </div>
      <div style="margin-top:8px;font-size:0.85em;color:var(--text-secondary)">~${formatCurrency(s.estimatedCost)}</div>
    </div>
  `).join('');
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
  const surprise = generateSurprise();
  const el = document.getElementById('surprise-result');
  el.innerHTML = `
    <p class="surprise-attribution">${surprise.message}</p>
    <div class="surprise-card">
      <div class="surprise-icon">🎯</div>
      <div><strong>Surprise Activity</strong><p>${escapeHTML(surprise.activity.text)}</p><span class="badge">~RM ${surprise.activity.cost}</span></div>
    </div>
    <div class="surprise-card">
      <div class="surprise-icon">🎁</div>
      <div><strong>Gift Idea</strong><p>${escapeHTML(surprise.gift.text)}</p><span class="badge">~RM ${surprise.gift.cost}</span></div>
    </div>
    <button class="btn btn-primary" style="margin-top:16px" onclick="renderSurprises()">🔄 Generate Another</button>
  `;
}


// ══════════════════════════════════════════════════════════════════════════════
// Reminders
// ══════════════════════════════════════════════════════════════════════════════

function renderReminders() {
  const upcoming = getUpcomingReminders();
  const listEl = document.getElementById('reminders-list');

  if (upcoming.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><p>No reminders set. Don't forget the important dates!</p></div>`;
    return;
  }

  listEl.innerHTML = upcoming.map(r => `
    <div class="reminder-card ${r._daysUntil <= 3 ? 'reminder-urgent' : r._daysUntil <= 7 ? 'reminder-soon' : ''}">
      <div style="flex:1">
        <strong>${escapeHTML(r.label)}</strong>
        <div style="color:var(--text-secondary);font-size:0.85em">
          ${r._daysUntil === 0 ? '🔴 TODAY!' : r._daysUntil === 1 ? '🟠 Tomorrow' : `${r._daysUntil} days away`}
          · ${formatDate(r.date)}
          ${r.recurring && r.recurring !== 'none' ? `· 🔁 ${r.recurring}` : ''}
        </div>
      </div>
      <button class="btn btn-sm btn-danger" data-delete-reminder="${r.id}">×</button>
    </div>
  `).join('');

  listEl.querySelectorAll('[data-delete-reminder]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this reminder?')) {
        deleteReminder(btn.dataset.deleteReminder);
        renderReminders();
        showToast('Reminder deleted');
      }
    });
  });
}

function openAddReminderModal() {
  const html = `
    <div class="form-group"><label>What to remember</label><input type="text" id="modal-reminder-label" placeholder="e.g. Anniversary dinner" autocomplete="off"></div>
    <div class="form-row">
      <div class="form-group"><label>Date</label><input type="date" id="modal-reminder-date"></div>
      <div class="form-group"><label>Recurring</label>
        <select id="modal-reminder-recurring"><option value="none">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
      </div>
    </div>
  `;
  openModal('🔔 Add Reminder', html, () => {
    const label = document.getElementById('modal-reminder-label').value.trim();
    const date = document.getElementById('modal-reminder-date').value;
    const recurring = document.getElementById('modal-reminder-recurring').value;
    if (!label || !date) { showToast('Please fill in all fields', 'error'); return; }
    addReminder({ id: generateId('r'), label, date, recurring });
    closeModal();
    renderReminders();
    showToast('Reminder set! 🔔');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Places Explorer (NEW)
// ══════════════════════════════════════════════════════════════════════════════

function renderPlaces() {
  const perf = getVenuePerformance();
  const discovery = getDiscoveryLog();
  const filterArea = document.getElementById("places-filter-area")?.value || "all";
  const filterType = document.getElementById("places-filter-type")?.value || "all";
  const filterStatus = document.getElementById("places-filter-status")?.value || "all";

  let venues = [...VENUES_DB];
  if (filterArea !== "all") venues = venues.filter(v => v.area === filterArea);
  if (filterType !== "all") venues = venues.filter(v => v.type === filterType);
  if (filterStatus === "visited") venues = venues.filter(v => perf[v.id] && perf[v.id].visits > 0);
  if (filterStatus === "unvisited") venues = venues.filter(v => !perf[v.id] || perf[v.id].visits === 0);

  const listEl = document.getElementById("places-list");
  const visited = Object.keys(perf).length;

  document.getElementById("places-stats").innerHTML = `
    <div class="stat-card"><div class="stat-icon">📍</div><div class="stat-value">${VENUES_DB.length}</div><div class="stat-label">Total Places</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value">${visited}</div><div class="stat-label">Visited</div></div>
    <div class="stat-card"><div class="stat-icon">🆕</div><div class="stat-value">${VENUES_DB.length - visited}</div><div class="stat-label">To Explore</div></div>
    <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${getTopRatedArea()}</div><div class="stat-label">Fav Area</div></div>
  `;

  listEl.innerHTML = venues.map(v => {
    const p = perf[v.id];
    const avgRating = p ? (p.totalHerRating / p.visits).toFixed(1) : null;
    const visitInfo = p ? `✅ Visited ${p.visits}x · Her avg: ${avgRating}/10` : '🆕 Not visited yet';
    const travel = getTravelKey("ttdi", v.area);
    const travelInfo = travel ? `${travel.car} min drive` : '';

    return `
      <div class="place-card ${p ? 'place-visited' : 'place-new'}">
        <div class="place-header">
          <div>
            <h4>${escapeHTML(v.name)}</h4>
            <span class="badge">${v.area.replace(/-/g,' ')}</span>
            <span class="badge badge-type">${v.type}</span>
            ${travelInfo ? `<span class="badge badge-travel">🚗 ${travelInfo}</span>` : ''}
          </div>
          ${avgRating ? `<span class="score-badge ${parseFloat(avgRating) >= 8 ? 'score-high' : parseFloat(avgRating) >= 5 ? 'score-mid' : 'score-low'}">${avgRating}</span>` : ''}
        </div>
        <p class="suggestion-desc">${escapeHTML(v.description)}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <span style="font-size:0.85em;color:var(--text-secondary)">${visitInfo} · ~RM${v.estimatedCost}</span>
          <div class="tag-list">${(v.vibes || []).map(vb => `<span class="tag tag-sm">${vb}</span>`).join('')}</div>
        </div>
      </div>
    `;
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

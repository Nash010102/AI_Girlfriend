/* ═══════════════════════════════════════════════════════════════════════════
   Project Mochi 🍡 — AI Relationship Assistant
   Complete Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUGGESTIONS_DB = [
  { name: "Matcha Cafe Date", type: "cafe", tags: ["matcha", "desserts", "quiet", "cafe", "cute"], estimatedCost: 40, description: "Visit a cozy matcha cafe for desserts and conversation", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Sushi Dinner", type: "restaurant", tags: ["sushi", "japanese", "dinner", "food"], estimatedCost: 60, description: "Enjoy fresh sushi together at a nice restaurant", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Movie Night", type: "movie", tags: ["movies", "cinema", "cozy", "popcorn"], estimatedCost: 35, description: "Watch the latest movie together with snacks", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Arcade Adventure", type: "arcade", tags: ["arcades", "games", "fun", "competitive"], estimatedCost: 50, description: "Challenge each other at the arcade", introvertFriendly: false, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Beach Sunset Walk", type: "outdoor", tags: ["beach", "walks", "sunset", "romantic", "nature"], estimatedCost: 10, description: "Walk along the beach as the sun sets", introvertFriendly: true, loveLanguages: ["quality-time"], category: "outdoor" },
  { name: "Picnic in the Park", type: "outdoor", tags: ["picnic", "park", "nature", "homemade", "quiet"], estimatedCost: 25, description: "Pack homemade food and enjoy a peaceful picnic", introvertFriendly: true, loveLanguages: ["quality-time", "acts"], category: "outdoor" },
  { name: "Cooking Together", type: "home", tags: ["cooking", "homemade", "cozy", "fun"], estimatedCost: 30, description: "Cook a new recipe together at home", introvertFriendly: true, loveLanguages: ["quality-time", "acts"], category: "food" },
  { name: "Bookstore & Coffee", type: "cafe", tags: ["books", "coffee", "quiet", "cafe", "reading"], estimatedCost: 35, description: "Browse a bookstore then relax at a nearby cafe", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Night Market Date", type: "shopping", tags: ["night market", "street food", "shopping", "lively"], estimatedCost: 45, description: "Explore a night market, try street food, find cute items", introvertFriendly: false, loveLanguages: ["quality-time", "gifts"], category: "food" },
  { name: "Dessert Hopping", type: "cafe", tags: ["desserts", "sweets", "cafe", "cute", "matcha"], estimatedCost: 50, description: "Visit 2-3 different dessert spots in one evening", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Art Gallery Visit", type: "other", tags: ["art", "gallery", "quiet", "culture", "aesthetic"], estimatedCost: 20, description: "Explore a local art gallery or exhibition", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Board Game Cafe", type: "cafe", tags: ["games", "cafe", "fun", "cozy", "board games"], estimatedCost: 40, description: "Play board games at a themed cafe", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Stargazing", type: "outdoor", tags: ["stars", "night", "romantic", "quiet", "nature"], estimatedCost: 5, description: "Find a dark spot and watch the stars together", introvertFriendly: true, loveLanguages: ["quality-time"], category: "outdoor" },
  { name: "Ramen Date", type: "restaurant", tags: ["ramen", "japanese", "dinner", "cozy", "warm"], estimatedCost: 40, description: "Warm up with delicious ramen at a cozy spot", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Photo Walk", type: "outdoor", tags: ["photography", "walking", "creative", "aesthetic"], estimatedCost: 10, description: "Walk around a pretty area and take photos of each other", introvertFriendly: true, loveLanguages: ["quality-time"], category: "outdoor" },
  { name: "Spa / Self-care Day", type: "other", tags: ["spa", "relaxing", "self-care", "pampering"], estimatedCost: 80, description: "Treat yourselves to a relaxing spa day", introvertFriendly: true, loveLanguages: ["quality-time", "acts"], category: "entertainment" },
  { name: "Karaoke Night", type: "entertainment", tags: ["karaoke", "singing", "fun", "music"], estimatedCost: 45, description: "Sing your hearts out at a private karaoke room", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Baking Together", type: "home", tags: ["baking", "desserts", "homemade", "cute", "fun"], estimatedCost: 20, description: "Bake cookies or a cake together at home", introvertFriendly: true, loveLanguages: ["quality-time", "acts"], category: "food" },
  { name: "Thrift Shopping", type: "shopping", tags: ["shopping", "thrift", "unique", "fashion"], estimatedCost: 40, description: "Hunt for unique finds at thrift stores", introvertFriendly: false, loveLanguages: ["quality-time", "gifts"], category: "shopping" },
  { name: "Movie Marathon at Home", type: "home", tags: ["movies", "cozy", "snacks", "home", "blankets"], estimatedCost: 15, description: "Cozy movie marathon with blankets and snacks", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Bubble Tea Date", type: "cafe", tags: ["bubble tea", "drinks", "cute", "quick"], estimatedCost: 20, description: "Grab bubble tea and go for a walk", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Garden / Flower Market", type: "outdoor", tags: ["flowers", "garden", "nature", "cute", "aesthetic"], estimatedCost: 25, description: "Visit a garden or flower market together", introvertFriendly: true, loveLanguages: ["quality-time", "gifts"], category: "outdoor" },
  { name: "Pottery / Art Class", type: "other", tags: ["art", "creative", "pottery", "hands-on", "unique"], estimatedCost: 70, description: "Take a pottery or art class together", introvertFriendly: true, loveLanguages: ["quality-time"], category: "entertainment" },
  { name: "Japanese Dessert Cafe", type: "cafe", tags: ["japanese", "desserts", "matcha", "mochi", "cute", "quiet"], estimatedCost: 45, description: "Visit a Japanese-style dessert cafe for mochi and matcha treats", introvertFriendly: true, loveLanguages: ["quality-time"], category: "food" },
  { name: "Sunset Drive", type: "outdoor", tags: ["driving", "sunset", "music", "romantic"], estimatedCost: 15, description: "Drive to a scenic spot with good music playing", introvertFriendly: true, loveLanguages: ["quality-time"], category: "outdoor" }
];

const GIFT_IDEAS = [
  { name: "Matcha dessert box", tags: ["matcha", "desserts", "food"], cost: 35, occasions: ["birthday", "anniversary", "random"] },
  { name: "Cute plushie", tags: ["cute", "plushie", "soft"], cost: 30, occasions: ["birthday", "random", "comfort"] },
  { name: "Handwritten letter + flowers", tags: ["romantic", "flowers", "personal"], cost: 25, occasions: ["anniversary", "random"] },
  { name: "Photo memory frame", tags: ["photos", "memories", "personal"], cost: 40, occasions: ["birthday", "anniversary"] },
  { name: "Custom phone case", tags: ["cute", "personal", "aesthetic"], cost: 35, occasions: ["birthday", "random"] },
  { name: "Scented candle set", tags: ["cozy", "home", "relaxing", "aesthetic"], cost: 30, occasions: ["birthday", "random"] },
  { name: "Skincare set", tags: ["self-care", "pampering"], cost: 50, occasions: ["birthday", "anniversary"] },
  { name: "Matching accessories", tags: ["matching", "cute", "couple"], cost: 40, occasions: ["anniversary", "random"] },
  { name: "Her favorite snack box", tags: ["food", "snacks", "comfort"], cost: 25, occasions: ["random", "comfort"] },
  { name: "Jewelry (simple)", tags: ["aesthetic", "fashion", "elegant"], cost: 60, occasions: ["birthday", "anniversary"] },
  { name: "Art print / poster", tags: ["aesthetic", "art", "decor"], cost: 25, occasions: ["birthday", "random"] },
  { name: "Book she's been wanting", tags: ["books", "reading", "personal"], cost: 30, occasions: ["birthday", "random"] },
  { name: "Personalized mug", tags: ["cute", "personal", "home"], cost: 20, occasions: ["random", "birthday"] },
  { name: "Experience voucher (cafe/spa)", tags: ["experience", "cafe", "spa"], cost: 60, occasions: ["birthday", "anniversary"] },
  { name: "Handmade coupon book", tags: ["personal", "cute", "romantic", "creative"], cost: 5, occasions: ["anniversary", "random"] }
];

const SURPRISE_ACTIVITIES = [
  { text: "Take her to a matcha cafe", tags: ["matcha", "cafe"], cost: 30 },
  { text: "Go for a sunset walk", tags: ["walks", "romantic"], cost: 0 },
  { text: "Have a cozy movie night", tags: ["movies", "cozy"], cost: 15 },
  { text: "Visit a dessert shop", tags: ["desserts", "sweets"], cost: 35 },
  { text: "Cook her favorite meal", tags: ["cooking", "homemade"], cost: 25 },
  { text: "Go stargazing together", tags: ["romantic", "nature"], cost: 5 },
  { text: "Visit an arcade", tags: ["arcades", "fun"], cost: 40 },
  { text: "Explore a bookstore together", tags: ["books", "quiet"], cost: 20 },
  { text: "Go to a bubble tea shop", tags: ["bubble tea", "drinks"], cost: 15 },
  { text: "Take a photo walk in the city", tags: ["photography", "aesthetic"], cost: 0 }
];

const SURPRISE_GIFTS = [
  { text: "Give her a small plushie", tags: ["cute", "plushie"], cost: 25 },
  { text: "Bring her favorite snack", tags: ["food", "comfort"], cost: 10 },
  { text: "Write her a handwritten note", tags: ["romantic", "personal"], cost: 2 },
  { text: "Give her a single flower", tags: ["flowers", "romantic"], cost: 8 },
  { text: "Get her a cute keychain", tags: ["cute", "aesthetic"], cost: 12 },
  { text: "Surprise her with bubble tea", tags: ["bubble tea", "drinks"], cost: 12 },
  { text: "Make a small photo collage", tags: ["photos", "personal"], cost: 5 },
  { text: "Get her a mini dessert", tags: ["desserts", "matcha"], cost: 15 }
];

const SURPRISE_GESTURES = [
  "Tell her 3 things you love about her",
  "Play her favorite song during the drive",
  "Hold her hand the entire time",
  "Take candid photos of her smiling",
  "Let her pick the next destination",
  "Compliment something specific about her today",
  "Send her a sweet text before you meet",
  "Save the receipt or ticket as a memory"
];

const CONVERSATION_TOPICS = [
  "Ask about her upcoming plans this week",
  "Ask what show she's been watching lately",
  "Talk about a happy memory you share",
  "Ask what she's been craving to eat",
  "Talk about a place you both want to visit",
  "Ask about her work or study goals",
  "Discuss a dream date you'd both enjoy",
  "Share something you appreciate about her"
];

const SURPRISE_THEMES = [
  "Cozy Evening Out",
  "Sweet Surprise Date",
  "Little Adventure Together",
  "Soft & Romantic Afternoon",
  "A Day Just for Her",
  "Cute Date Vibes",
  "Mini Love Celebration",
  "Spontaneous Sweetness",
  "Heartfelt Hangout",
  "Dreamy Day Plan"
];

const TYPE_LABELS = {
  restaurant: "🍽️ Restaurant",
  cafe: "☕ Cafe",
  movie: "🎬 Movie",
  outdoor: "🌿 Outdoor",
  arcade: "🕹️ Arcade",
  shopping: "🛍️ Shopping",
  home: "🏠 Home",
  entertainment: "🎤 Entertainment",
  other: "💫 Other"
};

const MOOD_LABELS = {
  happy: "😊 Happy",
  neutral: "😐 Neutral",
  stressed: "😰 Stressed",
  tired: "😴 Tired",
  excited: "🤩 Excited"
};

const REACTION_LABELS = {
  loved: "😍 Loved",
  liked: "😊 Liked",
  okay: "😐 Okay",
  disliked: "😞 Disliked"
};

const REMINDER_ICONS = {
  anniversary: "💑",
  birthday: "🎂",
  checkin: "💬",
  comfort: "🫂",
  surprise: "🎉",
  custom: "📌"
};


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: DATA LAYER
// ─────────────────────────────────────────────────────────────────────────────

function getData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Profile ──────────────────────────────────────────────────────────────────

const DEFAULT_PROFILE = {
  name: "",
  birthday: "",
  loveLanguage: "quality-time",
  introvertLevel: 5,
  budgetComfort: "medium",
  likes: { food: [], activities: [], aesthetic: [] },
  dislikes: { food: [], activities: [] },
  emotionalTriggers: { happy: [], stress: [], comfort: [] },
  specialDates: { anniversary: "", firstDate: "", memorable: [] }
};

function getProfile() {
  const stored = getData("mochi_profile", null);
  if (!stored) return { ...DEFAULT_PROFILE, likes: { ...DEFAULT_PROFILE.likes }, dislikes: { ...DEFAULT_PROFILE.dislikes }, emotionalTriggers: { ...DEFAULT_PROFILE.emotionalTriggers }, specialDates: { ...DEFAULT_PROFILE.specialDates } };
  // Deep merge with defaults to ensure all keys exist
  return {
    ...DEFAULT_PROFILE,
    ...stored,
    likes: { ...DEFAULT_PROFILE.likes, ...(stored.likes || {}) },
    dislikes: { ...DEFAULT_PROFILE.dislikes, ...(stored.dislikes || {}) },
    emotionalTriggers: { ...DEFAULT_PROFILE.emotionalTriggers, ...(stored.emotionalTriggers || {}) },
    specialDates: { ...DEFAULT_PROFILE.specialDates, ...(stored.specialDates || {}) }
  };
}

function saveProfile(profile) {
  setData("mochi_profile", profile);
  updateSidebarName();
}

// ── Dates ────────────────────────────────────────────────────────────────────

function getDates() {
  return getData("mochi_dates", []).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function addDate(dateEntry) {
  const dates = getData("mochi_dates", []);
  dates.push(dateEntry);
  setData("mochi_dates", dates);
}

function deleteDate(id) {
  const dates = getData("mochi_dates", []).filter(d => d.id !== id);
  setData("mochi_dates", dates);
}

// ── Budget ───────────────────────────────────────────────────────────────────

const DEFAULT_BUDGET = { monthlyBudget: 300, currency: "RM", expenses: [] };

function getBudget() {
  const stored = getData("mochi_budget", null);
  if (!stored) return { ...DEFAULT_BUDGET, expenses: [] };
  return { ...DEFAULT_BUDGET, ...stored, expenses: stored.expenses || [] };
}

function saveBudget(budget) {
  setData("mochi_budget", budget);
}

function addExpense(expense) {
  const budget = getBudget();
  budget.expenses.push(expense);
  saveBudget(budget);
}

function deleteExpense(id) {
  const budget = getBudget();
  budget.expenses = budget.expenses.filter(e => e.id !== id);
  saveBudget(budget);
}

function getCurrentMonthExpenses() {
  const budget = getBudget();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return budget.expenses.filter(e => {
    if (!e.date) return false;
    const d = new Date(e.date + "T00:00:00");
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
}

function getMonthlySpent() {
  return getCurrentMonthExpenses().reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
}

function getRemainingBudget() {
  const budget = getBudget();
  return Math.max(0, budget.monthlyBudget - getMonthlySpent());
}

// ── Gifts ────────────────────────────────────────────────────────────────────

function getGifts() {
  return getData("mochi_gifts", []);
}

function addGift(gift) {
  const gifts = getGifts();
  gifts.push(gift);
  setData("mochi_gifts", gifts);
}

function toggleGiftGiven(id) {
  const gifts = getGifts();
  const gift = gifts.find(g => g.id === id);
  if (gift) {
    gift.given = !gift.given;
    setData("mochi_gifts", gifts);
  }
}

function deleteGift(id) {
  const gifts = getGifts().filter(g => g.id !== id);
  setData("mochi_gifts", gifts);
}

// ── Reminders ────────────────────────────────────────────────────────────────

function getReminders() {
  return getData("mochi_reminders", []);
}

function addReminder(reminder) {
  const reminders = getReminders();
  reminders.push(reminder);
  setData("mochi_reminders", reminders);
}

function deleteReminder(id) {
  const reminders = getReminders().filter(r => r.id !== id);
  setData("mochi_reminders", reminders);
}

function getUpcomingReminders() {
  const reminders = getReminders();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return reminders.map(r => {
    let targetDate = new Date(r.date + "T00:00:00");

    // For recurring reminders, find the next occurrence
    if (r.recurring && r.recurring !== "none") {
      const today = new Date(now);
      if (r.recurring === "yearly") {
        // Move to this year
        targetDate.setFullYear(today.getFullYear());
        // If already passed this year, move to next year
        if (targetDate < today) {
          targetDate.setFullYear(today.getFullYear() + 1);
        }
      } else if (r.recurring === "monthly") {
        targetDate.setFullYear(today.getFullYear());
        targetDate.setMonth(today.getMonth());
        if (targetDate < today) {
          targetDate.setMonth(today.getMonth() + 1);
        }
      } else if (r.recurring === "weekly") {
        const dayOfWeek = targetDate.getDay();
        const todayDay = today.getDay();
        let diff = dayOfWeek - todayDay;
        if (diff < 0) diff += 7;
        if (diff === 0 && targetDate < today) diff = 7;
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
      }
    }

    const diffTime = targetDate.getTime() - now.getTime();
    const daysUntilVal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { ...r, _daysUntil: daysUntilVal, _nextDate: targetDate };
  }).sort((a, b) => a._daysUntil - b._daysUntil);
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: AI ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function calculateLikeMatch(suggestion, profile) {
  const allLikes = [
    ...(profile.likes.food || []),
    ...(profile.likes.activities || []),
    ...(profile.likes.aesthetic || [])
  ].map(l => l.toLowerCase());

  const allDislikes = [
    ...(profile.dislikes.food || []),
    ...(profile.dislikes.activities || [])
  ].map(d => d.toLowerCase());

  if (allLikes.length === 0 && allDislikes.length === 0) return 5; // neutral

  const suggestionTags = suggestion.tags.map(t => t.toLowerCase());
  let matchCount = 0;
  let dislikeCount = 0;

  for (const tag of suggestionTags) {
    for (const like of allLikes) {
      if (tag.includes(like) || like.includes(tag)) {
        matchCount++;
        break;
      }
    }
    for (const dislike of allDislikes) {
      if (tag.includes(dislike) || dislike.includes(tag)) {
        dislikeCount++;
        break;
      }
    }
  }

  // Bonus for introvert friendliness
  let introvertBonus = 0;
  if (profile.introvertLevel >= 7 && suggestion.introvertFriendly) {
    introvertBonus = 1;
  } else if (profile.introvertLevel >= 7 && !suggestion.introvertFriendly) {
    introvertBonus = -1;
  }

  // Bonus for love language match
  let loveBonus = 0;
  if (suggestion.loveLanguages && suggestion.loveLanguages.includes(profile.loveLanguage)) {
    loveBonus = 1;
  }

  const maxPossible = Math.max(suggestionTags.length, 1);
  let score = ((matchCount - dislikeCount) / maxPossible) * 8 + introvertBonus + loveBonus;
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

function calculateBudgetFit(suggestion, remainingBudget) {
  if (remainingBudget <= 0) {
    return suggestion.estimatedCost <= 0 ? 10 : 1;
  }
  if (suggestion.estimatedCost <= remainingBudget) return 10;
  if (suggestion.estimatedCost <= remainingBudget * 1.2) return 7;
  if (suggestion.estimatedCost <= remainingBudget * 1.5) return 4;
  return 1;
}

function calculatePastSuccess(suggestion, dates) {
  const matchingDates = dates.filter(d => {
    if (d.type === suggestion.type) return true;
    const dTags = (d.tags || []).map(t => t.toLowerCase());
    const sTags = suggestion.tags.map(t => t.toLowerCase());
    return sTags.some(st => dTags.includes(st));
  });

  if (matchingDates.length === 0) return 5;

  const avgRating = matchingDates.reduce((sum, d) => sum + (d.rating || 5), 0) / matchingDates.length;
  return Math.max(0, Math.min(10, avgRating));
}

function calculateNovelty(suggestion, dates) {
  const matchingDates = dates.filter(d => d.type === suggestion.type);

  if (matchingDates.length === 0) return 10;

  // Find the most recent one
  const sorted = matchingDates.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const mostRecent = sorted[0];
  const daysSince = daysAgo(mostRecent.date);

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
  const total = (likeMatch * 0.4) + (budgetFit * 0.3) + (pastSuccess * 0.2) + (novelty * 0.1);
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

function generateSurprise() {
  const profile = getProfile();
  const allLikes = [
    ...(profile.likes.food || []),
    ...(profile.likes.activities || []),
    ...(profile.likes.aesthetic || [])
  ].map(l => l.toLowerCase());

  const hasProfile = allLikes.length > 0;

  // Score activities by profile match
  let activities = SURPRISE_ACTIVITIES.map(a => {
    let score = 0;
    if (hasProfile) {
      for (const tag of a.tags) {
        for (const like of allLikes) {
          if (tag.toLowerCase().includes(like) || like.includes(tag.toLowerCase())) {
            score++;
            break;
          }
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
          if (tag.toLowerCase().includes(like) || like.includes(tag.toLowerCase())) {
            score++;
            break;
          }
        }
      }
    }
    return { ...g, _score: score };
  });

  // Sort by score descending, then pick from top or random
  activities.sort((a, b) => b._score - a._score);
  gifts.sort((a, b) => b._score - a._score);

  let pickedActivity, pickedGift;

  if (hasProfile && activities[0]._score > 0) {
    // Pick from top matching activities (add some randomness)
    const topActivities = activities.filter(a => a._score === activities[0]._score);
    pickedActivity = topActivities[Math.floor(Math.random() * topActivities.length)];
  } else {
    pickedActivity = activities[Math.floor(Math.random() * activities.length)];
  }

  if (hasProfile && gifts[0]._score > 0) {
    const topGifts = gifts.filter(g => g._score === gifts[0]._score);
    pickedGift = topGifts[Math.floor(Math.random() * topGifts.length)];
  } else {
    pickedGift = gifts[Math.floor(Math.random() * gifts.length)];
  }

  const pickedGesture = SURPRISE_GESTURES[Math.floor(Math.random() * SURPRISE_GESTURES.length)];
  const theme = SURPRISE_THEMES[Math.floor(Math.random() * SURPRISE_THEMES.length)];
  const estimatedCost = (pickedActivity.cost || 0) + (pickedGift.cost || 0);

  return {
    theme,
    steps: [
      { type: "activity", icon: "🎯", text: pickedActivity.text },
      { type: "gift", icon: "🎁", text: pickedGift.text },
      { type: "gesture", icon: "💕", text: pickedGesture }
    ],
    estimatedCost
  };
}

// ── Gift Intelligence ────────────────────────────────────────────────────────

function getAIGiftSuggestions(occasion = "random", budget = 100) {
  const profile = getProfile();
  const pastGifts = getGifts().filter(g => g.given);
  const pastGiftNames = pastGifts.map(g => g.name.toLowerCase());

  const allLikes = [
    ...(profile.likes.food || []),
    ...(profile.likes.activities || []),
    ...(profile.likes.aesthetic || []),
    ...(profile.emotionalTriggers.comfort || [])
  ].map(l => l.toLowerCase());

  return GIFT_IDEAS
    .filter(g => g.cost <= budget)
    .filter(g => g.occasions.includes(occasion))
    .filter(g => !pastGiftNames.includes(g.name.toLowerCase()))
    .map(g => {
      let score = 0;
      if (allLikes.length > 0) {
        for (const tag of g.tags) {
          for (const like of allLikes) {
            if (tag.toLowerCase().includes(like) || like.includes(tag.toLowerCase())) {
              score++;
              break;
            }
          }
        }
      }
      return { ...g, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 5);
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// ── Navigation ───────────────────────────────────────────────────────────────

function switchTab(tabId) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update sections
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  const activeSection = document.getElementById(`section-${tabId}`);
  if (activeSection) activeSection.classList.add('active');

  // Render the appropriate section
  const renderers = {
    dashboard: renderDashboard,
    profile: renderProfile,
    dates: renderDates,
    suggestions: renderSuggestions,
    budget: renderBudget,
    gifts: renderGifts,
    surprises: renderSurprises,
    reminders: renderReminders
  };
  if (renderers[tabId]) renderers[tabId]();
}

// ── Modal ────────────────────────────────────────────────────────────────────

let currentModalSaveHandler = null;

function openModal(title, bodyHTML, onSave) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');

  // Remove old save handler if any
  const saveBtn = document.getElementById('modal-save');
  if (currentModalSaveHandler) {
    saveBtn.removeEventListener('click', currentModalSaveHandler);
  }
  currentModalSaveHandler = onSave;
  saveBtn.addEventListener('click', currentModalSaveHandler);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-body').innerHTML = '';

  const saveBtn = document.getElementById('modal-save');
  if (currentModalSaveHandler) {
    saveBtn.removeEventListener('click', currentModalSaveHandler);
    currentModalSaveHandler = null;
  }
}

// ── Toast ────────────────────────────────────────────────────────────────────

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    padding: 12px 24px; border-radius: 12px; color: #fff; font-weight: 500;
    font-size: 0.9rem; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    animation: toastSlideIn 0.3s ease; max-width: 350px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Tag Rendering ────────────────────────────────────────────────────────────

function renderTagsInContainer(container, tags, onRemove) {
  container.innerHTML = tags.map((tag, i) =>
    `<span class="tag">${escapeHTML(tag)} <button class="tag-remove" data-index="${i}">×</button></span>`
  ).join('');

  container.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      onRemove(idx);
    });
  });
}

// ── Utilities ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatCurrency(amount) {
  const budget = getBudget();
  return `${budget.currency} ${parseFloat(amount).toFixed(0)}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function daysAgo(dateStr) {
  return -daysUntil(dateStr);
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function getStars(rating) {
  const r = Math.round(Math.max(0, Math.min(10, rating)));
  return '★'.repeat(r) + '☆'.repeat(10 - r);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateSidebarName() {
  const profile = getProfile();
  const el = document.getElementById('sidebar-partner-name');
  if (el) el.textContent = profile.name ? `❤️ ${profile.name}` : 'Set up her profile →';
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: SECTION RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════════════
// Dashboard
// ══════════════════════════════════════════════════════════════════════════════

function renderDashboard() {
  const dates = getDates();
  const profile = getProfile();
  const budget = getBudget();
  const spent = getMonthlySpent();
  const remaining = getRemainingBudget();
  const upcomingReminders = getUpcomingReminders().filter(r => r._daysUntil >= 0).slice(0, 5);
  const allUpcoming = getUpcomingReminders().slice(0, 5);

  // Stat cards
  const totalDates = dates.length;
  const avgRating = totalDates > 0
    ? (dates.reduce((sum, d) => sum + (d.rating || 0), 0) / totalDates).toFixed(1)
    : "—";
  const reminderCount = upcomingReminders.length;

  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card">
      <span class="stat-icon">📅</span>
      <span class="stat-value">${totalDates}</span>
      <span class="stat-label">Total Dates</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">⭐</span>
      <span class="stat-value">${avgRating}</span>
      <span class="stat-label">Avg Rating</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">💰</span>
      <span class="stat-value">${formatCurrency(remaining)}</span>
      <span class="stat-label">Budget Left</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">🔔</span>
      <span class="stat-value">${reminderCount}</span>
      <span class="stat-label">Reminders</span>
    </div>
  `;

  // Top suggestions
  const topSuggestions = getRankedSuggestions().slice(0, 3);
  const suggestionsEl = document.getElementById('dash-suggestions');
  const topic = CONVERSATION_TOPICS[Math.floor(Math.random() * CONVERSATION_TOPICS.length)];

  if (!profile.name) {
    suggestionsEl.innerHTML = `
      <h3>Top Date Ideas</h3>
      <div class="empty-state">
        <p>👋 Welcome to Project Mochi!</p>
        <p>Start by filling out her profile to get personalized suggestions.</p>
        <button class="btn btn-primary btn-sm" onclick="switchTab('profile')">Go to Profile →</button>
      </div>
    `;
  } else {
    suggestionsEl.innerHTML = `
      <h3>Top Date Ideas</h3>
      ${topSuggestions.map((s, i) => `
        <div class="flex gap-sm" style="padding: 8px 0; border-bottom: 1px solid #f0e0e8; align-items: center;">
          <span style="font-weight:700; color:#e91e63; min-width:28px;">#${i + 1}</span>
          <div style="flex:1">
            <strong>${escapeHTML(s.name)}</strong>
            <small style="color:#666; display:block;">${escapeHTML(s.description)}</small>
          </div>
          <span class="badge" style="background:#fce4ec; color:#e91e63;">${s.scores.total}/10</span>
        </div>
      `).join('')}
      <div style="margin-top: 12px; padding: 10px; background: #f8f0f4; border-radius: 8px;">
        <small>💬 <strong>Conversation tip:</strong> ${escapeHTML(topic)}</small>
      </div>
    `;
  }

  // Budget summary
  const pct = budget.monthlyBudget > 0 ? Math.min(100, (spent / budget.monthlyBudget) * 100) : 0;
  const barColor = pct < 60 ? '#4caf50' : pct < 85 ? '#ff9800' : '#f44336';
  document.getElementById('dash-budget-summary').innerHTML = `
    <h3>Budget This Month</h3>
    <div style="margin: 16px 0;">
      <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
        <span>Spent: <strong>${formatCurrency(spent)}</strong></span>
        <span>of <strong>${formatCurrency(budget.monthlyBudget)}</strong></span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%; background:${barColor};"></div>
      </div>
      <small style="color:#666; margin-top: 4px; display:block;">Remaining: ${formatCurrency(remaining)}</small>
    </div>
  `;

  // Recent dates
  const recentDates = dates.slice(0, 3);
  const recentEl = document.getElementById('dash-recent');
  if (recentDates.length === 0) {
    recentEl.innerHTML = `
      <h3>Recent Dates</h3>
      <div class="empty-state"><p>No dates logged yet. Start by logging your first date!</p></div>
    `;
  } else {
    recentEl.innerHTML = `
      <h3>Recent Dates</h3>
      ${recentDates.map(d => `
        <div class="flex gap-sm" style="padding: 10px 0; border-bottom: 1px solid #f0e0e8; align-items: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: #e91e63; min-width: 40px;">${d.rating || '—'}</span>
          <div style="flex:1;">
            <strong>${escapeHTML(d.location || 'Unknown')}</strong>
            <small style="display:block; color:#666;">${formatDate(d.date)} · ${TYPE_LABELS[d.type] || d.type}</small>
          </div>
          ${d.reaction ? `<span class="badge">${REACTION_LABELS[d.reaction] || d.reaction}</span>` : ''}
        </div>
      `).join('')}
    `;
  }

  // Upcoming reminders
  const remEl = document.getElementById('dash-reminders');
  if (allUpcoming.length === 0) {
    remEl.innerHTML = `
      <h3>Upcoming Reminders</h3>
      <div class="empty-state"><p>No reminders set. Add important dates to stay on top of things!</p></div>
    `;
  } else {
    remEl.innerHTML = `
      <h3>Upcoming Reminders</h3>
      ${allUpcoming.map(r => {
        const icon = REMINDER_ICONS[r.type] || '📌';
        const daysText = r._daysUntil === 0 ? '<strong style="color:#e91e63;">Today!</strong>'
          : r._daysUntil < 0 ? `<strong style="color:#f44336;">${Math.abs(r._daysUntil)} days overdue</strong>`
          : r._daysUntil === 1 ? '<strong style="color:#ff9800;">Tomorrow</strong>'
          : `In ${r._daysUntil} days`;
        return `
          <div class="flex gap-sm" style="padding: 8px 0; border-bottom: 1px solid #f0e0e8; align-items: center;">
            <span style="font-size: 1.3rem;">${icon}</span>
            <div style="flex:1;">
              <strong>${escapeHTML(r.title)}</strong>
              ${r.recurring && r.recurring !== 'none' ? `<span class="badge" style="margin-left:6px; font-size:0.7rem;">${r.recurring}</span>` : ''}
            </div>
            <small>${daysText}</small>
          </div>
        `;
      }).join('')}
    `;
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// Profile
// ══════════════════════════════════════════════════════════════════════════════

function renderProfile() {
  const profile = getProfile();

  // Populate form fields
  document.getElementById('input-name').value = profile.name || '';
  document.getElementById('input-birthday').value = profile.birthday || '';
  document.getElementById('input-love-language').value = profile.loveLanguage || 'quality-time';
  document.getElementById('input-introvert').value = profile.introvertLevel || 5;
  document.getElementById('introvert-value').textContent = profile.introvertLevel || 5;
  document.getElementById('input-budget-comfort').value = profile.budgetComfort || 'medium';

  // Special dates
  document.getElementById('input-anniversary').value = profile.specialDates.anniversary || '';
  document.getElementById('input-first-date').value = profile.specialDates.firstDate || '';

  // Render all tag containers
  renderProfileTags(profile);

  // Render memorable events
  renderMemorableEvents(profile);

  // Setup event handlers (idempotent via cloneNode trick)
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
  // Save profile button
  const saveBtn = document.getElementById('btn-save-profile');
  // Replace with clone to clear old listeners
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

  // Introvert slider display
  const slider = document.getElementById('input-introvert');
  const newSlider = slider.cloneNode(true);
  slider.parentNode.replaceChild(newSlider, slider);
  newSlider.addEventListener('input', () => {
    document.getElementById('introvert-value').textContent = newSlider.value;
  });

  // Tag add buttons
  const tagConfigs = [
    { inputId: 'input-like-food', target: 'likes-food', path: 'likes.food' },
    { inputId: 'input-like-activity', target: 'likes-activities', path: 'likes.activities' },
    { inputId: 'input-like-aesthetic', target: 'likes-aesthetic', path: 'likes.aesthetic' },
    { inputId: 'input-dislike-food', target: 'dislikes-food', path: 'dislikes.food' },
    { inputId: 'input-dislike-activity', target: 'dislikes-activities', path: 'dislikes.activities' },
    { inputId: 'input-happy', target: 'happy', path: 'emotionalTriggers.happy' },
    { inputId: 'input-stress', target: 'stress', path: 'emotionalTriggers.stress' },
    { inputId: 'input-comfort', target: 'comfort', path: 'emotionalTriggers.comfort' }
  ];

  tagConfigs.forEach(({ inputId, target, path }) => {
    const addBtn = document.querySelector(`button[data-target="${target}"]`);
    const input = document.getElementById(inputId);
    if (!addBtn || !input) return;

    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    const addTag = () => {
      const val = newInput.value.trim().toLowerCase();
      if (!val) return;
      const profile = getProfile();
      const parts = path.split('.');
      const arr = parts.reduce((obj, key) => obj[key], profile);
      if (!arr.includes(val)) {
        arr.push(val);
        saveProfile(profile);
        renderProfileTags(profile);
      }
      newInput.value = '';
      newInput.focus();
    };

    newAddBtn.addEventListener('click', addTag);
    newInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    });
  });

  // Memorable date add
  const memBtn = document.getElementById('btn-add-memorable');
  if (memBtn) {
    const newMemBtn = memBtn.cloneNode(true);
    memBtn.parentNode.replaceChild(newMemBtn, memBtn);
    newMemBtn.addEventListener('click', () => {
      const label = document.getElementById('input-memorable-label').value.trim();
      const date = document.getElementById('input-memorable-date').value;
      if (!label || !date) { showToast('Please enter both a label and date', 'error'); return; }
      const profile = getProfile();
      profile.specialDates.memorable.push({ label, date });
      saveProfile(profile);
      renderMemorableEvents(profile);
      document.getElementById('input-memorable-label').value = '';
      document.getElementById('input-memorable-date').value = '';
      showToast('Memorable date added! 💫');
    });
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// Date Log
// ══════════════════════════════════════════════════════════════════════════════

function renderDates() {
  const dates = getDates();

  // Stats
  const statsEl = document.getElementById('dates-stats');
  const totalDates = dates.length;
  const avgRating = totalDates > 0
    ? (dates.reduce((s, d) => s + (d.rating || 0), 0) / totalDates).toFixed(1)
    : "—";

  // Most common type
  let mostCommonType = "—";
  if (totalDates > 0) {
    const typeCounts = {};
    dates.forEach(d => { typeCounts[d.type] = (typeCounts[d.type] || 0) + 1; });
    mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];
    mostCommonType = TYPE_LABELS[mostCommonType] || mostCommonType;
  }

  statsEl.innerHTML = `
    <div class="stat-card">
      <span class="stat-icon">📅</span>
      <span class="stat-value">${totalDates}</span>
      <span class="stat-label">Total Dates</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">⭐</span>
      <span class="stat-value">${avgRating}</span>
      <span class="stat-label">Average Rating</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">🏆</span>
      <span class="stat-value" style="font-size: ${mostCommonType.length > 14 ? '0.9rem' : '1.1rem'}">${mostCommonType}</span>
      <span class="stat-label">Most Common</span>
    </div>
  `;

  // Date cards
  const listEl = document.getElementById('dates-list');
  if (dates.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state card">
        <p style="font-size:2rem;">📅</p>
        <p>No dates logged yet!</p>
        <p><small>Click "Log a Date" to record your first date together.</small></p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = dates.map(d => `
    <div class="card mb-sm" style="position: relative;">
      <div class="flex gap-md" style="align-items: flex-start;">
        <div style="min-width:50px; text-align:center;">
          <span style="font-size:2rem; font-weight:800; color:#e91e63;">${d.rating || '—'}</span>
          <small style="display:block; color:#666; font-size:0.7rem;">/ 10</small>
        </div>
        <div style="flex:1;">
          <div class="flex gap-sm" style="align-items: center; flex-wrap: wrap;">
            <strong style="font-size:1.1rem;">${escapeHTML(d.location || 'Unknown')}</strong>
            <span class="badge">${TYPE_LABELS[d.type] || d.type}</span>
            ${d.mood ? `<span class="mood-badge badge">${MOOD_LABELS[d.mood] || d.mood}</span>` : ''}
            ${d.reaction ? `<span class="reaction-badge badge">${REACTION_LABELS[d.reaction] || d.reaction}</span>` : ''}
          </div>
          <small style="color:#666; display:block; margin: 4px 0;">${formatDate(d.date)} · ${formatCurrency(d.budget || 0)}</small>
          ${d.tags && d.tags.length > 0 ? `<div class="flex flex-wrap gap-sm" style="margin: 6px 0;">${d.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>` : ''}
          ${d.notes ? `<p style="margin: 6px 0 0; color:#555; font-size:0.9rem;">${escapeHTML(d.notes)}</p>` : ''}
        </div>
        <button class="btn btn-sm btn-danger" data-delete-date="${d.id}" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');

  // Delete handlers
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

function openDateModal(prefill = {}) {
  const html = `
    <div class="form-group">
      <label>Location</label>
      <input type="text" id="modal-date-location" placeholder="e.g. Sushi King" value="${escapeHTML(prefill.location || '')}" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="modal-date-date" value="${prefill.date || todayStr()}">
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="modal-date-type">
          ${Object.entries(TYPE_LABELS).map(([val, lbl]) => `<option value="${val}" ${val === prefill.type ? 'selected' : ''}>${lbl}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Budget Spent</label>
        <input type="number" id="modal-date-budget" min="0" placeholder="0" value="${prefill.budget || ''}">
      </div>
      <div class="form-group">
        <label>Rating (1-10)</label>
        <input type="number" id="modal-date-rating" min="1" max="10" placeholder="8" value="${prefill.rating || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Her Mood</label>
        <select id="modal-date-mood">
          <option value="">— Select —</option>
          ${Object.entries(MOOD_LABELS).map(([val, lbl]) => `<option value="${val}" ${val === prefill.mood ? 'selected' : ''}>${lbl}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Her Reaction</label>
        <select id="modal-date-reaction">
          <option value="">— Select —</option>
          ${Object.entries(REACTION_LABELS).map(([val, lbl]) => `<option value="${val}" ${val === prefill.reaction ? 'selected' : ''}>${lbl}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Tags (comma-separated)</label>
      <input type="text" id="modal-date-tags" placeholder="e.g. sushi, matcha, cozy" value="${(prefill.tags || []).join(', ')}" autocomplete="off">
    </div>
    <div class="form-group">
      <label>Notes</label>
      <textarea id="modal-date-notes" rows="3" placeholder="How did it go?">${escapeHTML(prefill.notes || '')}</textarea>
    </div>
  `;

  openModal('📅 Log a Date', html, () => {
    const location = document.getElementById('modal-date-location').value.trim();
    const date = document.getElementById('modal-date-date').value;
    const type = document.getElementById('modal-date-type').value;
    const budget = parseFloat(document.getElementById('modal-date-budget').value) || 0;
    const rating = parseInt(document.getElementById('modal-date-rating').value);
    const mood = document.getElementById('modal-date-mood').value;
    const reaction = document.getElementById('modal-date-reaction').value;
    const tagsRaw = document.getElementById('modal-date-tags').value;
    const notes = document.getElementById('modal-date-notes').value.trim();

    if (!location) { showToast('Please enter a location', 'error'); return; }
    if (!date) { showToast('Please select a date', 'error'); return; }
    if (!rating || rating < 1 || rating > 10) { showToast('Rating must be between 1 and 10', 'error'); return; }

    const tags = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    const entry = {
      id: generateId('d'),
      date,
      location,
      type,
      budget,
      mood,
      reaction,
      rating,
      tags,
      notes
    };

    addDate(entry);

    // Auto-add as budget expense if budget > 0
    if (budget > 0) {
      addExpense({
        id: generateId('e'),
        date,
        description: `Date: ${location}`,
        amount: budget,
        category: 'food'
      });
    }

    closeModal();
    renderDates();
    showToast('Date logged! 📅');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// AI Suggestions
// ══════════════════════════════════════════════════════════════════════════════

function renderSuggestions() {
  const ranked = getRankedSuggestions();
  const listEl = document.getElementById('suggestions-list');
  const budget = getBudget();

  listEl.innerHTML = ranked.map((s, i) => {
    const rank = i + 1;
    const { total, likeMatch, budgetFit, pastSuccess, novelty } = s.scores;

    return `
      <div class="card mb-sm score-card">
        <div class="flex gap-md" style="align-items: flex-start;">
          <div style="min-width: 45px; text-align: center;">
            <span style="font-size: 1.4rem; font-weight: 800; color: ${rank <= 3 ? '#e91e63' : '#999'};">#${rank}</span>
          </div>
          <div style="flex: 1;">
            <div class="flex gap-sm" style="align-items: center; flex-wrap: wrap;">
              <strong style="font-size: 1.05rem;">${escapeHTML(s.name)}</strong>
              <span class="badge" style="background: ${total >= 7 ? '#e8f5e9; color: #2e7d32' : total >= 5 ? '#fff8e1; color: #f57f17' : '#fce4ec; color: #c62828'};">${total}/10</span>
              <span class="badge">${formatCurrency(s.estimatedCost)}</span>
            </div>
            <p style="margin: 4px 0; color: #666; font-size: 0.9rem;">${escapeHTML(s.description)}</p>
            <div class="flex flex-wrap gap-sm" style="margin: 6px 0;">
              ${s.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <!-- Score breakdown bars -->
            <div style="margin-top: 8px; font-size: 0.8rem;">
              <div class="flex gap-sm" style="align-items: center; margin-bottom: 3px;">
                <span style="min-width: 90px; color: #888;">💝 Like Match</span>
                <div class="score-bar" style="flex:1;"><div class="score-fill" style="width:${likeMatch * 10}%; background: #e91e63;"></div></div>
                <span style="min-width: 28px; text-align: right; color:#888;">${likeMatch}</span>
              </div>
              <div class="flex gap-sm" style="align-items: center; margin-bottom: 3px;">
                <span style="min-width: 90px; color: #888;">💰 Budget Fit</span>
                <div class="score-bar" style="flex:1;"><div class="score-fill" style="width:${budgetFit * 10}%; background: #4caf50;"></div></div>
                <span style="min-width: 28px; text-align: right; color:#888;">${budgetFit}</span>
              </div>
              <div class="flex gap-sm" style="align-items: center; margin-bottom: 3px;">
                <span style="min-width: 90px; color: #888;">⭐ Past Success</span>
                <div class="score-bar" style="flex:1;"><div class="score-fill" style="width:${pastSuccess * 10}%; background: #ff9800;"></div></div>
                <span style="min-width: 28px; text-align: right; color:#888;">${pastSuccess}</span>
              </div>
              <div class="flex gap-sm" style="align-items: center;">
                <span style="min-width: 90px; color: #888;">✨ Novelty</span>
                <div class="score-bar" style="flex:1;"><div class="score-fill" style="width:${novelty * 10}%; background: #9c27b0;"></div></div>
                <span style="min-width: 28px; text-align: right; color:#888;">${novelty}</span>
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" data-use-suggestion="${i}" title="Use this idea">Use →</button>
        </div>
      </div>
    `;
  }).join('');

  // "Use this idea" handlers
  listEl.querySelectorAll('[data-use-suggestion]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.useSuggestion);
      const s = ranked[idx];
      openDateModal({
        location: s.name,
        type: s.type,
        budget: s.estimatedCost,
        tags: s.tags
      });
    });
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Budget Tracker
// ══════════════════════════════════════════════════════════════════════════════

function renderBudget() {
  const budget = getBudget();
  const spent = getMonthlySpent();
  const remaining = getRemainingBudget();

  // Overview stats
  document.getElementById('budget-overview').innerHTML = `
    <div class="stat-card">
      <span class="stat-icon">💰</span>
      <span class="stat-value">${formatCurrency(budget.monthlyBudget)}</span>
      <span class="stat-label">Monthly Budget</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">🧾</span>
      <span class="stat-value">${formatCurrency(spent)}</span>
      <span class="stat-label">Spent This Month</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">💵</span>
      <span class="stat-value">${formatCurrency(remaining)}</span>
      <span class="stat-label">Remaining</span>
    </div>
  `;

  // Progress bar
  const pct = budget.monthlyBudget > 0 ? Math.min(100, (spent / budget.monthlyBudget) * 100) : 0;
  const barColor = pct < 60 ? '#4caf50' : pct < 85 ? '#ff9800' : '#f44336';
  const warningMsg = remaining <= 0 ? '<p style="color:#f44336; font-weight:600; margin-top:10px;">⚠️ You\'ve exceeded your monthly budget!</p>'
    : pct >= 85 ? '<p style="color:#ff9800; font-weight:600; margin-top:10px;">⚠️ You\'re close to your budget limit!</p>'
    : '';

  document.getElementById('budget-chart').innerHTML = `
    <h3>Monthly Progress</h3>
    <div style="margin: 16px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span>${formatCurrency(spent)} spent</span>
        <span>${Math.round(pct)}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%; background:${barColor};"></div>
      </div>
      ${warningMsg}
    </div>
    <div style="border-top: 1px solid #e8d5e0; padding-top: 16px; margin-top: 16px;">
      <h4>Settings</h4>
      <div class="form-row" style="margin-top: 8px;">
        <div class="form-group">
          <label>Monthly Budget</label>
          <input type="number" id="input-monthly-budget" min="0" value="${budget.monthlyBudget}">
        </div>
        <div class="form-group">
          <label>Currency</label>
          <input type="text" id="input-currency" value="${budget.currency}" maxlength="5" autocomplete="off">
        </div>
        <div class="form-group" style="display:flex; align-items:flex-end;">
          <button type="button" id="btn-save-budget-settings" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  `;

  // Budget settings save handler
  const budgetSaveBtn = document.getElementById('btn-save-budget-settings');
  if (budgetSaveBtn) {
    budgetSaveBtn.addEventListener('click', () => {
      const newMonthly = parseFloat(document.getElementById('input-monthly-budget').value) || 0;
      const newCurrency = document.getElementById('input-currency').value.trim() || 'RM';
      const b = getBudget();
      b.monthlyBudget = newMonthly;
      b.currency = newCurrency;
      saveBudget(b);
      renderBudget();
      showToast('Budget settings saved! 💰');
    });
  }

  // Expenses list
  const expensesEl = document.getElementById('budget-expenses');
  const monthExpenses = getCurrentMonthExpenses().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const allExpenses = (budget.expenses || []).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (allExpenses.length === 0) {
    expensesEl.innerHTML = `
      <h3>Recent Expenses</h3>
      <div class="empty-state"><p>No expenses recorded yet.</p></div>
    `;
  } else {
    expensesEl.innerHTML = `
      <h3>Recent Expenses</h3>
      <table style="width:100%; border-collapse:collapse; margin-top: 10px;">
        <thead>
          <tr style="text-align:left; border-bottom: 2px solid #e8d5e0;">
            <th style="padding: 8px;">Date</th>
            <th style="padding: 8px;">Description</th>
            <th style="padding: 8px;">Category</th>
            <th style="padding: 8px; text-align:right;">Amount</th>
            <th style="padding: 8px; width: 40px;"></th>
          </tr>
        </thead>
        <tbody>
          ${allExpenses.slice(0, 20).map(e => `
            <tr style="border-bottom: 1px solid #f0e0e8;">
              <td style="padding: 8px; color:#666;">${formatDate(e.date)}</td>
              <td style="padding: 8px;">${escapeHTML(e.description || '—')}</td>
              <td style="padding: 8px;"><span class="badge">${e.category || 'other'}</span></td>
              <td style="padding: 8px; text-align:right; font-weight:600;">${formatCurrency(e.amount)}</td>
              <td style="padding: 8px;"><button class="btn btn-sm btn-danger" data-delete-expense="${e.id}" title="Delete">×</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
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
    <div class="form-group">
      <label>Description</label>
      <input type="text" id="modal-expense-desc" placeholder="e.g. Sushi dinner" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="modal-expense-amount" min="0" step="0.01" placeholder="0">
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="modal-expense-category">
          <option value="food">🍽️ Food</option>
          <option value="entertainment">🎬 Entertainment</option>
          <option value="gift">🎁 Gift</option>
          <option value="transport">🚗 Transport</option>
          <option value="other">💫 Other</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Date</label>
      <input type="date" id="modal-expense-date" value="${todayStr()}">
    </div>
  `;

  openModal('💰 Add Expense', html, () => {
    const description = document.getElementById('modal-expense-desc').value.trim();
    const amount = parseFloat(document.getElementById('modal-expense-amount').value);
    const category = document.getElementById('modal-expense-category').value;
    const date = document.getElementById('modal-expense-date').value;

    if (!description) { showToast('Please enter a description', 'error'); return; }
    if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
    if (!date) { showToast('Please select a date', 'error'); return; }

    addExpense({
      id: generateId('e'),
      date,
      description,
      amount,
      category
    });

    closeModal();
    renderBudget();
    showToast('Expense added! 🧾');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Gift Ideas
// ══════════════════════════════════════════════════════════════════════════════

function renderGifts() {
  const gifts = getGifts();
  const remaining = getRemainingBudget();

  // AI suggestions
  const aiEl = document.getElementById('gifts-ai');
  // Determine upcoming occasion from reminders
  const upcoming = getUpcomingReminders();
  let nextOccasion = 'random';
  const nextReminder = upcoming.find(r => r._daysUntil >= 0 && r._daysUntil <= 30 && ['anniversary', 'birthday'].includes(r.type));
  if (nextReminder) nextOccasion = nextReminder.type;

  const aiGifts = getAIGiftSuggestions(nextOccasion, remaining > 0 ? remaining : 100);

  aiEl.innerHTML = `
    <h3>AI Suggested Gifts 🤖</h3>
    ${nextReminder ? `<p style="color:#666; margin-bottom:10px;">Based on upcoming <strong>${nextReminder.title}</strong> (${nextReminder._daysUntil} days away)</p>` : '<p style="color:#666; margin-bottom:10px;">Suggestions based on her profile and your budget</p>'}
    ${aiGifts.length === 0 ? '<p style="color:#999;">No matching suggestions found. Try updating her profile or adjusting your budget.</p>' : ''}
    <div class="grid-3 gap-sm">
      ${aiGifts.map(g => `
        <div class="card" style="border: 1px solid #fce4ec; padding: 12px;">
          <strong>${escapeHTML(g.name)}</strong>
          <div style="margin: 6px 0;">
            ${g.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join(' ')}
          </div>
          <span style="font-weight:600; color:#e91e63;">${formatCurrency(g.cost)}</span>
        </div>
      `).join('')}
    </div>
  `;

  // User gift list
  const listEl = document.getElementById('gifts-list');
  if (gifts.length === 0) {
    listEl.innerHTML = `
      <h3>Your Gift List</h3>
      <div class="empty-state"><p>No gifts tracked yet. Add a gift idea to get started!</p></div>
    `;
  } else {
    listEl.innerHTML = `
      <h3>Your Gift List</h3>
      <div class="grid-3 gap-sm" style="margin-top: 10px;">
        ${gifts.map(g => `
          <div class="card" style="border: 1px solid ${g.given ? '#e8f5e9' : '#fce4ec'}; padding: 14px; position:relative; ${g.given ? 'opacity: 0.75;' : ''}">
            ${g.given ? '<span style="position:absolute; top:8px; right:8px; font-size:1.2rem;">✅</span>' : ''}
            <strong>${escapeHTML(g.name)}</strong>
            <div style="margin: 6px 0;">
              <span class="badge">${g.occasion || 'random'}</span>
              <span style="font-weight:600; color:#e91e63; margin-left: 6px;">${formatCurrency(g.budget || 0)}</span>
            </div>
            ${g.date ? `<small style="color:#666; display:block;">${formatDate(g.date)}</small>` : ''}
            ${g.notes ? `<small style="color:#888; display:block; margin-top: 4px;">${escapeHTML(g.notes)}</small>` : ''}
            <div class="flex gap-sm" style="margin-top: 8px;">
              <button class="btn btn-sm ${g.given ? 'btn-secondary' : 'btn-primary'}" data-toggle-gift="${g.id}">${g.given ? 'Mark Ungiven' : 'Mark Given ✓'}</button>
              <button class="btn btn-sm btn-danger" data-delete-gift="${g.id}">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    listEl.querySelectorAll('[data-toggle-gift]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleGiftGiven(btn.dataset.toggleGift);
        renderGifts();
      });
    });

    listEl.querySelectorAll('[data-delete-gift]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this gift?')) {
          deleteGift(btn.dataset.deleteGift);
          renderGifts();
          showToast('Gift deleted');
        }
      });
    });
  }
}

function openGiftModal() {
  const html = `
    <div class="form-group">
      <label>Gift Name</label>
      <input type="text" id="modal-gift-name" placeholder="e.g. Matcha dessert box" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Occasion</label>
        <select id="modal-gift-occasion">
          <option value="birthday">🎂 Birthday</option>
          <option value="anniversary">💑 Anniversary</option>
          <option value="random" selected>🎲 Random / Just Because</option>
          <option value="comfort">🫂 Comfort</option>
          <option value="holiday">🎄 Holiday</option>
        </select>
      </div>
      <div class="form-group">
        <label>Budget</label>
        <input type="number" id="modal-gift-budget" min="0" placeholder="0">
      </div>
    </div>
    <div class="form-group">
      <label>Target Date</label>
      <input type="date" id="modal-gift-date">
    </div>
    <div class="form-group">
      <label>Notes</label>
      <textarea id="modal-gift-notes" rows="2" placeholder="Where to buy, her size, etc."></textarea>
    </div>
  `;

  openModal('🎁 Add Gift Idea', html, () => {
    const name = document.getElementById('modal-gift-name').value.trim();
    const occasion = document.getElementById('modal-gift-occasion').value;
    const budget = parseFloat(document.getElementById('modal-gift-budget').value) || 0;
    const date = document.getElementById('modal-gift-date').value;
    const notes = document.getElementById('modal-gift-notes').value.trim();

    if (!name) { showToast('Please enter a gift name', 'error'); return; }

    addGift({
      id: generateId('g'),
      name,
      occasion,
      budget,
      given: false,
      date,
      notes
    });

    closeModal();
    renderGifts();
    showToast('Gift idea added! 🎁');
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Surprise Generator
// ══════════════════════════════════════════════════════════════════════════════

function renderSurprises() {
  // Output area might already have content; that's fine — generate button is static in HTML
  // We only need to set up the event handler
  const btn = document.getElementById('btn-generate-surprise');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => {
    const surprise = generateSurprise();
    const outputEl = document.getElementById('surprises-output');
    outputEl.innerHTML = `
      <div class="card" style="border: 2px solid #e91e63; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #e91e63, #9c27b0, #e91e63);"></div>
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 2rem;">✨</span>
          <h3 style="margin: 4px 0; color: #e91e63;">${escapeHTML(surprise.theme)}</h3>
          <small style="color: #666;">Estimated cost: <strong>${formatCurrency(surprise.estimatedCost)}</strong></small>
        </div>
        <div style="margin-top: 16px;">
          ${surprise.steps.map((step, i) => `
            <div class="flex gap-md" style="padding: 14px; margin: 8px 0; background: #f8f0f4; border-radius: 10px; align-items: center;">
              <span style="font-size: 1.5rem; min-width: 40px; text-align: center;">${step.icon}</span>
              <div>
                <small style="color: #e91e63; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Step ${i + 1} — ${step.type}</small>
                <p style="margin: 4px 0 0; font-size: 1rem;">${escapeHTML(step.text)}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="text-center" style="margin-top: 20px;">
          <button class="btn btn-primary" id="btn-regenerate-surprise">🎲 Regenerate</button>
        </div>
      </div>
    `;

    document.getElementById('btn-regenerate-surprise').addEventListener('click', () => {
      renderSurprises();
      // Trigger a click on the generate button
      document.getElementById('btn-generate-surprise').click();
    });
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// Reminders
// ══════════════════════════════════════════════════════════════════════════════

function renderReminders() {
  const allReminders = getUpcomingReminders();
  const upcoming = allReminders.filter(r => r._daysUntil >= 0 && r._daysUntil <= 30);
  const overdue = allReminders.filter(r => r._daysUntil < 0);

  // Upcoming section
  const upcomingEl = document.getElementById('reminders-upcoming');
  const upcomingAndOverdue = [...overdue, ...upcoming];

  if (upcomingAndOverdue.length === 0) {
    upcomingEl.innerHTML = `
      <h3>Upcoming</h3>
      <div class="empty-state"><p>No upcoming reminders in the next 30 days.</p></div>
    `;
  } else {
    upcomingEl.innerHTML = `
      <h3>Upcoming</h3>
      ${upcomingAndOverdue.map(r => {
        const icon = REMINDER_ICONS[r.type] || '📌';
        const isOverdue = r._daysUntil < 0;
        const daysText = r._daysUntil === 0 ? '🔴 Today!'
          : isOverdue ? `🔴 ${Math.abs(r._daysUntil)} days overdue`
          : r._daysUntil === 1 ? '🟡 Tomorrow'
          : `In ${r._daysUntil} days`;
        return `
          <div class="flex gap-sm" style="padding: 12px 0; border-bottom: 1px solid #f0e0e8; align-items: center; ${isOverdue ? 'background: #fff5f5; margin: 0 -16px; padding-left: 16px; padding-right: 16px; border-radius: 8px;' : ''}">
            <span style="font-size: 1.5rem;">${icon}</span>
            <div style="flex:1;">
              <strong>${escapeHTML(r.title)}</strong>
              ${r.recurring && r.recurring !== 'none' ? `<span class="badge" style="margin-left: 6px; font-size: 0.7rem;">🔁 ${r.recurring}</span>` : ''}
              ${r.notes ? `<small style="display:block; color:#888; margin-top: 2px;">${escapeHTML(r.notes)}</small>` : ''}
            </div>
            <span style="font-size: 0.85rem; font-weight: ${isOverdue || r._daysUntil <= 3 ? '700' : '400'}; color: ${isOverdue ? '#f44336' : r._daysUntil <= 3 ? '#ff9800' : '#666'};">${daysText}</span>
          </div>
        `;
      }).join('')}
    `;
  }

  // All reminders
  const allEl = document.getElementById('reminders-list');
  const allRems = getReminders();
  if (allRems.length === 0) {
    allEl.innerHTML = `
      <h3>All Reminders</h3>
      <div class="empty-state"><p>No reminders yet. Add one to never miss an important moment!</p></div>
    `;
  } else {
    allEl.innerHTML = `
      <h3>All Reminders</h3>
      ${allRems.map(r => {
        const icon = REMINDER_ICONS[r.type] || '📌';
        return `
          <div class="flex gap-sm" style="padding: 10px 0; border-bottom: 1px solid #f0e0e8; align-items: center;">
            <span style="font-size: 1.3rem;">${icon}</span>
            <div style="flex:1;">
              <strong>${escapeHTML(r.title)}</strong>
              <small style="display:block; color:#666;">${formatDate(r.date)} ${r.recurring && r.recurring !== 'none' ? `· 🔁 ${r.recurring}` : ''}</small>
              ${r.notes ? `<small style="display:block; color:#888;">${escapeHTML(r.notes)}</small>` : ''}
            </div>
            <button class="btn btn-sm btn-danger" data-delete-reminder="${r.id}" title="Delete">🗑️</button>
          </div>
        `;
      }).join('')}
    `;

    allEl.querySelectorAll('[data-delete-reminder]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this reminder?')) {
          deleteReminder(btn.dataset.deleteReminder);
          renderReminders();
          showToast('Reminder deleted');
        }
      });
    });
  }
}

function openReminderModal() {
  const html = `
    <div class="form-group">
      <label>Title</label>
      <input type="text" id="modal-reminder-title" placeholder="e.g. Anniversary" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="modal-reminder-date" value="${todayStr()}">
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="modal-reminder-type">
          <option value="anniversary">💑 Anniversary</option>
          <option value="birthday">🎂 Birthday</option>
          <option value="checkin">💬 Check-in</option>
          <option value="comfort">🫂 Comfort</option>
          <option value="surprise">🎉 Surprise</option>
          <option value="custom">📌 Custom</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Recurring</label>
      <select id="modal-reminder-recurring">
        <option value="none">None</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>
    <div class="form-group">
      <label>Notes</label>
      <textarea id="modal-reminder-notes" rows="2" placeholder="Plan something special..."></textarea>
    </div>
  `;

  openModal('🔔 Add Reminder', html, () => {
    const title = document.getElementById('modal-reminder-title').value.trim();
    const date = document.getElementById('modal-reminder-date').value;
    const type = document.getElementById('modal-reminder-type').value;
    const recurring = document.getElementById('modal-reminder-recurring').value;
    const notes = document.getElementById('modal-reminder-notes').value.trim();

    if (!title) { showToast('Please enter a title', 'error'); return; }
    if (!date) { showToast('Please select a date', 'error'); return; }

    addReminder({
      id: generateId('r'),
      title,
      date,
      type,
      recurring,
      notes
    });

    closeModal();
    renderReminders();
    showToast('Reminder added! 🔔');
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: EVENT HANDLERS (attached in init)
// ─────────────────────────────────────────────────────────────────────────────

function setupGlobalEventHandlers() {
  // Date log — add date button
  document.getElementById('btn-add-date').addEventListener('click', () => openDateModal());

  // Suggestions — refresh
  document.getElementById('btn-refresh-suggestions').addEventListener('click', () => renderSuggestions());

  // Budget — add expense
  document.getElementById('btn-add-expense').addEventListener('click', () => openExpenseModal());

  // Gifts — add gift
  document.getElementById('btn-add-gift').addEventListener('click', () => openGiftModal());

  // Reminders — add reminder
  document.getElementById('btn-add-reminder').addEventListener('click', () => openReminderModal());
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Setup navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Setup modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Setup all global event handlers
  setupGlobalEventHandlers();

  // Render initial view
  updateSidebarName();
  renderDashboard();
});

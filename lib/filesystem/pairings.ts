export interface Style {
  grape: string;
  aliases: string[];
  why: string;
  everyday: string;
  splurge: string;
  quip: string;
}

export const STYLES: Record<string, Style> = {
  cabernet: {
    grape: 'Cabernet Sauvignon',
    aliases: ['cab', 'cabernet', 'bordeaux', 'napa'],
    why: 'Firm tannin binds to fat and protein, so a rich cut tastes cleaner and the wine tastes softer.',
    everyday: 'Louis M. Martini Sonoma County Cabernet Sauvignon',
    splurge: 'Ridge Monte Bello',
    quip: 'Structured, strongly typed, ages well.',
  },
  nebbiolo: {
    grape: 'Nebbiolo',
    aliases: ['nebbiolo', 'barolo', 'barbaresco'],
    why: 'High acid and grippy tannin cut through braises and butter; its tar-and-roses aromatics echo mushrooms and truffle.',
    everyday: 'Produttori del Barbaresco Langhe Nebbiolo',
    splurge: 'Produttori del Barbaresco Barbaresco',
    quip: 'Needs time to open up, like a big legacy codebase.',
  },
  pinot: {
    grape: 'Pinot Noir',
    aliases: ['pinot', 'pinot noir', 'burgundy', 'red burgundy'],
    why: 'Light tannin and bright red fruit flatter delicate meat and fatty fish without overpowering them.',
    everyday: 'Louis Jadot Bourgogne Pinot Noir',
    splurge: 'Joseph Drouhin Chambolle-Musigny',
    quip: 'Notoriously finicky to build. Worth it.',
  },
  sangiovese: {
    grape: 'Sangiovese',
    aliases: ['sangiovese', 'chianti', 'brunello'],
    why: 'Its acidity matches tomato sauce point for point, and the savory cherry note loves olive oil and hard cheese.',
    everyday: 'Fèlsina Chianti Classico',
    splurge: 'Fontodi Flaccianello della Pieve',
    quip: 'Pairs with red sauce the way tabs pair with Makefiles: mandatory.',
  },
  syrah: {
    grape: 'Syrah / Rhône blends',
    aliases: ['syrah', 'shiraz', 'rhone', 'grenache', 'cotes du rhone'],
    why: 'Pepper, smoke and dark fruit stand up to char, spice rubs and lamb.',
    everyday: 'E. Guigal Côtes du Rhône Rouge',
    splurge: 'E. Guigal Côte-Rôtie Brune et Blonde',
    quip: 'Handles heavy load without complaint.',
  },
  gamay: {
    grape: 'Gamay (Beaujolais)',
    aliases: ['gamay', 'beaujolais', 'morgon'],
    why: 'Juicy, low-tannin and great slightly chilled, so it gets along with a crowded table.',
    everyday: 'Georges Duboeuf Morgon',
    splurge: 'Jean Foillard Morgon Côte du Py',
    quip: 'The wine equivalent of a sensible default.',
  },
  riesling: {
    grape: 'Riesling (off-dry)',
    aliases: ['riesling', 'mosel', 'kabinett'],
    why: 'A touch of sweetness cools chili heat, and high acid keeps it from tasting sugary.',
    everyday: 'Dr. Loosen Dr. L Riesling',
    splurge: 'Egon Müller Scharzhofberger Kabinett',
    quip: 'Catches the exceptions spicy food throws.',
  },
  sauvignon: {
    grape: 'Sauvignon Blanc',
    aliases: ['sauvignon', 'sauvignon blanc', 'sancerre'],
    why: 'Zippy acid and green, herbal notes mirror salads, herbs and tangy goat cheese.',
    everyday: 'Henri Bourgeois Petit Bourgeois Sauvignon Blanc',
    splurge: 'Didier Dagueneau Pur Sang',
    quip: 'Crisp, lint-clean, no warnings.',
  },
  chardonnay: {
    grape: 'Chardonnay (white Burgundy)',
    aliases: ['chardonnay', 'chablis', 'white burgundy', 'meursault'],
    why: 'Texture and a little oak match butter and cream; the acid keeps rich dishes lively.',
    everyday: 'Louis Jadot Mâcon-Villages',
    splurge: 'Domaine Leflaive Puligny-Montrachet',
    quip: 'Rich without being bloated. Unlike node_modules.',
  },
  muscadet: {
    grape: 'Muscadet / Albariño',
    aliases: ['muscadet', 'albarino', 'albariño'],
    why: 'Saline, lean and citrusy: tastes like a squeeze of lemon over shellfish.',
    everyday: 'Domaine de la Pépière Muscadet Sèvre et Maine',
    splurge: 'Do Ferreiro Albariño Cepas Vellas',
    quip: 'Minimal dependencies.',
  },
  champagne: {
    grape: 'Champagne / sparkling',
    aliases: ['champagne', 'sparkling', 'cava', 'cremant', 'prosecco'],
    why: 'Bubbles and acid scrub salt and fat off your palate, which is why it works with almost anything.',
    everyday: 'Gruet Brut',
    splurge: 'Krug Grande Cuvée',
    quip: 'Also pairs with a successful production deploy.',
  },
  rose: {
    grape: 'Provence rosé',
    aliases: ['rose', 'rosé', 'provence'],
    why: 'Red-fruit flavor with white-wine freshness, so it bridges mixed plates and summer food.',
    everyday: 'Triennes Rosé',
    splurge: 'Domaine Tempier Bandol Rosé',
    quip: 'Ships in summer. Every summer.',
  },
  port: {
    grape: 'Port',
    aliases: ['port', 'tawny', 'dessert wine'],
    why: 'Wine should be at least as sweet as dessert, and port has the weight for chocolate and blue cheese.',
    everyday: "Graham's Six Grapes Reserve Port",
    splurge: 'Taylor Fladgate 20 Year Tawny',
    quip: 'Runs best after everything else has shipped.',
  },
};

export const FOODS: Record<string, { style: keyof typeof STYLES; keywords: string[] }> = {
  steak: { style: 'cabernet', keywords: ['steak', 'ribeye', 'beef', 'prime rib', 'brisket'] },
  burger: { style: 'syrah', keywords: ['burger', 'cheeseburger'] },
  bbq: { style: 'syrah', keywords: ['bbq', 'barbecue', 'ribs', 'grilled', 'smoked'] },
  lamb: { style: 'syrah', keywords: ['lamb'] },
  braise: { style: 'nebbiolo', keywords: ['braise', 'braised', 'short rib', 'osso buco', 'stew', 'ragu'] },
  mushrooms: { style: 'nebbiolo', keywords: ['mushroom', 'truffle', 'risotto'] },
  duck: { style: 'pinot', keywords: ['duck'] },
  salmon: { style: 'pinot', keywords: ['salmon', 'tuna'] },
  chicken: { style: 'chardonnay', keywords: ['chicken', 'roast chicken'] },
  turkey: { style: 'gamay', keywords: ['turkey', 'thanksgiving'] },
  charcuterie: { style: 'gamay', keywords: ['charcuterie', 'salami', 'prosciutto', 'ham'] },
  pork: { style: 'gamay', keywords: ['pork', 'pork chop', 'sausage'] },
  pizza: { style: 'sangiovese', keywords: ['pizza'] },
  pasta: { style: 'sangiovese', keywords: ['pasta', 'spaghetti', 'lasagna', 'marinara', 'tomato'] },
  lobster: { style: 'chardonnay', keywords: ['lobster', 'crab', 'scallop'] },
  cream: { style: 'chardonnay', keywords: ['alfredo', 'cream', 'carbonara', 'mac and cheese'] },
  oysters: { style: 'muscadet', keywords: ['oyster', 'clam', 'mussel', 'shellfish', 'shrimp'] },
  fish: { style: 'muscadet', keywords: ['fish', 'cod', 'halibut', 'sea bass', 'ceviche', 'fish tacos'] },
  sushi: { style: 'champagne', keywords: ['sushi', 'sashimi'] },
  fried: { style: 'champagne', keywords: ['fried', 'fries', 'fried chicken', 'tempura', 'chips', 'popcorn'] },
  caviar: { style: 'champagne', keywords: ['caviar'] },
  thai: { style: 'riesling', keywords: ['thai', 'curry', 'pad thai'] },
  indian: { style: 'riesling', keywords: ['indian', 'tikka', 'vindaloo'] },
  chinese: { style: 'riesling', keywords: ['chinese', 'sichuan', 'szechuan', 'dumpling', 'takeout'] },
  spicy: { style: 'riesling', keywords: ['spicy', 'hot', 'chili', 'kimchi'] },
  tacos: { style: 'rose', keywords: ['taco', 'tacos', 'mexican', 'burrito'] },
  salad: { style: 'sauvignon', keywords: ['salad', 'greens', 'vegetables', 'asparagus'] },
  goat_cheese: { style: 'sauvignon', keywords: ['goat cheese', 'chevre'] },
  mezze: { style: 'rose', keywords: ['mezze', 'hummus', 'falafel', 'mediterranean', 'picnic'] },
  chocolate: { style: 'port', keywords: ['chocolate', 'dessert', 'cake', 'brownie'] },
  blue_cheese: { style: 'port', keywords: ['blue cheese', 'stilton', 'gorgonzola'] },
  cheese: { style: 'champagne', keywords: ['cheese', 'cheese board'] },
};

export type PairingMatch =
  | { kind: 'food'; food: string; style: Style; exact: boolean }
  | { kind: 'grape'; style: Style; foods: string[] }
  | { kind: 'fallback'; style: Style };

export function findPairing(query: string): PairingMatch {
  const q = query.toLowerCase().trim().replace(/_/g, ' ');
  const exact = FOODS[q.replace(/ /g, '_')];
  if (exact) return { kind: 'food', food: q, style: STYLES[exact.style], exact: true };

  const grapeKey = Object.keys(STYLES).find(k => STYLES[k].aliases.includes(q));
  if (grapeKey) {
    const foods = Object.keys(FOODS)
      .filter(f => FOODS[f].style === grapeKey)
      .map(f => f.replace(/_/g, ' '));
    return { kind: 'grape', style: STYLES[grapeKey], foods };
  }

  let best: { food: string; length: number } | null = null;
  for (const [food, { keywords }] of Object.entries(FOODS)) {
    for (const kw of keywords) {
      if (new RegExp(`\\b${kw}`).test(q) && (!best || kw.length > best.length)) {
        best = { food, length: kw.length };
      }
    }
  }
  if (best) return { kind: 'food', food: q, style: STYLES[FOODS[best.food].style], exact: false };

  return { kind: 'fallback', style: STYLES.champagne };
}

export function pairingFoods(): string[] {
  return Object.keys(FOODS).map(f => f.replace(/_/g, ' '));
}

export function isPairKey(query: string): boolean {
  const q = query.toLowerCase().trim();
  return q.replace(/ /g, '_') in FOODS || Object.values(STYLES).some(s => s.aliases.includes(q));
}

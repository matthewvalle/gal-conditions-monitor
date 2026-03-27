import type { VercelRequest, VercelResponse } from '@vercel/node';

// Same MVP zones as the /api/zones endpoint
const mvpZones = [
  { id: 'tuckerman-ravine', name: 'Tuckerman Ravine', lat: 44.2596, lon: -71.2973, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 2.4, isMvp: true },
  { id: 'huntington-ravine', name: 'Huntington Ravine', lat: 44.2680, lon: -71.2935, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E', approachMiles: 2.5, isMvp: true },
  { id: 'gulf-of-slides', name: 'Gulf of Slides', lat: 44.2495, lon: -71.2890, elevation: 3800, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E/SE', approachMiles: 2.8, isMvp: true },
  { id: 'great-gulf', name: 'Great Gulf', lat: 44.2795, lon: -71.3050, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'NE', approachMiles: 3.5, isMvp: true },
  { id: 'oakes-gulf', name: 'Oakes Gulf', lat: 44.2470, lon: -71.3130, elevation: 4300, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 4.0, isMvp: true },
  { id: 'burt-ammonoosuc-ravines', name: 'Burt and Ammonoosuc Ravines', lat: 44.2720, lon: -71.3310, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'W/SW', approachMiles: 3.2, isMvp: true },
  { id: 'sherburne-ski-trail', name: 'Sherburne Ski Trail', lat: 44.2570, lon: -71.2530, elevation: 2400, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 0, isMvp: true },
  { id: 'pinkham-notch', name: 'Pinkham Notch', lat: 44.2573, lon: -71.2530, elevation: 2032, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: '', approachMiles: 0, isMvp: true },
];

const ZONE_INFO: Record<string, any> = {
  'tuckerman-ravine': {
    overview: 'The most famous backcountry ski zone in the Eastern US -- a southeast-facing glacial cirque on Mt. Washington with pitches ranging from 35 to 55 degrees across multiple named lines. Spring corn skiing from April through June draws thousands, but winter conditions demand serious avalanche skills. Multiple runs span the bowl from the moderate Lip to the steep Center Headwall, offering options from advanced to expert-only terrain.',
    stats: {
      verticalDrop: '800 ft (headwall) / 1,850 ft (ravine floor to Pinkham Notch)',
      maxPitch: '55 degrees (Center Headwall up to 60 degrees)',
      difficulty: 'advanced-expert',
      bestMonths: ['March', 'April', 'May', 'June'],
      approachTime: '1.5-2.5 hours from Pinkham Notch (2.4 miles via Tuckerman Ravine Trail)',
      baseElevation: 3950,
      topElevation: 5200,
      aspect: 'SE',
    },
    sources: [
      { title: 'USFS White Mountain National Forest - Tuckerman Ravine Trail', url: 'https://www.fs.usda.gov/recarea/whitemountain/recarea?recid=78538', description: 'Official USDA Forest Service page for the Tuckerman Ravine Trail with access info, regulations, and seasonal conditions.' },
      { title: 'Mount Washington Avalanche Center - Forecasts', url: 'https://www.mountwashingtonavalanchecenter.org/forecasts/', description: 'Daily avalanche advisories with zone-specific danger ratings for Tuckerman Ravine gullies, updated by USFS Snow Rangers.' },
      { title: 'Friends of Tuckerman Ravine', url: 'https://www.friendsoftuckermanravine.org/', description: 'Nonprofit partner of the USFS focused on trail maintenance, volunteer crews, and preservation of the Tuckerman/Sherburne/Gulf of Slides trail network.' },
      { title: 'AMC - The Bold History of Skiing at Tuckerman Ravine', url: 'https://www.outdoors.org/resources/amc-outdoors/history/the-bold-history-of-skiing-at-tuckerman-ravine/', description: 'Appalachian Mountain Club deep-dive on Tuckerman\'s ski history from the 1930s CCC era through the modern backcountry revival.' },
      { title: 'Teton Gravity Research - How to Ski Tuckerman Ravine', url: 'https://www.tetongravity.com/story/ski/bucket-list-how-to-ski-tuckermans-ravine', description: 'Practical bucket-list guide covering logistics, line descriptions, gear recommendations, and timing for a Tuckerman trip.' },
    ],
  },
  'huntington-ravine': {
    overview: 'East-facing and significantly steeper than neighboring Tuckerman, Huntington Ravine is a rocky alpine amphitheater with named couloirs ranging from 40 to 50+ degrees. Better known for winter ice climbing, it has seen a surge in ski traffic in recent years as skilled mountaineers seek out lines like Central Gully and Diagonal Gully. Conditions are highly variable -- expect ice bulges, wind-loaded slabs, and mandatory exposure to consequential terrain.',
    stats: {
      verticalDrop: '1,100 ft (Diagonal Gully)',
      maxPitch: '50+ degrees (Central Gully 40-50 degrees, Diagonal Gully ~45 degrees avg)',
      difficulty: 'expert',
      bestMonths: ['March', 'April', 'May'],
      approachTime: '2-3 hours from Pinkham Notch (2.5 miles via Tuckerman Ravine Trail to Huntington Ravine Trail junction)',
      baseElevation: 3400,
      topElevation: 5200,
      aspect: 'E',
    },
    sources: [
      { title: 'Mount Washington Avalanche Center - Forecast Elevation Zones', url: 'https://www.mountwashingtonavalanchecenter.org/forecast-elevation-zones/', description: 'MWAC zone breakdown including Huntington Ravine gullies with elevation bands and avalanche problem descriptions.' },
      { title: 'Cody Bradford / Ski The Fifty - Huntington Ravine', url: 'https://skithefifty.com/huntington-ravine', description: 'Huntington Ravine profile from the Fifty Project -- ski mountaineering descent details, conditions notes, and line descriptions.' },
      { title: 'Skimo.co - Huntington Ravine Central Gully', url: 'https://skimo.co/huntington-ravine-central-gully', description: 'Route description for Central Gully with approach info, pitch angles, snow conditions, and topo overview.' },
      { title: 'Northeast Alpine Start - Trip Reports (Huntington Ravine)', url: 'https://northeastalpinestart.com/tag/mount-washington-avalanche/', description: 'Curated trip reports and avalanche incident analyses from Huntington Ravine and surrounding Presidential Range terrain.' },
    ],
  },
  'gulf-of-slides': {
    overview: 'A collection of avalanche paths descending from Boott Spur on the southeast side of Mt. Washington, offering more moderate terrain than Tuckerman with wide-open snowfields averaging around 30 degrees. Far less crowded than its famous neighbor, the Gulf of Slides rewards the extra approach distance with solitude and consistent fall-line skiing. The south snowfields are the primary draw, with a brief steeper pitch near the top.',
    stats: {
      verticalDrop: '2,000-2,500 ft (full descent to Pinkham Notch)',
      maxPitch: '35 degrees (brief steeper sections near top)',
      difficulty: 'intermediate-advanced',
      bestMonths: ['March', 'April', 'May'],
      approachTime: '2.5-3.5 hours from Pinkham Notch (2.6 miles via Gulf of Slides Trail)',
      baseElevation: 2050,
      topElevation: 4600,
      aspect: 'E/SE',
    },
    sources: [
      { title: 'NH Magazine - What It\'s Like To Ski Mount Washington\'s Gulf of Slides', url: 'https://www.nhmagazine.com/skiing-mount-washingtons-gulf-of-slides/', description: 'In-depth feature on the Gulf of Slides experience with terrain description, approach logistics, and comparison to Tuckerman.' },
      { title: 'Granite Backcountry Alliance - Sherburne / Gulf of Slides Trail Work', url: 'https://granitebackcountryalliance.org/sherburne-gulf-of-slides-trail-work', description: 'GBA trail maintenance updates for the Sherburne and Gulf of Slides ski trails with current conditions and volunteer info.' },
      { title: 'Mount Washington Avalanche Center - MWAC Forecast Area', url: 'https://www.mountwashingtonavalanchecenter.org/mwac-forecast-area/', description: 'Map and description of MWAC\'s full forecast coverage area including Gulf of Slides avalanche paths.' },
      { title: 'AMC NH Chapter - Catching the Bluebird in the Gulf of Slides', url: 'https://amcnh.org/catching-the-bluebird-in-the-gulf-of-slides-by-ham-mehlman/', description: 'First-person AMC trip report with practical approach info, snow conditions, and route-finding notes for Gulf of Slides.' },
    ],
  },
  'great-gulf': {
    overview: 'The largest glacial cirque in the White Mountains, Great Gulf is a federally designated Wilderness area on the northeast side of Mt. Washington. Its remote headwall gains 1,600 feet in half a mile with serious avalanche exposure. The long approach through boulder-strewn old-growth forest filters out casual visitors -- this is committed ski mountaineering terrain best suited for spring conditions when snow softens and days lengthen.',
    stats: {
      verticalDrop: '1,600 ft (headwall) / 5,000 ft total (summit to trailhead)',
      maxPitch: '40-50 degrees on the headwall',
      difficulty: 'expert',
      bestMonths: ['April', 'May'],
      approachTime: '4-6 hours from Great Gulf Trailhead (6.5 miles via Great Gulf Trail) or alternate approach from Pinkham Notch',
      baseElevation: 1350,
      topElevation: 6288,
      aspect: 'NE',
    },
    sources: [
      { title: 'Mount Washington Observatory - Great Gulf Skiing', url: 'https://mountwashington.org/great-gulf-skiing/', description: 'Observatory overview of Great Gulf as a ski objective with conditions context and approach considerations.' },
      { title: 'Backcountry Magazine - Mt. Washington\'s Great White North', url: 'https://backcountrymagazine.com/stories/mt-washingtons-great-white-north/', description: 'Feature piece on skiing the north-facing zones of Mt. Washington including Great Gulf headwall terrain and access.' },
      { title: 'SectionHiker - Climbing the Mt Washington Headwall and the Great Gulf Trail', url: 'https://sectionhiker.com/climbing-the-mt-washington-headwall-and-the-great-gulf-trail/', description: 'Detailed trail guide covering the full Great Gulf approach with headwall description, mileage, and elevation profile.' },
      { title: 'SummitPost - Great Gulf Trail', url: 'https://www.summitpost.org/great-gulf-trail/533010', description: 'Mountaineering-focused route description with elevation data, wilderness regulations, and seasonal access notes.' },
    ],
  },
  'oakes-gulf': {
    overview: 'A southeast-facing glacial cirque between Mt. Washington and Mt. Monroe, similar in scale to Tuckerman but far more remote and harder to access. Oakes Gulf is serious avalanche terrain -- windslabs build rapidly on the exposed upper bowl, and multiple fatal and near-fatal incidents have occurred here. The reward is steep, untracked alpine skiing in a dramatic setting with virtually no crowds. Approach typically comes over the Monroe-Washington saddle via Lakes of the Clouds.',
    stats: {
      verticalDrop: '1,500-2,000 ft (upper bowl)',
      maxPitch: '40+ degrees',
      difficulty: 'expert',
      bestMonths: ['April', 'May'],
      approachTime: '4-5 hours via Ammonoosuc Ravine Trail to Lakes of the Clouds, then traverse to the gulf rim',
      baseElevation: 3200,
      topElevation: 5200,
      aspect: 'SE',
    },
    sources: [
      { title: 'Backcountry Magazine - How a spring day on Mt. Washington proves sometimes danger comes from above', url: 'https://backcountrymagazine.com/stories/how-a-spring-day-on-mt-washington-proves-sometimes-danger-comes-from-above-not-below/', description: 'Analysis of a fatal avalanche cycle on Mt. Washington that impacted Oakes Gulf, with lessons on wind slab and terrain traps.' },
      { title: 'Northeast Alpine Start - Caught and Partially Buried in Oakes Gulf Avalanche (4/11/19)', url: 'https://northeastalpinestart.com/2019/04/12/caught-and-partially-buried-in-oakes-gulf-avalanche-4-11-19/', description: 'Detailed first-person avalanche incident report from experienced guides caught in Oakes Gulf -- critical reading for anyone considering this zone.' },
      { title: 'Chauvin Guides - Mount Washington Climbs and Ski Runs', url: 'https://www.chauvinguides.com/mount-washington-climbs-and-ski-runs/', description: 'Professional guide service overview of all Mt. Washington ski zones including Oakes Gulf approach options and terrain assessment.' },
      { title: 'SectionHiker - Oakes Gulf: A Hidden Gem in the Wilderness', url: 'https://sectionhiker.com/backpacking-white-mountain-4000-footers-guidebook/backpacking-an-oakes-gulf-loop/', description: 'Comprehensive terrain description of Oakes Gulf with loop route options, elevation profile, and seasonal access notes.' },
    ],
  },
  'burt-ammonoosuc-ravines': {
    overview: 'The west-side ravines of Mt. Washington flanking the Cog Railway -- Burt Ravine sits to the north (skier\'s left) and the larger Ammonoosuc Ravine to the south. These SW-facing aspects see far less traffic than the east-side zones and offer a completely different character: longer descents, more sun-protected snow, and approach via the Cog Railway bed or Ammonoosuc Ravine Trail. Best in spring when the west side consolidates. Expect bushwhacking on the lower exits.',
    stats: {
      verticalDrop: '3,200-3,600 ft (summit to Cog Railway base station)',
      maxPitch: '35-45 degrees in the upper ravine bowls',
      difficulty: 'advanced-expert',
      bestMonths: ['April', 'May'],
      approachTime: '3-4 hours via Cog Railway bed or Ammonoosuc Ravine Trail from Marshfield Base Station',
      baseElevation: 2700,
      topElevation: 6288,
      aspect: 'W/SW',
    },
    sources: [
      { title: 'Northeast Alpine Start - Trip Report: Burt Ravine (3/28/18)', url: 'https://northeastalpinestart.com/2018/03/28/trip-report-burt-ravine-3-28-18/', description: 'Detailed ski trip report with approach via the Cog, snow conditions, descent line description, and bushwhack exit notes.' },
      { title: 'KUHL - West Side Story: Hiking and Skiing the Ammonoosuc Ravine Trail', url: 'https://www.kuhl.com/borninthemountains/hiking-and-skiing-ammonoosuc-ravine-trail-mount-washington', description: 'Narrative account of skiing the Ammonoosuc Ravine Trail descent with approach logistics and terrain overview.' },
      { title: 'AMC NH Chapter - Skiing The Cog', url: 'https://amcnh.org/skiing-the-cog-it-may-not-be-backcountry-but-it-sure-is-fun-by-ham-mehlman/', description: 'AMC trip report covering the Cog Railway as a ski approach with descriptions of both Burt and Ammonoosuc Ravine access.' },
      { title: 'The Snow Way - Mount Washington Ammonoosuc Ravine & East Snowfields', url: 'https://www.thesnowway.com/2010/04/02/mount-washington-ammonoosuc-ravine-and-the-east-snowfields', description: 'Trip report combining Ammonoosuc descent with east-side skiing, useful for understanding the west-side terrain character.' },
    ],
  },
  'sherburne-ski-trail': {
    overview: 'The classic 2.4-mile descent from Tuckerman Ravine back to Pinkham Notch, originally cut by the Civilian Conservation Corps in the 1930s. The \'Sherbie\' drops nearly 1,900 vertical feet through a narrow, winding trail averaging about 20 feet wide with a consistent fall-line grade around 22%. It serves as the return route for virtually every east-side ski tour and is arguably the most-traveled backcountry trail in the Northeast. Conditions range from bulletproof ice to spring slush depending on the day.',
    stats: {
      verticalDrop: '1,918 ft',
      maxPitch: '22% average grade (~12 degrees), steeper sections up to 25 degrees',
      difficulty: 'intermediate',
      bestMonths: ['February', 'March', 'April', 'May'],
      approachTime: 'N/A (descent trail -- typically skied top-to-bottom after touring Tuckerman, Huntington, or Gulf of Slides)',
      baseElevation: 2032,
      topElevation: 3950,
      aspect: 'Various (follows drainage)',
    },
    sources: [
      { title: 'Granite Backcountry Alliance - Historic CCC Trails', url: 'https://granitebackcountryalliance.org/ccctrails', description: 'GBA overview of CCC-era ski trails in the White Mountains including the Sherburne trail\'s construction history and current maintenance status.' },
      { title: 'Friends of Tuckerman Ravine - Trail Crew Volunteers', url: 'https://www.friendsoftuckermanravine.org/trail_crew_volunteers', description: 'FOTR volunteer trail crew program focused on maintaining the Sherburne and Gulf of Slides ski trails -- includes work schedules and trail condition updates.' },
      { title: 'Powder Project - Sherburne Ski Trail', url: 'https://www.powderproject.com/trail/7000253/sherburne-ski-trail', description: 'Route page with elevation profile, vertical drop stats, trail description, and user trip reports for the Sherburne descent.' },
      { title: 'Trailforks - John Sherburne Ski Trail', url: 'https://www.trailforks.com/trails/john-sherburne-ski-trail-615041331/', description: 'Interactive trail map with GPS track, elevation data, and current user-submitted conditions reports.' },
    ],
  },
  'pinkham-notch': {
    overview: 'The primary basecamp and trailhead for all east-side Presidential Range ski tours. The AMC Pinkham Notch Visitor Center sits at 2,032 feet on Route 16 and provides parking, lodging at Joe Dodge Lodge, gear sales, trail information, and MWAC avalanche advisory postings. This is where every Tuckerman, Huntington, Gulf of Slides, and Sherburne tour begins and ends. Parking fills early on spring weekends -- arrive before 7 AM or plan for overflow lots.',
    stats: {
      verticalDrop: 'N/A (base area)',
      maxPitch: 'N/A',
      difficulty: 'beginner (base area and short nature trails)',
      bestMonths: ['Year-round (ski staging: February through June)'],
      approachTime: 'N/A (this IS the starting point)',
      baseElevation: 2032,
      topElevation: 2032,
      aspect: 'N/A',
    },
    sources: [
      { title: 'USFS White Mountain National Forest - Pinkham Notch Trailhead', url: 'https://www.fs.usda.gov/r09/whitemountain/recreation/pinkham-notch-trailhead', description: 'Official Forest Service page for the Pinkham Notch trailhead with parking info, trail access details, and WMNF regulations.' },
      { title: 'AMC - Joe Dodge Lodge at Pinkham Notch', url: 'https://www.outdoors.org/destinations/new-hampshire/joe-dodge-lodge/', description: 'AMC lodging and visitor center information including hours, dining, gear shop, trail conditions, and program offerings.' },
      { title: 'Mount Washington Avalanche Center', url: 'https://www.mountwashingtonavalanchecenter.org/', description: 'MWAC homepage with daily avalanche advisories, observation submissions, and educational resources -- the first stop before any Presidential Range tour.' },
      { title: 'Mount Washington Volunteer Ski Patrol', url: 'https://tuckerman.org/', description: 'Volunteer ski patrol serving Tuckerman and Huntington Ravines -- provides rescue assistance, first aid, and skiing information from Pinkham Notch.' },
    ],
  },
};

function weatherCodeToCondition(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
    55: 'Heavy Drizzle', 56: 'Freezing Drizzle', 57: 'Freezing Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Freezing Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
    85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm',
  };
  return map[code] || 'Unknown';
}

function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Strip HTML tags to plain text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

// Fetch MWAC avalanche forecast
async function getMwacForecast() {
  try {
    const res = await fetch('https://api.avalanche.org/v2/public/products?avalanche_center_id=MWAC&type=forecast');
    if (!res.ok) throw new Error(`MWAC API ${res.status}`);
    const products = await res.json();

    const forecast = Array.isArray(products)
      ? products.find((p: any) => p.product_type === 'forecast')
      : null;

    if (!forecast) {
      return {
        dangerRating: -1,
        dangerLabel: 'No rating',
        dangerLevels: { alpine: null, treeline: null, belowTreeline: null },
        tomorrowLevels: { alpine: null, treeline: null, belowTreeline: null },
        bottomLine: 'Forecast data unavailable',
        author: '',
        publishedAt: '',
        expiresAt: '',
        source: 'Mount Washington Avalanche Center (USDA Forest Service)',
        sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
        disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
      };
    }

    const todayDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'current') || {};
    const tomorrowDanger = (forecast.danger || []).find((d: any) => d.valid_day === 'tomorrow') || {};

    const parseDangerLevel = (val: any) => (typeof val === 'number' && val >= 0 ? val : null);

    return {
      dangerRating: forecast.danger_rating ?? -1,
      dangerLabel: forecast.danger_level_text || 'No rating',
      dangerLevels: {
        alpine: parseDangerLevel(todayDanger.upper),
        treeline: parseDangerLevel(todayDanger.middle),
        belowTreeline: parseDangerLevel(todayDanger.lower),
      },
      tomorrowLevels: {
        alpine: parseDangerLevel(tomorrowDanger.upper),
        treeline: parseDangerLevel(tomorrowDanger.middle),
        belowTreeline: parseDangerLevel(tomorrowDanger.lower),
      },
      bottomLine: forecast.bottom_line ? stripHtml(forecast.bottom_line) : '',
      author: forecast.author || '',
      publishedAt: forecast.published_time || '',
      expiresAt: forecast.expires_time || '',
      source: 'Mount Washington Avalanche Center (USDA Forest Service)',
      sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
      disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
    };
  } catch {
    return {
      dangerRating: -1,
      dangerLabel: 'No rating',
      dangerLevels: { alpine: null, treeline: null, belowTreeline: null },
      tomorrowLevels: { alpine: null, treeline: null, belowTreeline: null },
      bottomLine: 'Unable to fetch avalanche forecast. Check mountwashingtonavalanchecenter.org directly.',
      author: '',
      publishedAt: '',
      expiresAt: '',
      source: 'Mount Washington Avalanche Center (USDA Forest Service)',
      sourceUrl: 'https://www.mountwashingtonavalanchecenter.org/forecasts/#/presidential-range',
      disclaimer: 'This data is sourced from MWAC. Always check the official forecast before heading into avalanche terrain.',
    };
  }
}

// Inline gear suggestions based on conditions
function getGearSuggestions(current: any, daily: any[]) {
  const suggestions: any[] = [];

  if (current.windGustMph > 50) {
    suggestions.push({ text: 'Extreme wind — hardshell, ski goggles, and ski crampons essential', priority: 'essential', category: 'protection', reviewUrl: '/grivel-ski-tour-skimatic-review/' });
  } else if (current.windGustMph > 35) {
    suggestions.push({ text: 'High winds forecast — bring hardshell and goggles', priority: 'essential', category: 'protection', reviewUrl: '/best-ski-goggles-2026/' });
  }

  if (current.tempF < -10) {
    suggestions.push({ text: 'Extreme cold — heavy insulation, face protection, chemical warmers', priority: 'essential', category: 'warmth', reviewUrl: '/darn-tough-thermolite-rfl-review/' });
  } else if (current.tempF < 10) {
    suggestions.push({ text: 'Cold conditions — insulated layer and warm socks essential', priority: 'essential', category: 'warmth', reviewUrl: '/best-ski-socks-2026/' });
  }

  const totalSnow = daily.slice(0, 2).reduce((sum: number, d: any) => sum + (d.totalSnowInches || 0), 0);
  if (totalSnow > 8) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of new snow expected — wider skis and avalanche awareness critical`, priority: 'essential', category: 'snow', reviewUrl: '/best-backcountry-skis-2026/' });
  } else if (totalSnow > 3) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of fresh snow forecast — good powder conditions`, priority: 'recommended', category: 'snow', reviewUrl: '/best-climbing-skins-2026/' });
  }

  suggestions.push({ text: 'Navigation app for backcountry routing', priority: 'recommended', category: 'navigation', reviewUrl: '/best-backcountry-ski-apps-2026/' });
  suggestions.push({ text: 'Check avalanche forecast before heading out', priority: 'essential', category: 'safety', reviewUrl: '/best-avalanche-resources-2026/' });

  return suggestions;
}

// Trip assessment factoring in weather + avalanche danger
function getTripAssessment(current: any, mwacForecast: any) {
  const reasons: string[] = [];
  let level = 'good';

  const avyRating = mwacForecast?.dangerRating ?? -1;
  const gusts = current.windGustMph ?? 0;
  const temp = current.tempF ?? 32;
  const visibility = current.visibility ?? 10;

  // Dangerous conditions
  if (avyRating >= 4) { level = 'dangerous'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'High/Extreme'}`); }
  if (gusts > 70) { level = 'dangerous'; reasons.push(`Extreme gusts: ${gusts} mph`); }
  if (temp < -15) { level = 'dangerous'; reasons.push(`Extreme cold: ${temp}°F`); }

  // Poor conditions
  if (level !== 'dangerous') {
    if (avyRating >= 3) { level = 'poor'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Considerable'}`); }
    if (gusts > 50) { level = 'poor'; reasons.push(`Very high gusts: ${gusts} mph`); }
    if (temp < 0) { level = 'poor'; reasons.push(`Very cold: ${temp}°F`); }
  }

  // Fair conditions
  if (level === 'good') {
    if (avyRating === 2) { level = 'fair'; reasons.push(`Avalanche danger: ${mwacForecast?.dangerLabel || 'Moderate'}`); }
    if (gusts > 35) { level = 'fair'; reasons.push(`Strong gusts: ${gusts} mph`); }
    if (temp < 15) { level = 'fair'; reasons.push(`Cold: ${temp}°F`); }
    if (visibility < 1) { level = 'fair'; reasons.push('Poor visibility'); }
  }

  if (reasons.length === 0) reasons.push('Conditions look favorable');

  const labels: Record<string, string> = {
    good: 'Good conditions for touring',
    fair: 'Fair — check details before heading out',
    poor: 'Caution advised — challenging conditions',
    dangerous: 'Not recommended — dangerous conditions',
  };

  return { overallRating: level, summary: labels[level] || labels.fair, reasons };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const zoneId = Array.isArray(id) ? id[0] : id;
  if (!zoneId) return res.status(400).json({ error: 'Zone ID required' });

  const zone = mvpZones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: `Zone "${zoneId}" not found` });

  try {
    // Fetch weather from Open-Meteo
    const params = new URLSearchParams({
      latitude: String(zone.lat), longitude: String(zone.lon),
      elevation: String(Math.round(zone.elevation * 0.3048)),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,visibility',
      hourly: 'temperature_2m,snowfall,precipitation,precipitation_probability,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,weather_code,sunrise,sunset',
      temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch',
      forecast_days: '5', timezone: 'America/New_York',
    });

    const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    const data = await meteoRes.json();

    const condition = weatherCodeToCondition(data.current?.weather_code ?? 0);
    const visibilityMi = Math.round((data.current?.visibility ?? 10000) * 0.000621371 * 10) / 10;

    const weather = {
      zoneId,
      fetchedAt: new Date().toISOString(),
      current: {
        tempF: Math.round(data.current?.temperature_2m ?? 0),
        feelsLikeF: Math.round(data.current?.apparent_temperature ?? 0),
        windMph: Math.round(data.current?.wind_speed_10m ?? 0),
        windGustMph: Math.round(data.current?.wind_gusts_10m ?? 0),
        windDirection: degreesToCardinal(data.current?.wind_direction_10m ?? 0),
        humidity: data.current?.relative_humidity_2m ?? 0,
        precipInches: 0,
        snowDepthInches: null,
        visibility: visibilityMi,
        condition,
        icon: condition.toLowerCase().replace(/\s+/g, '-'),
      },
      hourly: (data.hourly?.time ?? []).map((t: string, i: number) => ({
        time: t, tempF: Math.round(data.hourly.temperature_2m?.[i] ?? 0),
        windMph: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
        windGustMph: Math.round(data.hourly.wind_gusts_10m?.[i] ?? 0),
        windDirection: degreesToCardinal(data.hourly.wind_direction_10m?.[i] ?? 0),
        precipProbability: data.hourly.precipitation_probability?.[i] ?? 0,
        precipInches: data.hourly.precipitation?.[i] ?? 0,
        snowInches: data.hourly.snowfall?.[i] ?? 0,
        condition: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0),
        icon: weatherCodeToCondition(data.hourly.weather_code?.[i] ?? 0).toLowerCase().replace(/\s+/g, '-'),
      })),
      daily: (data.daily?.time ?? []).map((t: string, i: number) => ({
        date: t, highF: Math.round(data.daily.temperature_2m_max?.[i] ?? 0),
        lowF: Math.round(data.daily.temperature_2m_min?.[i] ?? 0),
        windMph: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
        windGustMph: Math.round(data.daily.wind_gusts_10m_max?.[i] ?? 0),
        precipProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
        totalPrecipInches: data.daily.precipitation_sum?.[i] ?? 0,
        totalSnowInches: data.daily.snowfall_sum?.[i] ?? 0,
        condition: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0),
        icon: weatherCodeToCondition(data.daily.weather_code?.[i] ?? 0).toLowerCase().replace(/\s+/g, '-'),
        sunrise: data.daily.sunrise?.[i] ?? '', sunset: data.daily.sunset?.[i] ?? '',
      })),
    };

    // Fetch MWAC forecast in parallel (don't block on failure)
    let mwacForecast = null;
    try {
      mwacForecast = await getMwacForecast();
    } catch {
      // MWAC fetch failed — continue with null forecast
    }

    const assessment = getTripAssessment(weather.current, mwacForecast);
    const gearSuggestions = getGearSuggestions(weather.current, weather.daily);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      zone,
      weather,
      forecast: mwacForecast,
      alerts: [],
      assessment,
      gearSuggestions,
      zoneInfo: ZONE_INFO[zoneId] || null,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

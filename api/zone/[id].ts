import type { VercelRequest, VercelResponse } from '@vercel/node';

// Same MVP zones as the /api/zones endpoint — Presidential Range (alpine)
const mvpZones = [
  { id: 'tuckerman-ravine', name: 'Tuckerman Ravine', lat: 44.2596, lon: -71.2973, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 2.4, isMvp: true, zoneType: 'alpine' as const },
  { id: 'huntington-ravine', name: 'Huntington Ravine', lat: 44.2680, lon: -71.2935, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E', approachMiles: 2.5, isMvp: true, zoneType: 'alpine' as const },
  { id: 'gulf-of-slides', name: 'Gulf of Slides', lat: 44.2495, lon: -71.2890, elevation: 3800, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'E/SE', approachMiles: 2.8, isMvp: true, zoneType: 'alpine' as const },
  { id: 'great-gulf', name: 'Great Gulf', lat: 44.2795, lon: -71.3050, elevation: 4000, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'NE', approachMiles: 3.5, isMvp: true, zoneType: 'alpine' as const },
  { id: 'oakes-gulf', name: 'Oakes Gulf', lat: 44.2470, lon: -71.3130, elevation: 4300, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 4.0, isMvp: true, zoneType: 'alpine' as const },
  { id: 'burt-ammonoosuc-ravines', name: 'Burt and Ammonoosuc Ravines', lat: 44.2720, lon: -71.3310, elevation: 4200, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'W/SW', approachMiles: 3.2, isMvp: true, zoneType: 'alpine' as const },
  { id: 'sherburne-ski-trail', name: 'Sherburne Ski Trail', lat: 44.2570, lon: -71.2530, elevation: 2400, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: 'SE', approachMiles: 0, isMvp: true, zoneType: 'alpine' as const },
  { id: 'pinkham-notch', name: 'Pinkham Notch', lat: 44.2573, lon: -71.2530, elevation: 2032, region: 'New Hampshire', subRegion: 'Presidential Range', aspect: '', approachMiles: 0, isMvp: true, zoneType: 'alpine' as const },
];

// GBA glade zone definitions
const gbaZones = [
  { id: 'baldface', name: 'Baldface', lat: 44.2375, lon: -71.015, elevation: 3000, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 3.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'black-white-glade', name: 'Black & White Glade', lat: 44.55, lon: -70.6841, elevation: 2214, region: 'Maine', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 4.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'bill-hill-glade', name: 'Bill Hill Glade', lat: 44.3866, lon: -71.2047, elevation: 1471, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'cooley-jericho-glade', name: 'Cooley-Jericho Glade', lat: 44.1719, lon: -71.8119, elevation: 2625, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 1.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'hypnosis-glade', name: 'Hypnosis Glade', lat: 43.9025, lon: -71.1246, elevation: 1035, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.3, isMvp: false, zoneType: 'glade' as const },
  { id: 'maple-villa-glade', name: 'Maple Villa Glade', lat: 44.0727, lon: -71.1368, elevation: 2200, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 1.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'page-hill', name: 'Page Hill', lat: 43.8598, lon: -71.2631, elevation: 1145, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.2, isMvp: false, zoneType: 'glade' as const },
  { id: 'prkr-mtn-glades', name: 'PRKR MTN Glades', lat: 44.3291, lon: -71.764, elevation: 1894, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'NE', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'the-pike-glades', name: 'The Pike Glades', lat: 43.9735, lon: -71.9536, elevation: 2200, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 1.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'ski-tow-glade', name: 'Ski Tow Glade', lat: 44.452, lon: -71.5704, elevation: 2000, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'west-side-glade', name: 'West Side Glade', lat: 44.0881, lon: -71.2934, elevation: 1300, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'N', approachMiles: 0.5, isMvp: false, zoneType: 'glade' as const },
  { id: 'historic-ccc-trails', name: 'Historic CCC Trails', lat: 44.163, lon: -71.153, elevation: 3950, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'Various', approachMiles: 2.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'crescent-ridge-glade', name: 'Crescent Ridge Glade', lat: 44.3919, lon: -71.2863, elevation: 3046, region: 'New Hampshire', subRegion: 'GBA Glades', aspect: 'SE/E', approachMiles: 2.0, isMvp: false, zoneType: 'glade' as const },
];

// Mt. Mansfield zones (Vermont — alpine/CCC trails)
const mansfieldZones = [
  { id: 'teardrop-trail', name: 'Teardrop Trail', lat: 44.5290, lon: -72.8428, elevation: 4062, region: 'Vermont', subRegion: 'Mt. Mansfield', aspect: 'W', approachMiles: 1.8, isMvp: false, zoneType: 'alpine' as const },
  { id: 'bruce-trail', name: 'Bruce Trail', lat: 44.5290, lon: -72.8428, elevation: 4393, region: 'Vermont', subRegion: 'Mt. Mansfield', aspect: 'SW', approachMiles: 4.8, isMvp: false, zoneType: 'alpine' as const },
  { id: 'skytop-trail', name: 'Skytop Trail', lat: 44.5290, lon: -72.8428, elevation: 4062, region: 'Vermont', subRegion: 'Mt. Mansfield', aspect: 'W/NW', approachMiles: 6.0, isMvp: false, zoneType: 'alpine' as const },
  { id: 'steeple-trail', name: 'Steeple Trail', lat: 44.5436, lon: -72.8143, elevation: 4200, region: 'Vermont', subRegion: 'Mt. Mansfield', aspect: 'E/SE', approachMiles: 2.0, isMvp: false, zoneType: 'alpine' as const },
  { id: 'nosedive-trail', name: 'Nose Dive Trail', lat: 44.5436, lon: -72.8143, elevation: 4064, region: 'Vermont', subRegion: 'Mt. Mansfield', aspect: 'NW', approachMiles: 1.4, isMvp: false, zoneType: 'alpine' as const },
];

// Mt. Cardigan zones (New Hampshire — glade/tree skiing)
const cardiganZones = [
  { id: 'dukes-trail', name: "Duke's Trail", lat: 43.6495, lon: -71.8777, elevation: 3000, region: 'New Hampshire', subRegion: 'Mt. Cardigan', aspect: 'E', approachMiles: 1.6, isMvp: false, zoneType: 'glade' as const },
  { id: 'alexandria-trail', name: 'Alexandria Ski Trail', lat: 43.6495, lon: -71.8777, elevation: 2800, region: 'New Hampshire', subRegion: 'Mt. Cardigan', aspect: 'E', approachMiles: 1.7, isMvp: false, zoneType: 'glade' as const },
  { id: 'kimball-trail', name: 'Kimball Ski Trail', lat: 43.6495, lon: -71.8777, elevation: 2100, region: 'New Hampshire', subRegion: 'Mt. Cardigan', aspect: 'S', approachMiles: 1.0, isMvp: false, zoneType: 'glade' as const },
  { id: 'cardigan-grand-tour', name: 'Grand Tour (Duke\'s + Alexandria)', lat: 43.6495, lon: -71.8777, elevation: 3155, region: 'New Hampshire', subRegion: 'Mt. Cardigan', aspect: 'E', approachMiles: 5.5, isMvp: false, zoneType: 'glade' as const },
];

// Mt. Greylock zones (Massachusetts — alpine/exposed)
const greylockZones = [
  { id: 'thunderbolt-trail', name: 'Thunderbolt Ski Trail', lat: 42.6372, lon: -73.1658, elevation: 3491, region: 'Massachusetts', subRegion: 'Mt. Greylock', aspect: 'E', approachMiles: 1.6, isMvp: false, zoneType: 'alpine' as const },
  { id: 'bellows-pipe-trail', name: 'Bellows Pipe Ski Trail', lat: 42.6422, lon: -73.1625, elevation: 3491, region: 'Massachusetts', subRegion: 'Mt. Greylock', aspect: 'NE', approachMiles: 1.8, isMvp: false, zoneType: 'alpine' as const },
];

// Mt. Marcy zones (New York — alpine/above-treeline)
const marcyZones = [
  { id: 'van-hoevenberg-trail', name: 'Van Hoevenberg Trail', lat: 44.1830, lon: -73.9645, elevation: 5344, region: 'New York', subRegion: 'Mt. Marcy', aspect: 'Various', approachMiles: 7.4, isMvp: false, zoneType: 'alpine' as const },
  { id: 'marcy-summit-bowl-glades', name: 'Summit Bowl & Indian Falls Glades', lat: 44.1830, lon: -73.9645, elevation: 5344, region: 'New York', subRegion: 'Mt. Marcy', aspect: 'W/SW', approachMiles: 7.4, isMvp: false, zoneType: 'alpine' as const },
  { id: 'panther-gorge-slides', name: 'Panther Gorge Slides', lat: 44.0893, lon: -74.0562, elevation: 5344, region: 'New York', subRegion: 'Mt. Marcy', aspect: 'S/SE', approachMiles: 10.3, isMvp: false, zoneType: 'alpine' as const },
];

// All zones combined
const allZones = [...mvpZones, ...gbaZones, ...mansfieldZones, ...cardiganZones, ...greylockZones, ...marcyZones];

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
  // GBA Glade zones
  'baldface': {
    overview: 'Open ledge alpine terrain spanning North Baldface, South Baldface, and Baldface Knob in the Cold River Valley near the NH/ME state line. The glades begin steeply in the upper elevations and transition to mellow cruisers midway and toward the bottom, offering 2,500 vertical feet from the top of the Knob via the Ridgeline Glades. Significant avalanche hazard exists in the alpine zone above treeline.',
    stats: {
      verticalDrop: '2,500 ft',
      maxPitch: 'Advanced sections in upper elevations',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Full Day tour via Baldface Circle Trail / Slippery Brook Trail',
      baseElevation: 500,
      topElevation: 3000,
      aspect: 'Various',
    },
    sources: [
      { title: 'Baldface -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/baldface', description: 'Official GBA zone page with terrain description, access info, parking, and safety warnings.' },
      { title: 'Avenza Maps - South Baldface Slippery Brook Glade', url: 'https://www.avenzamaps.com/maps/852161', description: 'Downloadable geo-referenced PDF map for offline navigation of the Baldface glade zone.' },
    ],
  },
  'black-white-glade': {
    overview: 'Maine\'s first public human-powered glade, featuring an eight-mile point-to-point two-mountain traverse connecting Bethel (west) to Rumford (east) across Black Mountain and Rumford Whitecap. The terrain includes snowfields, drops, and 360-degree summit views with 600-1,400 feet of vertical depending on route.',
    stats: {
      verticalDrop: '1,414 ft',
      maxPitch: 'Intermediate-advanced sections',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Full Day traverse (8-mile point-to-point)',
      baseElevation: 800,
      topElevation: 2214,
      aspect: 'Various',
    },
    sources: [
      { title: 'Black & White Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/black-white-glade', description: 'Official GBA zone page with traverse route description, access points, safety warnings, and ecological notes.' },
      { title: 'Black Mountain of Maine', url: 'https://skiblackmountain.org/', description: 'Partner organization operating the backcountry gate with uphill-only skintrack access on the Black Mountain side.' },
    ],
  },
  'bill-hill-glade': {
    overview: 'A quick-access north-facing glade on the northern arm of Pine Mountain in Gorham. Recently logged terrain with young, tightly-spaced trees demands tight turns -- the north aspect holds snow long after storms. Entry-level to advanced terrain with 600 vertical feet of skiing.',
    stats: {
      verticalDrop: '642 ft',
      maxPitch: 'Intermediate-advanced sections',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from Bellevue Road',
      baseElevation: 829,
      topElevation: 1471,
      aspect: 'N',
    },
    sources: [
      { title: 'Bill Hill Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/bill-hill-glade', description: 'Official GBA zone page with terrain description, parking instructions, and access details.' },
      { title: 'Avenza Maps - Gorham Bill Hill Glade', url: 'https://store.avenza.com/products/gorham-bill-hill-glade-granite-backcountry-alliance-map', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'cooley-jericho-glade': {
    overview: 'Four sporty glade lines ranging from 400 to 800+ vertical feet on an 840-acre community forest spanning four towns (Franconia, Sugar Hill, Easton, and Landaff). Features drops, large yellow birches, and panoramic views of Mount Lafayette and Cannon Mountain on the ascent.',
    stats: {
      verticalDrop: '857 ft',
      maxPitch: 'Intermediate-advanced sections',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Half Day from 12 Trumpet Round Rd, Easton',
      baseElevation: 1768,
      topElevation: 2625,
      aspect: 'Various',
    },
    sources: [
      { title: 'Cooley-Jericho Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/cooleyjericho-glade', description: 'Official GBA zone page with glade descriptions, parking protocol, and nearby amenities.' },
      { title: 'Avenza Maps - Franconia Cooley Jericho Glade', url: 'https://www.avenzamaps.com/maps/1102869/franconia-cooley-jericho-glade', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'hypnosis-glade': {
    overview: 'A family-friendly introductory glade zone on private land behind the White Mountain Hypnosis Center in Madison. Four distinct glade lines offer mellow yet colorful skiing with 400+ vertical feet of varied terrain for all abilities.',
    stats: {
      verticalDrop: '435 ft',
      maxPitch: 'Beginner-intermediate pitch',
      difficulty: 'beginner-intermediate',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from 428 Conway Road (Route 113), Madison',
      baseElevation: 600,
      topElevation: 1035,
      aspect: 'Various',
    },
    sources: [
      { title: 'Hypnosis Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/hypnosis-glade', description: 'Official GBA zone page with terrain description, access details, and parking info.' },
      { title: 'Avenza Maps - Madison Hypnosis Glade', url: 'https://store.avenza.com/products/madison-hypnosis-glade-granite-backcountry-alliance-map', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'maple-villa-glade': {
    overview: 'Expert to intermediate terrain on Bartlett Mountain with 1,700 vertical feet across three distinct zones. Originally built by the Civilian Conservation Corps in 1933 and revived in 2018. The east zone offers upper glade lines of approximately 800 vertical feet each, the west zone provides solitude-oriented skiing, and Pine Hill features steep powder stashes.',
    stats: {
      verticalDrop: '1,700 ft',
      maxPitch: 'Expert sections on Pine Hill',
      difficulty: 'intermediate-expert',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Full Day from 70 East Branch Road, Intervale',
      baseElevation: 500,
      topElevation: 2200,
      aspect: 'N',
    },
    sources: [
      { title: 'Maple Villa Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/maplevillaglade', description: 'Official GBA zone page with three-zone terrain description, parking info, and access guidelines.' },
      { title: 'Avenza Maps - Maple Villa Glade Bartlett', url: 'https://www.avenzamaps.com/maps/852161/maple-villa-glade-bartlett', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'page-hill': {
    overview: 'A revived former alpine ski area (operated 1930s-1960s) in Tamworth offering 350 vertical feet of approachable gladed terrain for intermediate and advancing skiers. Stunning views of the Sandwich Dome, Mt. Whiteface, Mt. Passaconaway, Mt. Paugus, and Mt. Chocorua. Now home to the Public House on Page Hill restaurant.',
    stats: {
      verticalDrop: '350 ft',
      maxPitch: 'Intermediate-advanced pitch',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from 388 Page Hill Rd, Tamworth',
      baseElevation: 795,
      topElevation: 1145,
      aspect: 'Various',
    },
    sources: [
      { title: 'Page Hill -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/page-hill', description: 'Official GBA zone page with terrain description, parking instructions, and historical context.' },
      { title: 'Avenza Maps - Tamworth Page Hill Glade', url: 'https://store.avenza.com/products/tamworth-page-hill-glade-granite-backcountry-alliance-map', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'prkr-mtn-glades': {
    overview: 'Four northeast-facing glade lines cut in 2022 on Parker Mountain, just minutes from downtown Littleton. Each line delivers approximately 400 vertical feet of skiing with steeps, turns, and views. Named runs include Chiswick, Pollyanna Timber Baron, and Railroad Hotel.',
    stats: {
      verticalDrop: '400 ft',
      maxPitch: 'Intermediate-advanced sections',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from Scout Lot, Broomstick Hill Rd, Littleton',
      baseElevation: 897,
      topElevation: 1894,
      aspect: 'NE',
    },
    sources: [
      { title: 'PRKR MTN Glades -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/prkrmtnglades', description: 'Official GBA zone page with glade line descriptions, parking info, and nearby amenities.' },
      { title: 'PRKR MTN Trails', url: 'https://www.prkrmtn.org', description: 'Official partner organization website for the Parker Mountain trail network.' },
    ],
  },
  'the-pike-glades': {
    overview: 'A newer GBA zone accommodating skiers across ability levels with both technical and mellower glade lines. Named runs include Wazza\'s Glade and Udder Delight (steeper, technical) and Long Strange Trip and Iron Moose (moderate pitch). Warming huts at mid-mountain and the summit provide shelter.',
    stats: {
      verticalDrop: '1,500 ft',
      maxPitch: 'Beginner to advanced sections',
      difficulty: 'beginner-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Half Day to Full Day from 2719 Mt Moosilauke Highway, Pike',
      baseElevation: 700,
      topElevation: 2200,
      aspect: 'Various',
    },
    sources: [
      { title: 'The Pike Glades -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/the-pike-glades', description: 'Official GBA zone page with named run descriptions, warming hut info, and access details.' },
      { title: 'The Pike Glades', url: 'https://thepikeglades.com', description: 'Dedicated website for The Pike Glades zone with conditions updates and info.' },
    ],
  },
  'ski-tow-glade': {
    overview: 'Four glade lines developed in 2018 from the summit of Mount Prospect in Weeks State Park, dropping through exciting terrain and flowing into the existing community ski tow footprint for 700 vertical feet of skiing. Skin to the summit stone tower for panoramic views, then ski down and warm up with hot chocolate in the yurt.',
    stats: {
      verticalDrop: '700 ft',
      maxPitch: 'Intermediate-advanced sections',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from Route 3 / Prospect Street, Lancaster',
      baseElevation: 1300,
      topElevation: 2000,
      aspect: 'Various',
    },
    sources: [
      { title: 'Ski Tow Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/ski-tow-glade', description: 'Official GBA zone page with glade descriptions, community ski tow info, and yurt details.' },
      { title: 'Mount Prospect Ski Tow', url: 'https://www.mountprospectskitow.com/', description: 'Official website for the community-run Mount Prospect Ski Club with hours, conditions, and directions.' },
    ],
  },
  'west-side-glade': {
    overview: 'A peaceful and serene intermediate glade on private land in Bartlett\'s Mt. Washington Valley, offering 600 vertical feet of north-facing gladed skiing. The glade lines carry a solid intermediate pitch that rewards both careful and experienced skiers.',
    stats: {
      verticalDrop: '600 ft',
      maxPitch: 'Intermediate pitch',
      difficulty: 'intermediate',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Lunch Lap from 629 West Side Road, Bartlett',
      baseElevation: 700,
      topElevation: 1300,
      aspect: 'N',
    },
    sources: [
      { title: 'West Side Glade -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/westsideglade', description: 'Official GBA zone page with terrain description, parking lot info, and access guidelines.' },
      { title: 'Avenza Maps - Bartlett West Side Glade', url: 'https://www.avenzamaps.com/maps/1511736/bartlett-west-side-glade', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  'historic-ccc-trails': {
    overview: 'Four historic ski trails built by the Civilian Conservation Corps in the 1930s, maintained by GBA in and around Mt. Washington Valley. These include the Doublehead Ski Trail (Jackson, 1,573 ft vertical), Black Mountain Ski Trail (Jackson, 1,527 ft vertical), John Sherburne Ski Trail (Pinkham Notch, 1,918 ft vertical), and Gulf of Slides Ski Trail (Pinkham Notch, 1,868 ft vertical).',
    stats: {
      verticalDrop: '1,918 ft (max -- Sherburne)',
      maxPitch: 'Advanced on Sherburne; beginner-intermediate on Black Mountain',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March', 'April'],
      approachTime: 'Half Day to Full Day -- multiple trailheads in Jackson and Pinkham Notch',
      baseElevation: 1220,
      topElevation: 3950,
      aspect: 'Various',
    },
    sources: [
      { title: 'Historic CCC Trails -- Granite Backcountry Alliance', url: 'https://granitebackcountryalliance.org/ccctrails', description: 'Official GBA page covering all four maintained CCC ski trails with distances, vertical, and historical context.' },
      { title: 'Friends of Tuckerman Ravine - Trail Crew Volunteers', url: 'https://www.friendsoftuckermanravine.org/trail_crew_volunteers', description: 'FOTR volunteer program for Sherburne and Gulf of Slides trail maintenance.' },
    ],
  },
  'crescent-ridge-glade': {
    overview: 'A 75-acre zone of five skiable glade lines in the 10,000-acre Randolph Community Forest, designed to appeal to intermediate and advanced skiers. The upper pitch starts mellow then drops to 30-35 degrees for 200-300 vertical feet, flowing into a large open hardwood glade at 20-25 degrees, and finishing through a tree-less wildlife area with stunning views of the northern Presidential Range.',
    stats: {
      verticalDrop: '1,106 ft',
      maxPitch: '30-35 degrees in the steep section',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: 'Half Day -- 1.95-mile uphill skin track from end of Randolph Hill Road',
      baseElevation: 1940,
      topElevation: 3046,
      aspect: 'SE/E',
    },
    sources: [
      { title: 'Crescent Ridge Glade -- Trail Finder', url: 'https://www.trailfinder.info/trails/trail/crescent-ridge-glade', description: 'Trail Finder page with GPS coordinates, elevation data, named glade lines, and trail manager contact.' },
      { title: 'Avenza Maps - Randolph Crescent Ridge Glade', url: 'https://store.avenza.com/products/randolph-crescent-ridge-glade-granite-backcountry-alliance-map', description: 'Downloadable geo-referenced PDF map for offline navigation.' },
    ],
  },
  // ─── Mt. Mansfield (Vermont) ──────────────────────────────────────────────
  'teardrop-trail': {
    overview: 'A CCC trail cut in 1937 descending the west side of Mt. Mansfield from the Forehead (4,062 ft) down to Underhill State Park. Drops roughly 2,000 vertical feet in 1.8 miles with several sharp turns, steep pitches, and double fall lines. A classic link-up skins up Teardrop, traverses to the Bruce via the Toll Road, skis the Bruce, skins back up, and returns via Teardrop for 4,500+ ft of total vertical.',
    stats: {
      verticalDrop: '2,000 ft',
      length: '1.8 miles',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 2060,
      topElevation: 4062,
      aspect: 'W',
    },
    sources: [
      { title: 'New England Ski History - Mt. Mansfield CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/Vermont/mtmansfield.php', description: 'Comprehensive history of CCC-era ski trails on Mt. Mansfield.' },
      { title: 'Explore-Share - Backcountry Skiing on the Teardrop Trail', url: 'https://www.explore-share.com/trip/backcountry-skiing-on-the-teardrop-trail-mt-mansfield-west-side/', description: 'Guided trip details for the Teardrop Trail with route description and difficulty assessment.' },
    ],
  },
  'bruce-trail': {
    overview: 'One of the oldest ski trails in the United States, cut by the CCC in 1933. The Bruce descends the southwest side of Mt. Mansfield from near the Chin summit with roughly 2,180 ft of vertical. The trail starts narrow then dives down the fall line through progressively wider terrain in dense spruce forest.',
    stats: {
      verticalDrop: '2,180 ft',
      length: '4.8 miles (round trip including approach)',
      difficulty: 'advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 2200,
      topElevation: 4393,
      aspect: 'SW',
    },
    sources: [
      { title: 'New England Ski History - Mt. Mansfield CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/Vermont/mtmansfield.php', description: 'History of the Bruce Trail including construction dates and historical context.' },
      { title: 'Vermont Dept. of Forests, Parks and Recreation - Mt. Mansfield State Forest', url: 'https://fpr.vermont.gov/mt-mansfield-state-forest-0', description: 'Official state resource for Mt. Mansfield State Forest trail access and regulations.' },
    ],
  },
  'skytop-trail': {
    overview: 'A high-elevation ridge traverse and descent route offering panoramic views of the Green Mountains. Skytop follows the ridgeline below Skytop Ridge before descending through hardwood glades on the west side. Accessible from the Stowe Mountain Resort Nordic Center or the Trapp Family Lodge. A longer tour combining ridge walking with moderate glade skiing.',
    stats: {
      verticalDrop: '1,500-2,000 ft (varies by descent line)',
      length: '5-8 miles round trip (depending on approach)',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 2400,
      topElevation: 4062,
      aspect: 'W/NW',
    },
    sources: [
      { title: 'Explore-Share - Backcountry Skiing Day Tour on Mount Mansfield', url: 'https://www.explore-share.com/trip/backcountry-skiing-day-tour-on-mount-mansfield-in-stowe-vermont/', description: 'Overview of Mt. Mansfield backcountry skiing options including Skytop.' },
    ],
  },
  'steeple-trail': {
    overview: 'The steepest marked backcountry trail in Mansfield State Forest with an average grade of 23.3%. Starts near the top of the Toll Road and delivers one of the most rewarding descents on the mountain. The upper third is expert-only terrain through tight trees, while the lower Steeple mellows to intermediate grade.',
    stats: {
      verticalDrop: '2,000+ ft',
      length: 'Approximately 2 miles',
      difficulty: 'advanced-expert (upper) / intermediate (lower)',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 2200,
      topElevation: 4200,
      aspect: 'E/SE',
    },
    sources: [
      { title: 'SkiMaven - Skiing the Lower Steeple Trail', url: 'https://www.skimaven.com/post/skiing-the-lower-steeple-trail-a-classic-backcountry-trail-near-mt-mansfield', description: 'Trip report and trail description for the Steeple Trail descent.' },
      { title: 'Explore-Share - Backcountry Skiing Day Tour on Mount Mansfield', url: 'https://www.explore-share.com/trip/backcountry-skiing-day-tour-on-mount-mansfield-in-stowe-vermont/', description: 'Guide-led tour info for Mansfield backcountry routes.' },
    ],
  },
  'nosedive-trail': {
    overview: 'Cut by the CCC in 1934-1935, the Nose Dive was Stowe\'s most famous race trail and hosted Eastern Downhill Championships from 1937 to 1949. The original trail featured the Cork Screw, the Corridor, and the Gulch. While the upper portion is now part of Stowe Mountain Resort, the lower sections and historical race line remain a backcountry classic.',
    stats: {
      verticalDrop: '2,300+ ft (original full trail)',
      length: '1.4 miles',
      difficulty: 'advanced-expert',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 2060,
      topElevation: 4064,
      aspect: 'NW',
    },
    sources: [
      { title: 'New England Ski History - Mt. Mansfield CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/Vermont/mtmansfield.php', description: 'Historical overview of the Nose Dive trail including race history.' },
    ],
  },
  // ─── Mt. Cardigan (New Hampshire) ─────────────────────────────────────────
  'dukes-trail': {
    overview: 'Cut from the Firescrew subpeak of Mt. Cardigan in late 1933 by the CCC and designed by Duke Dimitri von Leuchtenberg. The gentler of the two ski descents at roughly 1.25 miles with 1,600 ft of vertical drop. Designed with gentle grades suitable for novice and intermediate skiers. The 3.2-mile round trip from the AMC Cardigan Lodge is a satisfying half-day tour.',
    stats: {
      verticalDrop: '1,600 ft',
      length: '1.25 miles (descent) / 3.2 miles round trip',
      difficulty: 'intermediate',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1392,
      topElevation: 3000,
      aspect: 'E',
    },
    sources: [
      { title: 'AMC Outdoors - Best Backcountry Skiing at Mount Cardigan', url: 'https://www.outdoors.org/resources/amc-outdoors/outdoor-resources/best-backcountry-skiing-at-mount-cardigan/', description: 'AMC guide to backcountry skiing on Mt. Cardigan with trail descriptions.' },
      { title: 'New England Ski History - Mt. Cardigan CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/NewHampshire/mtcardigan.php', description: 'Historical overview of CCC-era ski trail construction on Mt. Cardigan.' },
    ],
  },
  'alexandria-trail': {
    overview: 'Cut by the CCC in 1934 and designed by Charles Proctor, the Alexandria Trail is the steeper, more challenging descent on Mt. Cardigan. At 1.7 miles with 1,400 ft of vertical drop, the trail showcases excellent CCC craftsmanship -- widening where you need room to carve. Combined with Duke\'s Trail in the Grand Tour, it creates one of the best backcountry ski loops in New Hampshire.',
    stats: {
      verticalDrop: '1,400 ft',
      length: '1.7 miles',
      difficulty: 'advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1392,
      topElevation: 2800,
      aspect: 'E',
    },
    sources: [
      { title: 'AMC Outdoors - Best Backcountry Skiing at Mount Cardigan', url: 'https://www.outdoors.org/resources/amc-outdoors/outdoor-resources/best-backcountry-skiing-at-mount-cardigan/', description: 'AMC guide covering the Alexandria Trail.' },
      { title: 'EMS goEast - Backcountry Turns at Mt. Cardigan', url: 'https://goeast.ems.com/backcountry-skiing-mount-cardigan/', description: 'EMS backcountry guide to Mt. Cardigan.' },
    ],
  },
  'kimball-trail': {
    overview: 'A shorter, lower-elevation forest descent on the south side of Mt. Cardigan, cut by the AMC in December 1934. At 0.8-1 mile with roughly 600 ft of vertical, the Kimball provides a quick lap option and connects into the Grand Tour loop. Dense forest retains snow when higher trails are wind-scoured.',
    stats: {
      verticalDrop: '600 ft',
      length: '0.8-1 mile',
      difficulty: 'intermediate',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1500,
      topElevation: 2100,
      aspect: 'S',
    },
    sources: [
      { title: 'New England Ski History - Mt. Cardigan CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/NewHampshire/mtcardigan.php', description: 'Historical overview of Kimball Trail construction.' },
    ],
  },
  'cardigan-grand-tour': {
    overview: 'The signature backcountry ski outing on Mt. Cardigan: a 5.5-mile loop that skins up one CCC trail, crosses the Firescrew-Mt. Cardigan ridge, and descends the opposite ski trail. Typically done ascending Duke\'s and descending Alexandria. The ridge traverse adds alpine character with exposed granite above treeline. Roughly 1,750 ft of vertical in 3-4 hours.',
    stats: {
      verticalDrop: '1,750 ft (total vertical)',
      length: '5.5 miles (full loop)',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1392,
      topElevation: 3155,
      aspect: 'E (both descents)',
    },
    sources: [
      { title: 'AMC Outdoors - Best Backcountry Skiing at Mount Cardigan', url: 'https://www.outdoors.org/resources/amc-outdoors/outdoor-resources/best-backcountry-skiing-at-mount-cardigan/', description: 'AMC guide with Grand Tour route details.' },
      { title: 'Explore-Share - Mt. Cardigan Grand Tour on Skis', url: 'https://www.explore-share.com/trip/mt-cardigan-grand-tour-skis-intermediate/', description: 'Guided tour of the Grand Tour loop with route description.' },
    ],
  },
  // ─── Mt. Greylock (Massachusetts) ─────────────────────────────────────────
  'thunderbolt-trail': {
    overview: 'The crown jewel of Massachusetts backcountry skiing. The Thunderbolt drops 2,175 ft in 1.6 miles from the summit of Mt. Greylock down the east face to Greylock Glen. Constructed in 1934 by the CCC with 300 pounds of dynamite, it hosted the U.S. Eastern Alpine Ski Championships in 1936. Features alternating fall-line pitches 30-50 ft wide reaching grades up to 35 degrees. Maintained by the Thunderbolt Ski Runners volunteer organization.',
    stats: {
      verticalDrop: '2,175 ft',
      length: '1.6 miles',
      maxPitch: '35 degrees',
      difficulty: 'advanced-expert',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1263,
      topElevation: 3491,
      aspect: 'E',
    },
    sources: [
      { title: 'Thunderbolt Ski Runners - Official Website', url: 'https://www.thunderboltski.com', description: 'Official website of the volunteer organization that maintains the Thunderbolt Ski Trail.' },
      { title: 'New England Ski History - Mt. Greylock CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/Massachusetts/mtgreylock.php', description: 'History of CCC-era ski trail construction on Mt. Greylock.' },
      { title: 'Powder Project - Thunderbolt Ski Trail', url: 'https://www.powderproject.com/trail/7000227/thunderbolt-ski-trail', description: 'Route page with GPS coordinates, elevation profile, and user trip reports.' },
    ],
  },
  'bellows-pipe-trail': {
    overview: 'An intermediate alternative to the Thunderbolt, opened in 1938-39 on the northeast face of Mt. Greylock. At 1.8 miles with 2,000 ft of vertical drop, it was designed as a less extreme racing venue. Maximum gradient is 27 degrees -- substantially mellower than the Thunderbolt. Can be combined with the Thunderbolt in a loop using the Bellows Pipe hiking trail.',
    stats: {
      verticalDrop: '2,000 ft',
      length: '1.8 miles',
      maxPitch: '27 degrees',
      difficulty: 'intermediate-advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      baseElevation: 1490,
      topElevation: 3491,
      aspect: 'NE',
    },
    sources: [
      { title: 'New England Ski History - Mt. Greylock CCC Ski Trails', url: 'https://www.newenglandskihistory.com/cccskitrails/Massachusetts/mtgreylock.php', description: 'History of Bellows Pipe trail construction and race history.' },
      { title: 'EMS goEast - Alpha Guide: Hiking Mount Greylock\'s Thunderbolt Trail', url: 'https://goeast.ems.com/mount-greylock-thunderbolt-trail-alpha-guide/', description: 'Guide to Greylock trails with approach logistics.' },
    ],
  },
  // ─── Mt. Marcy (New York) ─────────────────────────────────────────────────
  'van-hoevenberg-trail': {
    overview: 'The classic ski route to Mt. Marcy\'s summit and the most popular backcountry ski tour in the Adirondack High Peaks. The 7.4-mile approach from Adirondak Loj follows the Van Hoevenberg Trail through gentle terrain to Marcy Dam, then climbs steadily past Indian Falls to the open alpine summit. Key descent sections include the Corkscrew, Romper Room, and the summit bowl.',
    stats: {
      verticalDrop: '3,166 ft',
      length: '7.4 miles one-way (14.8 miles round trip)',
      difficulty: 'advanced',
      bestMonths: ['December', 'January', 'February', 'March'],
      approachTime: '5 hours (ascent) / 2-3 hours (descent)',
      baseElevation: 2178,
      topElevation: 5344,
      aspect: 'Various',
    },
    sources: [
      { title: 'Adirondack Explorer - Skiing Mount Marcy', url: 'https://www.adirondackexplorer.org/outdoor-recreation/skiing-mount-marcy/', description: 'Comprehensive guide to backcountry skiing Mt. Marcy via the Van Hoevenberg Trail.' },
      { title: 'Pure Adirondacks - Backcountry Skiing Mt. Marcy Trip', url: 'https://pureadirondacks.com/blogs/adirondack-skiing-riding/backcountry-skiing-mt-marcy-trip', description: 'Detailed ski trip report covering the full Marcy approach.' },
      { title: 'ADK - Hiker Parking at Heart Lake', url: 'https://adk.org/hiker-parking-at-heart-lake/', description: 'Official ADK info on parking and winter access at Adirondak Loj.' },
    ],
  },
  'marcy-summit-bowl-glades': {
    overview: 'Above treeline near the summit and in the transition zone above Indian Falls, Mt. Marcy offers open glade skiing accessible as a bonus on the standard Van Hoevenberg route. The summit bowl provides a short, steep descent with 360-degree views before entering the tree-skiing zone. The classic ski loop descends the cone on the west side, contours left of Gray Peak through the Funnel, then floats through glades to Lake Tear of the Clouds.',
    stats: {
      verticalDrop: '1,000-1,500 ft (glade zone)',
      length: 'Variable (off-trail)',
      difficulty: 'advanced-expert',
      bestMonths: ['January', 'February', 'March'],
      baseElevation: 3800,
      topElevation: 5344,
      aspect: 'W/SW',
    },
    sources: [
      { title: 'Adirondack Explorer - The Fun Dome: New York\'s Mount Marcy', url: 'https://www.adirondackexplorer.org/outdoor-recreation/skiing-mt-marcy-five-minutes/', description: 'Profile of Marcy\'s summit bowl skiing and classic glade descent.' },
      { title: 'Adirondack Explorer - Skiing Mount Marcy', url: 'https://www.adirondackexplorer.org/outdoor-recreation/skiing-mount-marcy/', description: 'Comprehensive route guide.' },
    ],
  },
  'panther-gorge-slides': {
    overview: 'Between Mt. Marcy and Mt. Haystack lies Panther Gorge, harboring several slide paths on the south face of Marcy. The Pipeline is a 600-ft slide, Grand Central rises roughly 1,200 ft but is only 50 ft wide. All Panther Gorge lines are extremely hazardous -- avalanche-prone with numerous terrain traps. These are ski mountaineering objectives, not recreational descents. Most approach from the Upper Works trailhead in Newcomb (10.3 miles, 3,800 ft gain).',
    stats: {
      verticalDrop: '600-1,200 ft (slide dependent)',
      length: 'Variable (slides 0.2-0.5 miles; approach 10+ miles)',
      difficulty: 'expert-only / ski mountaineering',
      bestMonths: ['March', 'April'],
      baseElevation: 3200,
      topElevation: 5344,
      aspect: 'S/SE',
    },
    sources: [
      { title: 'NYSkiBlog - Panther Gorge Trek', url: 'https://nyskiblog.com/panther-gorge-trek/', description: 'Trip report and terrain description of Panther Gorge slides.' },
      { title: 'Adirondack Explorer - Skiing Mount Marcy', url: 'https://www.adirondackexplorer.org/outdoor-recreation/skiing-mount-marcy/', description: 'Overview including Panther Gorge terrain.' },
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

// ─── Zone-specific gear suggestions ──────────────────────────────────────
// Alpine/exposed zones
const ALPINE_EXPOSED_IDS = new Set([
  'tuckerman-ravine', 'huntington-ravine', 'gulf-of-slides', 'great-gulf',
  'oakes-gulf', 'burt-ammonoosuc-ravines', 'teardrop-trail', 'bruce-trail',
  'skytop-trail', 'steeple-trail', 'nosedive-trail',
  'van-hoevenberg-trail', 'marcy-summit-bowl-glades', 'panther-gorge-slides',
  'thunderbolt-trail', 'bellows-pipe-trail',
]);
// CCC trail zones (sustained pitch, variable conditions)
const CCC_TRAIL_IDS = new Set([
  'sherburne-ski-trail', 'thunderbolt-trail', 'bellows-pipe-trail',
  'bruce-trail', 'teardrop-trail', 'steeple-trail', 'nosedive-trail',
]);
// Gladed terrain zones
const GLADE_IDS = new Set([
  'baldface', 'black-white-glade', 'bill-hill-glade', 'cooley-jericho-glade',
  'hypnosis-glade', 'maple-villa-glade', 'page-hill', 'prkr-mtn-glades',
  'the-pike-glades', 'ski-tow-glade', 'west-side-glade', 'historic-ccc-trails',
  'crescent-ridge-glade', 'dukes-trail', 'alexandria-trail', 'kimball-trail',
  'cardigan-grand-tour',
]);
// Long approach zones (>3.5 miles)
const LONG_APPROACH_IDS = new Set([
  'great-gulf', 'oakes-gulf', 'van-hoevenberg-trail', 'marcy-summit-bowl-glades',
  'panther-gorge-slides', 'skytop-trail', 'cardigan-grand-tour',
  'black-white-glade',
]);

function getGearSuggestions(current: any, daily: any[], zone: any) {
  const suggestions: any[] = [];
  const zoneId = zone.id;
  const zoneName = zone.name;
  const temp = current.tempF ?? 32;
  const gusts = current.windGustMph ?? 0;

  // ── Alpine/exposed terrain suggestions ──
  if (ALPINE_EXPOSED_IDS.has(zoneId)) {
    suggestions.push({ text: 'Ski crampons for icy alpine terrain', priority: 'essential', category: 'protection', reviewUrl: '/grivel-ski-tour-skimatic-review/' });
    suggestions.push({ text: 'Beacon, probe, and shovel — mandatory in avalanche terrain', priority: 'essential', category: 'safety', reviewUrl: '/best-avalanche-beacons-2026/' });

    if (gusts > 50) {
      suggestions.push({ text: `Summit winds at ${zoneName} regularly exceed 50 mph — full hardshell mandatory`, priority: 'essential', category: 'protection', reviewUrl: '/best-ski-goggles-2026/' });
    } else if (gusts > 30) {
      suggestions.push({ text: 'High winds — hardshell and goggles essential', priority: 'essential', category: 'protection', reviewUrl: '/best-ski-goggles-2026/' });
    }
  }

  // ── CCC trail suggestions ──
  if (CCC_TRAIL_IDS.has(zoneId)) {
    suggestions.push({ text: 'CCC trails have sustained pitch — sharp edges and reliable skins essential', priority: 'essential', category: 'gear', reviewUrl: '/best-climbing-skins-2026/' });
  }

  // ── Gladed terrain suggestions ──
  if (GLADE_IDS.has(zoneId)) {
    suggestions.push({ text: 'Gladed terrain requires good visibility — amber/rose lens goggles recommended', priority: 'recommended', category: 'visibility', reviewUrl: '/best-ski-goggles-2026/' });
    if (temp > 35) {
      suggestions.push({ text: 'Warm temps mean heavy wet snow — wax for wet conditions', priority: 'recommended', category: 'snow', reviewUrl: '/best-climbing-skins-2026/' });
    }
  }

  // ── Long approach suggestions ──
  if (LONG_APPROACH_IDS.has(zoneId)) {
    suggestions.push({ text: 'This is a long approach — carry extra food, headlamp, and emergency shelter', priority: 'essential', category: 'safety', reviewUrl: '/best-headlamps-backcountry-skiing-2026/' });
    suggestions.push({ text: 'Portable charger for long days — keep your phone and GPS alive', priority: 'recommended', category: 'power', reviewUrl: '/best-portable-chargers-backcountry-skiing-2026/' });
  }

  // ── Weather-based suggestions (all zones) ──
  if (temp < -10) {
    suggestions.push({ text: `Extreme cold: ${temp}°F — heavy insulation, face protection, chemical warmers`, priority: 'essential', category: 'warmth', reviewUrl: '/darn-tough-thermolite-rfl-review/' });
  } else if (temp < 10) {
    suggestions.push({ text: `Cold conditions: ${temp}°F — insulated layers and warm socks essential`, priority: 'essential', category: 'warmth', reviewUrl: '/darn-tough-thermolite-rfl-review/' });
  }

  const totalSnow = daily.slice(0, 2).reduce((sum: number, d: any) => sum + (d.totalSnowInches || 0), 0);
  if (totalSnow > 8) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of new snow expected — wider skis and avalanche awareness critical`, priority: 'essential', category: 'snow', reviewUrl: '/best-backcountry-skis-2026/' });
  } else if (totalSnow > 3) {
    suggestions.push({ text: `${Math.round(totalSnow)}" of fresh snow forecast — good powder conditions`, priority: 'recommended', category: 'snow', reviewUrl: '/best-climbing-skins-2026/' });
  }

  // ── Always-include suggestions ──
  suggestions.push({ text: 'Navigation app for backcountry routing', priority: 'recommended', category: 'navigation', reviewUrl: '/best-backcountry-ski-apps-2026/' });

  if (ALPINE_EXPOSED_IDS.has(zoneId)) {
    suggestions.push({ text: 'Check avalanche forecast before heading out', priority: 'essential', category: 'safety', reviewUrl: '/best-avalanche-beacons-2026/' });
  }

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

// Trip assessment for GBA glade zones (no MWAC avalanche data)
function getGladeTripAssessment(current: any, hourly: any[]) {
  const reasons: string[] = [];
  let level = 'good';

  const gusts = current.windGustMph ?? 0;
  const wind = current.windMph ?? 0;
  const temp = current.tempF ?? 32;

  // Check recent snowfall from hourly data (last 24 hours)
  const recentSnow = (hourly || [])
    .slice(0, 24)
    .reduce((sum: number, h: any) => sum + (h.snowInches || 0), 0);

  // Poor conditions
  if (temp < 0 || temp > 40) {
    level = 'poor';
    reasons.push(temp < 0 ? `Very cold: ${temp}°F` : `Warm temps: ${temp}°F — potential for poor snow quality`);
  }
  if (gusts > 35 || wind > 35) {
    level = 'poor';
    reasons.push(`Strong winds: ${wind} mph, gusts ${gusts} mph`);
  }

  // Fair conditions
  if (level === 'good') {
    if (temp < 15 || temp > 35) {
      level = 'fair';
      reasons.push(temp < 15 ? `Cold: ${temp}°F` : `Warm: ${temp}°F`);
    }
    if (gusts > 20 || wind > 20) {
      level = 'fair';
      reasons.push(`Moderate winds: ${wind} mph, gusts ${gusts} mph`);
    }
  }

  // Good conditions boost
  if (level === 'good' && recentSnow > 2) {
    reasons.push(`Recent snowfall: ${Math.round(recentSnow * 10) / 10}" — fresh conditions likely`);
  }

  reasons.push('MWAC avalanche forecast does not cover this zone. Exercise caution above treeline.');

  if (reasons.length === 1) reasons.unshift('Conditions look favorable for glade skiing');

  const labels: Record<string, string> = {
    good: 'Good conditions for glade skiing',
    fair: 'Fair — check details before heading out',
    poor: 'Caution advised — challenging conditions',
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

  const zone = allZones.find((z) => z.id === zoneId);
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

    // Only fetch MWAC forecast for Presidential Range alpine zones
    let mwacForecast = null;
    if (zone.zoneType === 'alpine' && zone.subRegion === 'Presidential Range') {
      try {
        mwacForecast = await getMwacForecast();
      } catch {
        // MWAC fetch failed — continue with null forecast
      }
    }

    let assessment;
    if (zone.zoneType === 'glade') {
      assessment = getGladeTripAssessment(weather.current, weather.hourly);
    } else {
      assessment = getTripAssessment(weather.current, mwacForecast);
    }
    const gearSuggestions = getGearSuggestions(weather.current, weather.daily, zone);

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

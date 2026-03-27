import * as cheerio from 'cheerio';
import type { MwacForecast, DangerRating } from './types';

const MWAC_URL = 'https://mountwashingtonavalanchecenter.org/forecasts/';
const MWAC_DETAIL_URL = 'https://mountwashingtonavalanchecenter.org/forecasts/';

// Map text labels to numeric danger levels
const DANGER_MAP: Record<string, DangerRating> = {
  low: 1,
  moderate: 2,
  considerable: 3,
  high: 4,
  extreme: 5,
};

function unavailableForecast(reason: string): MwacForecast {
  console.warn(`[MWAC] Data unavailable: ${reason}`);
  return {
    fetchedAt: new Date().toISOString(),
    issuedAt: '',
    expiresAt: '',
    dangerLevel: {
      alpine: 1,
      belowTreeline: 1,
      treeline: 1,
    },
    bottomLine:
      'Avalanche forecast data is currently unavailable. Check mountwashingtonavalanchecenter.org directly.',
    problems: [],
    detailUrl: MWAC_DETAIL_URL,
  };
}

export async function fetchMwacForecast(): Promise<MwacForecast> {
  let html: string;

  try {
    const res = await fetch(MWAC_URL, {
      headers: {
        'User-Agent': 'GraniteAlpineLab/1.0 (conditions-monitor)',
      },
    });

    if (!res.ok) {
      return unavailableForecast(`HTTP ${res.status} ${res.statusText}`);
    }

    html = await res.text();
  } catch (err) {
    return unavailableForecast(
      `Fetch failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  try {
    return parseMwacHtml(html);
  } catch (err) {
    return unavailableForecast(
      `Parse failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

function parseDangerFromText(text: string): DangerRating {
  const lower = text.toLowerCase();
  for (const [label, level] of Object.entries(DANGER_MAP)) {
    if (lower.includes(label)) return level;
  }
  return 1; // default to Low if unparseable
}

function parseMwacHtml(html: string): MwacForecast {
  const $ = cheerio.load(html);

  // ─── Danger levels by elevation band ─────────────────────────
  // MWAC typically displays danger for alpine, treeline, and below treeline.
  let alpineDanger: DangerRating = 1;
  let treelineDanger: DangerRating = 1;
  let belowTreelineDanger: DangerRating = 1;

  // Strategy 1: Look for danger-level images with alt text
  const dangerImgs = $('img[alt*="danger" i], img[alt*="Danger" i]');
  if (dangerImgs.length) {
    dangerImgs.each((i, el) => {
      const alt = $(el).attr('alt')?.toLowerCase() || '';
      const danger = parseDangerFromText(alt);
      if (alt.includes('alpine')) {
        alpineDanger = danger;
      } else if (alt.includes('treeline') && !alt.includes('below')) {
        treelineDanger = danger;
      } else if (alt.includes('below')) {
        belowTreelineDanger = danger;
      } else if (i === 0) {
        // If no elevation label, first image is typically alpine
        alpineDanger = danger;
      }
    });
  }

  // Strategy 2: Look for danger text in containers
  const dangerContainers = $(
    '.danger-level, .forecast-danger, [class*="danger"], .avy-danger'
  );
  if (dangerContainers.length && alpineDanger === 1) {
    dangerContainers.each((_, el) => {
      const text = $(el).text().toLowerCase().trim();
      if (!text) return;
      const danger = parseDangerFromText(text);
      if (text.includes('alpine')) {
        alpineDanger = danger;
      } else if (text.includes('treeline') && !text.includes('below')) {
        treelineDanger = danger;
      } else if (text.includes('below')) {
        belowTreelineDanger = danger;
      }
    });
  }

  // Strategy 3: Search headings/strong tags for danger keywords
  if (alpineDanger === 1 && treelineDanger === 1) {
    $('h1, h2, h3, h4, strong, b, .highlight').each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('danger') || text.includes('rating')) {
        const danger = parseDangerFromText(text);
        if (danger > 1) {
          // Apply to all bands if we can't distinguish
          alpineDanger = danger;
          treelineDanger = danger;
          belowTreelineDanger = danger;
          return false; // break
        }
      }
    });
  }

  // ─── Avalanche problems ──────────────────────────────────────
  const problems: MwacForecast['problems'] = [];

  $(
    '.avalanche-problem, .avy-problem, [class*="problem"] li, .problems-list li'
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 300) {
      // Try to parse structured problem data
      const problem = parseProblemText(text);
      if (problem) problems.push(problem);
    }
  });

  // Fallback: look for common problem keywords in the body
  if (problems.length === 0) {
    const bodyText = $('article, .forecast-body, .entry-content, main')
      .first()
      .text()
      .toLowerCase();
    const problemKeywords = [
      'wind slab',
      'storm slab',
      'persistent slab',
      'deep slab',
      'loose wet',
      'loose dry',
      'cornice',
      'glide',
    ];
    for (const keyword of problemKeywords) {
      if (bodyText.includes(keyword)) {
        problems.push({
          type: keyword.replace(/\b\w/g, (c) => c.toUpperCase()),
          aspects: [],
          elevations: [],
          likelihood: 'Unknown',
          size: 'Unknown',
        });
      }
    }
  }

  // ─── Bottom line / travel advice ─────────────────────────────
  let bottomLine = '';

  const bottomLineEl = $(
    '.bottom-line, .travel-advice, [class*="bottom-line"], [class*="travel-advice"]'
  ).first();
  if (bottomLineEl.length) {
    bottomLine = bottomLineEl.text().trim();
  }

  // Fallback: first substantial paragraph
  if (!bottomLine) {
    $('article p, .forecast-body p, .entry-content p, main p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50 && !bottomLine) {
        bottomLine = text.slice(0, 500);
      }
    });
  }

  if (!bottomLine) {
    bottomLine =
      'Check mountwashingtonavalanchecenter.org for current travel advice.';
  }

  // ─── Dates ───────────────────────────────────────────────────
  let issuedAt = '';
  let expiresAt = '';

  const dateEl = $(
    '.forecast-date, .issued-date, time, [class*="issued"], [class*="date"]'
  ).first();
  if (dateEl.length) {
    issuedAt = dateEl.attr('datetime') || dateEl.text().trim().slice(0, 50);
  }

  const expiresEl = $(
    '.expires-date, [class*="expires"], [class*="valid-until"]'
  ).first();
  if (expiresEl.length) {
    expiresAt =
      expiresEl.attr('datetime') || expiresEl.text().trim().slice(0, 50);
  }

  return {
    fetchedAt: new Date().toISOString(),
    issuedAt,
    expiresAt,
    dangerLevel: {
      alpine: alpineDanger,
      treeline: treelineDanger,
      belowTreeline: belowTreelineDanger,
    },
    bottomLine,
    problems,
    detailUrl: MWAC_DETAIL_URL,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────

function parseProblemText(
  text: string
): MwacForecast['problems'][number] | null {
  const lower = text.toLowerCase();
  const knownTypes = [
    'Wind Slab',
    'Storm Slab',
    'Persistent Slab',
    'Deep Slab',
    'Loose Wet',
    'Loose Dry',
    'Cornice',
    'Glide',
  ];

  let type = 'Unknown';
  for (const t of knownTypes) {
    if (lower.includes(t.toLowerCase())) {
      type = t;
      break;
    }
  }

  const aspects: string[] = [];
  const aspectNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  for (const a of aspectNames) {
    // Match standalone cardinal directions
    if (new RegExp(`\\b${a}\\b`).test(text)) {
      aspects.push(a);
    }
  }

  const elevations: string[] = [];
  if (lower.includes('alpine')) elevations.push('Alpine');
  if (lower.includes('treeline') && !lower.includes('below treeline'))
    elevations.push('Treeline');
  if (lower.includes('below treeline')) elevations.push('Below Treeline');

  // Likelihood
  let likelihood = 'Unknown';
  if (lower.includes('likely')) likelihood = 'Likely';
  else if (lower.includes('possible')) likelihood = 'Possible';
  else if (lower.includes('unlikely')) likelihood = 'Unlikely';
  else if (lower.includes('certain')) likelihood = 'Almost Certain';

  // Size
  let size = 'Unknown';
  if (lower.includes('very large') || lower.includes('historic')) size = 'Very Large';
  else if (lower.includes('large')) size = 'Large';
  else if (lower.includes('small')) size = 'Small';

  return { type, aspects, elevations, likelihood, size };
}

import { ImageResponse } from '@vercel/og';
import type { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

export const config = { runtime: 'nodejs' };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { query } = parse(req.url || '', true);

  const title    = String(query.title    || 'Granite Alpine Lab');
  const category = String(query.category || 'Gear Review').toUpperCase();
  const image    = String(query.image    || '');
  const stat1    = String(query.stat1    || '');
  const stat2    = String(query.stat2    || '');
  const stat3    = String(query.stat3    || '');
  const excerpt  = String(query.excerpt  || '').slice(0, 120);

  const hasStats = stat1 || stat2 || stat3;

  const imageResponse = new ImageResponse(
    <div
      style={{
        width: '1000px',
        height: '1500px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1C2B35',
        fontFamily: 'Georgia, serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero photo with overlay */}
      {image && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
        </div>
      )}

      {/* Dark gradient overlay — bottom heavy */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        background: 'linear-gradient(to bottom, rgba(28,43,53,0.3) 0%, rgba(28,43,53,0.6) 40%, rgba(28,43,53,0.95) 70%, #1C2B35 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end',
        padding: '80px 70px',
      }}>
        {/* Category eyebrow */}
        <div style={{
          fontSize: '22px', fontWeight: 700, letterSpacing: '0.2em',
          color: '#C2703E', marginBottom: '24px',
          fontFamily: 'Arial, sans-serif', textTransform: 'uppercase',
        }}>
          {category}
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 50 ? '52px' : '62px',
          fontWeight: 700, color: '#ffffff', lineHeight: 1.15,
          marginBottom: '28px', letterSpacing: '-0.01em',
        }}>
          {title}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <div style={{
            fontSize: '26px', color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.55, marginBottom: '40px',
            fontFamily: 'Arial, sans-serif', fontWeight: 400,
          }}>
            {excerpt}{excerpt.length >= 120 ? '…' : ''}
          </div>
        )}

        {/* Stats bar */}
        {hasStats && (
          <div style={{
            display: 'flex', gap: '0px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px', marginBottom: '48px',
            overflow: 'hidden',
          }}>
            {[stat1, stat2, stat3].filter(Boolean).map((stat, i, arr) => (
              <div key={i} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '28px 20px',
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                fontSize: '28px', fontWeight: 700, color: '#ffffff',
                fontFamily: 'Arial, sans-serif',
              }}>
                {stat}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: '20px', fontWeight: 700, color: '#C2703E',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'Arial, sans-serif',
            }}>
              GRANITE ALPINE LAB
            </div>
            <div style={{
              fontSize: '18px', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Arial, sans-serif', marginTop: '4px',
            }}>
              granitealpinelab.com
            </div>
          </div>

          {/* Research Lab badge */}
          <div style={{
            background: 'rgba(194,112,62,0.15)',
            border: '1px solid rgba(194,112,62,0.4)',
            borderRadius: '6px', padding: '12px 24px',
            fontSize: '18px', fontWeight: 700, color: '#C2703E',
            letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif',
            textTransform: 'uppercase',
          }}>
            Research-Based
          </div>
        </div>
      </div>
    </div>,
    { width: 1000, height: 1500 }
  );

  const arrayBuffer = await imageResponse.arrayBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.end(Buffer.from(arrayBuffer));
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import { createElement as h } from 'react';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const title    = String(req.query.title    || 'Granite Alpine Lab');
  const category = String(req.query.category || 'Gear Review').toUpperCase();
  const image    = String(req.query.image    || '');
  const stat1    = String(req.query.stat1    || '');
  const stat2    = String(req.query.stat2    || '');
  const stat3    = String(req.query.stat3    || '');
  const excerpt  = String(req.query.excerpt  || '').slice(0, 120);
  const stats    = [stat1, stat2, stat3].filter(Boolean);

  const ir = new ImageResponse(
    h('div', {
      style: {
        width: '1000px', height: '1500px', display: 'flex',
        flexDirection: 'column', backgroundColor: '#1C2B35',
        fontFamily: 'Georgia, serif', position: 'relative', overflow: 'hidden',
      }
    },
      // Hero photo
      image && h('img', {
        src: image,
        style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 },
      }),

      // Dark gradient overlay
      h('div', {
        style: {
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex',
          background: 'linear-gradient(to bottom, rgba(28,43,53,0.3) 0%, rgba(28,43,53,0.6) 40%, rgba(28,43,53,0.95) 70%, #1C2B35 100%)',
        }
      }),

      // Content layer
      h('div', {
        style: {
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex',
          flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 70px',
        }
      },
        // Category eyebrow
        h('div', {
          style: {
            fontSize: '22px', fontWeight: 700, letterSpacing: '0.2em',
            color: '#C2703E', marginBottom: '24px',
            fontFamily: 'Arial, sans-serif', textTransform: 'uppercase',
          }
        }, category),

        // Title
        h('div', {
          style: {
            fontSize: title.length > 50 ? '52px' : '62px',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.15,
            marginBottom: '28px', letterSpacing: '-0.01em',
          }
        }, title),

        // Excerpt
        excerpt && h('div', {
          style: {
            fontSize: '26px', color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.55, marginBottom: '40px',
            fontFamily: 'Arial, sans-serif', fontWeight: 400,
          }
        }, excerpt + (excerpt.length >= 120 ? '…' : '')),

        // Stats bar
        stats.length > 0 && h('div', {
          style: {
            display: 'flex', background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px', marginBottom: '48px', overflow: 'hidden',
          }
        },
          ...stats.map((stat, i) =>
            h('div', {
              key: i,
              style: {
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '28px 20px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                fontSize: '30px', fontWeight: 700, color: '#ffffff',
                fontFamily: 'Arial, sans-serif',
              }
            }, stat)
          )
        ),

        // Footer
        h('div', {
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)',
          }
        },
          h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('div', {
              style: {
                fontSize: '20px', fontWeight: 700, color: '#C2703E',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif',
              }
            }, 'GRANITE ALPINE LAB'),
            h('div', {
              style: { fontSize: '18px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Arial, sans-serif', marginTop: '4px' }
            }, 'granitealpinelab.com'),
          ),
          h('div', {
            style: {
              background: 'rgba(194,112,62,0.15)', border: '1px solid rgba(194,112,62,0.4)',
              borderRadius: '6px', padding: '12px 24px',
              fontSize: '18px', fontWeight: 700, color: '#C2703E',
              letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase',
            }
          }, 'Research-Based'),
        ),
      ),
    ),
    { width: 1000, height: 1500 }
  );

  const buf = Buffer.from(await ir.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.end(buf);
}

/**
 * <trading-card> — compact, Pokémon-card-proportioned card face.
 *
 * Pure content/visual component (no hover logic — pair it with
 * <premium-card> for the lift/shadow/sheen interaction).
 *
 * Attributes:
 *   name          card title
 *   subtitle      small line under the title (type / role)
 *   hp            number shown in the HP badge, top right
 *   icon          big emoji shown in the art plate
 *   theme         grass | water | psychic | electric | fire | fighting
 *   level         small pill under the art plate (e.g. "LV 42", "★ RARE")
 *   move1-name / move1-power   first stat row (power 0-100)
 *   move2-name / move2-power   second stat row (power 0-100)
 *   flavor        short flavor-text line at the bottom
 *   footer        small footer strip text (e.g. "TAP TO PLAY")
 *
 * Usage:
 *   <script src="components/trading-card.js" defer></script>
 *   <trading-card theme="grass" name="Harshal Jain" subtitle="All-Rounder"
 *     hp="88" icon="🏏" level="MAN OF THE MATCH"
 *     move1-name="Yorker" move1-power="88"
 *     move2-name="Cover Drive" move2-power="75"
 *     flavor="Genuine pace, late swing, and a bat that finishes games."
 *     footer="Tap to play"></trading-card>
 */
(function () {
  const THEMES = {
    grass:    { accent: '#4dff8a', bg1: '#123522', bg2: '#0c2418', glow: 'rgba(77,255,138,0.45)' },
    water:    { accent: '#4dc9ff', bg1: '#123249', bg2: '#0a1f30', glow: 'rgba(77,201,255,0.45)' },
    psychic:  { accent: '#c48bff', bg1: '#2a1642', bg2: '#180b28', glow: 'rgba(196,139,255,0.45)' },
    electric: { accent: '#ffe066', bg1: '#3a3410', bg2: '#241d08', glow: 'rgba(255,224,102,0.45)' },
    fire:     { accent: '#ff6b4d', bg1: '#3a1610', bg2: '#240b08', glow: 'rgba(255,107,77,0.45)' },
    fighting: { accent: '#ff9a4d', bg1: '#3a2410', bg2: '#241608', glow: 'rgba(255,154,77,0.45)' },
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function moveRow(name, power) {
    if (!name) return '';
    const p = Math.max(0, Math.min(100, Number(power) || 0));
    return `
      <div class="move">
        <div class="move-head">
          <span class="move-name">${escapeHtml(name)}</span>
          <span class="move-power">${p}</span>
        </div>
        <div class="move-track"><div class="move-fill" style="width:${p}%"></div></div>
      </div>
    `;
  }

  class TradingCard extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      this.render();
    }

    render() {
      const theme = THEMES[this.getAttribute('theme')] || THEMES.grass;
      const name = this.getAttribute('name') || 'Unnamed';
      const subtitle = this.getAttribute('subtitle') || '';
      const hp = this.getAttribute('hp') || '';
      const icon = this.getAttribute('icon') || '❔';
      const level = this.getAttribute('level') || '';
      const flavor = this.getAttribute('flavor') || '';
      const footer = this.getAttribute('footer') || '';
      const moves = moveRow(this.getAttribute('move1-name'), this.getAttribute('move1-power'))
                  + moveRow(this.getAttribute('move2-name'), this.getAttribute('move2-power'));

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 260px;
            aspect-ratio: 5 / 7;
            font-family: 'Segoe UI', system-ui, sans-serif;
            color: #eafff2;
          }
          .card {
            position: relative;
            height: 100%;
            border-radius: 18px;
            background: linear-gradient(165deg, ${theme.bg1} 0%, ${theme.bg2} 100%);
            display: flex;
            flex-direction: column;
            padding: 14px 14px 0;
            overflow: hidden;
          }
          .head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 8px;
          }
          .name {
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.2px;
            line-height: 1.15;
          }
          .hp {
            flex: none;
            font-size: 12px;
            font-weight: 800;
            color: ${theme.accent};
            white-space: nowrap;
          }
          .hp b { font-size: 15px; }
          .subtitle {
            margin-top: 2px;
            font-size: 10.5px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: ${theme.accent};
            opacity: 0.85;
          }
          .art {
            margin-top: 10px;
            flex: 1 1 auto;
            min-height: 0;
            border-radius: 12px;
            background: radial-gradient(circle at 35% 30%, ${theme.glow} 0%, transparent 65%), rgba(255,255,255,0.03);
            border: 1px solid ${theme.accent}55;
            box-shadow: inset 0 0 24px ${theme.glow};
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .art .icon {
            font-size: 54px;
            line-height: 1;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
          }
          .level {
            margin-top: 8px;
            align-self: center;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #1a0e00;
            background: linear-gradient(135deg, #ffd76a, #ff9a4d);
            padding: 3px 10px;
            border-radius: 999px;
            white-space: nowrap;
          }
          .level:empty { display: none; }
          .moves {
            margin-top: 10px;
          }
          .move { margin-bottom: 6px; }
          .move-head {
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            font-weight: 700;
            margin-bottom: 3px;
          }
          .move-name { opacity: 0.9; }
          .move-power { color: ${theme.accent}; }
          .move-track {
            height: 5px;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            overflow: hidden;
          }
          .move-fill {
            height: 100%;
            border-radius: 999px;
            background: ${theme.accent};
          }
          .flavor {
            margin-top: 6px;
            font-size: 9.5px;
            font-style: italic;
            line-height: 1.35;
            color: #cfe9da;
            opacity: 0.75;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .footer {
            margin: 8px -14px 0;
            padding: 7px 14px;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-align: center;
            color: ${theme.bg2};
            background: ${theme.accent};
          }
          .footer:empty { display: none; }
        </style>
        <div class="card">
          <div class="head">
            <div class="name">${escapeHtml(name)}</div>
            ${hp ? `<div class="hp"><b>${escapeHtml(hp)}</b> HP</div>` : ''}
          </div>
          ${subtitle ? `<div class="subtitle">${escapeHtml(subtitle)}</div>` : ''}
          <div class="art"><span class="icon">${icon}</span></div>
          <div class="level">${escapeHtml(level)}</div>
          <div class="moves">${moves}</div>
          ${flavor ? `<div class="flavor">${escapeHtml(flavor)}</div>` : ''}
          <div class="footer">${escapeHtml(footer)}</div>
        </div>
      `;
    }
  }

  customElements.define('trading-card', TradingCard);
})();

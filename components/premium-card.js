/**
 * <premium-card> — reusable trading-card-style hover shell.
 *
 * Wrap any card markup with it to get a cursor-driven tilt (the card
 * leans toward the point under the cursor, like it's being gently
 * pressed there), a soft/deep hover shadow, a foil border that
 * subtly brightens, and a circular glare that follows the cursor
 * around the surface. Everything eases smoothly and resets on
 * pointer leave — no continuous/idle animation.
 *
 * Usage:
 *   <script src="components/premium-card.js" defer></script>
 *   <premium-card>
 *     ...your existing card markup/styles, untouched...
 *   </premium-card>
 */
(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        display: block;
        --pc-radius: 24px;
        --pc-border: 3px;
        --mx: 50%;
        --my: 50%;
        --rx: 0deg;
        --ry: 0deg;
        perspective: 1000px;
      }

      .frame {
        position: relative;
        border-radius: var(--pc-radius);
        padding: var(--pc-border);
        background: linear-gradient(120deg,
          #d9b76a 0%, #fff4d6 16%, #d9b76a 32%,
          #7dffa8 50%, #4dc9ff 68%,
          #d9b76a 84%, #fff4d6 100%);
        background-size: 260% 260%;
        background-position: 0% 50%;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.45),
          0 2px 6px rgba(0, 0, 0, 0.3);
        transform: translateY(0) rotateX(var(--ry)) rotateY(var(--rx));
        transform-style: preserve-3d;
        transition:
          transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
          background-position 0.9s ease;
      }

      :host(:hover) .frame {
        transform: translateY(-8px) rotateX(var(--ry)) rotateY(var(--rx));
        box-shadow:
          0 34px 60px -12px rgba(0, 0, 0, 0.55),
          0 12px 28px rgba(0, 0, 0, 0.35);
        background-position: 100% 50%;
      }

      .inner {
        position: relative;
        border-radius: calc(var(--pc-radius) - var(--pc-border));
        overflow: hidden;
      }

      .glare {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at var(--mx) var(--my),
          transparent 0%,
          transparent 9%,
          rgba(255, 255, 255, 0.95) 15%,
          rgba(255, 255, 255, 0.55) 21%,
          transparent 33%);
        opacity: 0;
        transition: opacity 0.35s ease;
        mix-blend-mode: soft-light;
        pointer-events: none;
      }

      :host(:hover) .glare {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        .frame, .glare { transition: none; }
        :host(:hover) .frame { transform: none; }
      }
    </style>
    <div class="frame">
      <div class="inner">
        <slot></slot>
        <span class="glare" aria-hidden="true"></span>
      </div>
    </div>
  `;

  const MAX_TILT_DEG = 10;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class PremiumCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
      this._onPointerMove = this._onPointerMove.bind(this);
      this._onPointerLeave = this._onPointerLeave.bind(this);
    }

    connectedCallback() {
      if (reduceMotion) return;
      this.addEventListener('pointermove', this._onPointerMove);
      this.addEventListener('pointerleave', this._onPointerLeave);
    }

    disconnectedCallback() {
      this.removeEventListener('pointermove', this._onPointerMove);
      this.removeEventListener('pointerleave', this._onPointerLeave);
    }

    _onPointerMove(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const clampedX = Math.min(1, Math.max(0, x));
      const clampedY = Math.min(1, Math.max(0, y));

      this.style.setProperty('--mx', (clampedX * 100).toFixed(2) + '%');
      this.style.setProperty('--my', (clampedY * 100).toFixed(2) + '%');
      this.style.setProperty('--rx', ((clampedX - 0.5) * 2 * MAX_TILT_DEG).toFixed(2) + 'deg');
      this.style.setProperty('--ry', (-(clampedY - 0.5) * 2 * MAX_TILT_DEG).toFixed(2) + 'deg');
    }

    _onPointerLeave() {
      this.style.setProperty('--mx', '50%');
      this.style.setProperty('--my', '50%');
      this.style.setProperty('--rx', '0deg');
      this.style.setProperty('--ry', '0deg');
    }
  }

  customElements.define('premium-card', PremiumCard);
})();

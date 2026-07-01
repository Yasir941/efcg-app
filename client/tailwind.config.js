/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ─── Core Backgrounds ─── */
        darkBg:       '#070B14',
        cardBg:       '#0D1525',
        surfaceBg:    '#111B2E',
        borderColor:  '#1A2740',

        /* ─── Logo-derived palette ─── */
        primaryAccent:   '#6F3BFD',    /* Vivid Purple  */
        primaryDark:     '#5B2ED4',    /* Deeper Purple */
        secondaryAccent: '#07E0B0',    /* Emerald Teal  */
        coralAccent:     '#FB315D',    /* Coral Red     */
        goldAccent:      '#FFC228',    /* Rich Gold     */

        /* ─── Semantic Colors ─── */
        successColor: '#07E0B0',
        errorColor:   '#FB315D',
        warningColor: '#FFC228',

        /* ─── Text Hierarchy ─── */
        textPrimary:  '#F1F5F9',
        textSecondary:'#94A3B8',
        textMuted:    '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        glow:       '0 0 20px rgba(111, 59, 253, 0.15)',
        'glow-teal':'0 0 20px rgba(7, 224, 176, 0.12)',
        'glow-gold':'0 0 20px rgba(255, 194, 40, 0.10)',
        card:       '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover':'0 8px 40px rgba(111, 59, 253, 0.12)',
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #6F3BFD, #07E0B0)',
        'gradient-hero':    'linear-gradient(135deg, #6F3BFD 0%, #FB315D 50%, #FFC228 100%)',
        'gradient-card':    'linear-gradient(145deg, #0D1525, #111B2E)',
        'gradient-surface': 'linear-gradient(180deg, rgba(111,59,253,0.05) 0%, transparent 100%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up':     'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in':    'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':    'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'gradient':    'gradientShift 4s ease infinite',
        'shimmer':     'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(111, 59, 253, 0.15)' },
          '50%':      { boxShadow: '0 0 30px rgba(111, 59, 253, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}

import { brand } from '../theme'

type LogoProps = {
  /** Mostra o wordmark ao lado do emblema. */
  showText?: boolean
}

/**
 * Aproximação do logo Contato Seguro — Canal de Denúncias.
 * Emblema (dois chevrons sobrepostos) + wordmark.
 */
export default function Logo({ showText = true }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden>
        <path d="M24 6 L42 40 H30 L24 27 L18 40 H6 Z" fill={brand.primary} />
        <path d="M24 16 L34 40 H26 L24 34 L22 40 H14 Z" fill="#5b8def" />
      </svg>
      {showText && (
        <div style={{ lineHeight: 1.05 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: brand.primary,
              letterSpacing: '-0.2px',
            }}
          >
            Contato
            <br />
            Seguro
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '1.5px',
              color: brand.primary,
              marginTop: 3,
            }}
          >
            CANAL DE DENÚNCIAS
          </div>
        </div>
      )}
    </div>
  )
}

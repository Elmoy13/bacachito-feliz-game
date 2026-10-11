import React, { forwardRef } from 'react';
import { Challenge } from '@/types/game';
import {
  sanitizeTextForShare,
  getShareableGradient,
  getShareableBadgeText,
  getCardTypeEmoji,
} from '@/utils/shareUtils';
import { getPrefieresRuleText } from '@/utils/prefieres';

interface ShareableCardProps {
  challenge: Challenge;
  processedText: string;
}

/**
 * Offscreen component rendered at 1080x1920 (9:16 story ratio).
 * Captured by html-to-image to produce a shareable PNG.
 * Never visible to the user directly.
 */
const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ challenge, processedText }, ref) => {
    const gradient = getShareableGradient(challenge.type, challenge.isExtreme, challenge.isPower);
    const badge = getShareableBadgeText(challenge.type, challenge.isExtreme, challenge.isPower);
    const emoji = getCardTypeEmoji(challenge.type, challenge.isExtreme, challenge.isPower);

    // Sanitize: replace player names with generic text
    const safeText = sanitizeTextForShare(processedText);
    const safeSubtitle = challenge.subtitle
      ? sanitizeTextForShare(challenge.subtitle)
      : null;

    // "¿Qué prefieres?": processedText = "Título\n👍 A\n👎 B"
    const isPrefieres = challenge.type === 'prefieres';
    const [prefieresTitle, ...prefieresOptions] = isPrefieres ? safeText.split('\n') : [];

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: -9999,
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <div
          ref={ref}
          style={{
            width: '1080px',
            height: '1920px',
            background: gradient,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 60px',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            color: '#ffffff',
            overflow: 'hidden',
          }}
        >
        {/* Decorative emoji top-left */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            fontSize: '64px',
            opacity: 0.15,
          }}
        >
          {emoji}
        </div>

        {/* Decorative emoji top-right */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '80px',
            fontSize: '64px',
            opacity: 0.15,
          }}
        >
          {emoji}
        </div>

        {/* Decorative emoji bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '300px',
            left: '80px',
            fontSize: '64px',
            opacity: 0.1,
          }}
        >
          {emoji}
        </div>

        {/* Decorative emoji bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '300px',
            right: '80px',
            fontSize: '64px',
            opacity: 0.1,
          }}
        >
          {emoji}
        </div>

        {/* Badge */}
        {badge && (
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '9999px',
              padding: '12px 32px',
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '60px',
            }}
          >
            {emoji} {badge}
          </div>
        )}

        {/* "¿Qué prefieres?": título + opciones + regla */}
        {isPrefieres && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '36px',
              width: '100%',
              maxWidth: '900px',
            }}
          >
            <div style={{ fontSize: '64px', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 }}>
              {prefieresTitle}
            </div>
            {prefieresOptions.map((option, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.18)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderRadius: '40px',
                  padding: '40px 48px',
                  fontSize: '52px',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  textAlign: 'left',
                  wordBreak: 'break-word',
                }}
              >
                {option}
              </div>
            ))}
            <div style={{ fontSize: '34px', fontWeight: 600, opacity: 0.9, textAlign: 'center' }}>
              {getPrefieresRuleText(challenge.sips)}
            </div>
          </div>
        )}

        {/* Main challenge text */}
        {!isPrefieres && (
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
            wordBreak: 'break-word',
          }}
        >
          {safeText}
        </div>
        )}

        {/* Subtitle */}
        {safeSubtitle && (
          <div
            style={{
              fontSize: '36px',
              fontWeight: 500,
              textAlign: 'center',
              opacity: 0.85,
              marginTop: '40px',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            {safeSubtitle}
          </div>
        )}

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6,
          }}
        >
          <div
            style={{
              fontSize: '40px',
              fontWeight: 900,
              letterSpacing: '2px',
            }}
          >
            🍾 BACACHITO FELIZ
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            @bacachitofeliz
          </div>
        </div>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = 'ShareableCard';

export default ShareableCard;

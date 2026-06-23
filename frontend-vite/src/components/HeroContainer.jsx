import React from 'react';

/**
 * Premium Hero Container Layout System.
 * Implements the exact specifications for padding system, margins, spacing, and layout proportions.
 * 
 * Reusable Component Structure:
 * <HeroContainer>
 *   <HeroContent> ... </HeroContent>
 *   <HeroMedia> ... </HeroMedia>
 *   <HeroFeatures> ... </HeroFeatures>
 *   <HeroFloatingCard> ... </HeroFloatingCard>
 * </HeroContainer>
 */

// Stylesheet injected once in the document head
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'premium-hero-container-styles';
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.innerHTML = `
    /* Outer layout page padding wrapper */
    .premium-hero-page-wrapper {
      background-color: #F5F3EF;
      padding: 12px;
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 1200px) {
      .premium-hero-page-wrapper {
        padding: 10px;
      }
    }

    @media (max-width: 768px) {
      .premium-hero-page-wrapper {
        padding: 8px;
      }
    }

    /* Hero container styling */
    .premium-hero-container {
      width: 100%;
      height: calc(100vh - 24px);
      min-height: 850px;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      display: grid;
      grid-template-columns: 50% 50%;
      background: #0A0A0A;
      box-sizing: border-box;
      padding: 48px 40px;
    }

    /* Left column style */
    .premium-hero-left-col {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      position: relative;
      z-index: 2;
    }

    .premium-hero-content-wrapper {
      max-width: 620px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
    }

    /* Vertical spacing rules inside left column content wrapper */
    .premium-hero-content-wrapper > .premium-hero-label {
      margin-bottom: 24px;
    }

    .premium-hero-content-wrapper > .premium-hero-heading {
      max-width: 560px;
      width: 100%;
      margin: 0 0 24px 0;
    }

    .premium-hero-content-wrapper > .premium-hero-description {
      margin: 0 0 32px 0;
    }

    .premium-hero-content-wrapper > .premium-hero-buttons {
      margin-bottom: 120px;
    }

    /* Button row spacing */
    .premium-hero-buttons {
      display: flex;
      gap: 16px;
    }

    .premium-hero-btn {
      height: 56px;
      border-radius: 999px;
      padding: 0 32px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      cursor: pointer;
      box-sizing: border-box;
      text-decoration: none;
    }

    /* Bottom feature bar */
    .premium-hero-features-bar {
      position: absolute;
      bottom: 40px;
      left: 40px;
      display: flex;
      gap: 48px;
      z-index: 10;
      box-sizing: border-box;
    }

    /* Right media column style */
    .premium-hero-right-col {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      box-sizing: border-box;
    }

    .premium-hero-media-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .premium-hero-media-wrapper img,
    .premium-hero-media-wrapper video,
    .premium-hero-media-wrapper svg {
      width: 100%;
      height: 100%;
      max-width: 100%;
      object-fit: cover;
      border-radius: 16px;
    }

    /* Floating card */
    .premium-hero-floating-card {
      position: absolute;
      bottom: 32px;
      right: 32px;
      height: 52px;
      border-radius: 999px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      box-sizing: border-box;
    }

    /* Responsive styles below 1200px (Tablet) */
    @media (max-width: 1200px) {
      .premium-hero-container {
        grid-template-columns: 1fr;
        height: auto;
        min-height: 100vh;
        padding: 48px 40px;
      }
      
      .premium-hero-left-col {
        order: 1; /* Text first */
        height: auto;
      }
      
      .premium-hero-right-col {
        order: 2; /* Image second */
        height: auto;
        margin-top: 40px;
      }

      .premium-hero-content-wrapper > .premium-hero-buttons {
        margin-bottom: 40px; /* Shorter spacing since features shift to flow instead of absolute positioning */
      }

      .premium-hero-features-bar {
        position: static;
        margin-top: 40px;
        order: 3;
      }

      .premium-hero-floating-card {
        position: static;
        margin-top: 32px;
        width: fit-content;
        order: 4;
      }
    }

    /* Responsive styles below 768px (Mobile) */
    @media (max-width: 768px) {
      .premium-hero-container {
        padding: 24px;
      }

      .premium-hero-content-wrapper {
        max-width: 100%;
      }

      .premium-hero-heading {
        font-size: clamp(48px, 10vw, 72px) !important;
        max-width: 100%;
      }

      .premium-hero-buttons {
        flex-direction: column;
        width: 100%;
        gap: 12px;
      }

      .premium-hero-btn {
        width: 100%;
      }

      .premium-hero-features-bar {
        flex-direction: column;
        gap: 20px;
      }

      .premium-hero-media-wrapper img,
      .premium-hero-media-wrapper video,
      .premium-hero-media-wrapper svg {
        width: 90%;
      }
    }
  `;
  document.head.appendChild(styleElement);
};

// 1. Root Container Component
export const HeroContainer = ({ children, backgroundStyle = {}, className = '' }) => {
  React.useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div className="premium-hero-page-wrapper">
      <div 
        className={`premium-hero-container ${className}`}
        style={backgroundStyle}
      >
        {children}
      </div>
    </div>
  );
};

// 2. Left Column Content Component
export const HeroContent = ({ children, className = '' }) => {
  return (
    <div className={`premium-hero-left-col ${className}`}>
      <div className="premium-hero-content-wrapper">
        {children}
      </div>
    </div>
  );
};

// 3. Right Column Media Component
export const HeroMedia = ({ children, className = '' }) => {
  return (
    <div className={`premium-hero-right-col ${className}`}>
      <div className="premium-hero-media-wrapper">
        {children}
      </div>
    </div>
  );
};

// 4. Bottom Features Component
export const HeroFeatures = ({ children, className = '' }) => {
  return (
    <div className={`premium-hero-features-bar ${className}`}>
      {children}
    </div>
  );
};

// 5. Floating Card Component
export const HeroFloatingCard = ({ children, className = '' }) => {
  return (
    <div className={`premium-hero-floating-card ${className}`}>
      {children}
    </div>
  );
};

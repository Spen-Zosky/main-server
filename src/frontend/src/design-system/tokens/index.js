/**
 * Design Tokens Index - Main Server Platform
 * Central export for all design tokens with organized access patterns
 */

// Import all generated tokens
import * as tokens from './build/js/tokens.js';

// Color tokens organized by category
export const colors = {
  // Brand colors
  brand: {
    primary: tokens.ColorBrandPrimary,
    secondary: tokens.ColorBrandSecondary,
    accent: tokens.ColorBrandAccent,
  },
  
  // Module-specific colors
  modules: {
    ai: {
      primary: tokens.ColorModulesAiPrimary,
      light: tokens.ColorModulesAiLight,
      dark: tokens.ColorModulesAiDark,
      gradient: tokens.ColorModulesAiGradient,
    },
    nose: {
      primary: tokens.ColorModulesNosePrimary,
      light: tokens.ColorModulesNoseLight,
      dark: tokens.ColorModulesNoseDark,
      gradient: tokens.ColorModulesNoseGradient,
    },
    hunter: {
      primary: tokens.ColorModulesHunterPrimary,
      light: tokens.ColorModulesHunterLight,
      dark: tokens.ColorModulesHunterDark,
      gradient: tokens.ColorModulesHunterGradient,
    },
  },
  
  // Semantic colors
  semantic: {
    success: tokens.ColorSemanticSuccess,
    warning: tokens.ColorSemanticWarning,
    error: tokens.ColorSemanticError,
    info: tokens.ColorSemanticInfo,
  },
  
  // Neutral colors
  neutral: {
    50: tokens.ColorNeutral50,
    100: tokens.ColorNeutral100,
    200: tokens.ColorNeutral200,
    300: tokens.ColorNeutral300,
    400: tokens.ColorNeutral400,
    500: tokens.ColorNeutral500,
    600: tokens.ColorNeutral600,
    700: tokens.ColorNeutral700,
    800: tokens.ColorNeutral800,
    900: tokens.ColorNeutral900,
  },
  
  // Surface colors (theme-aware)
  surface: {
    background: {
      light: tokens.ColorSurfaceBackgroundLight,
      dark: tokens.ColorSurfaceBackgroundDark,
    },
    paper: {
      light: tokens.ColorSurfacePaperLight,
      dark: tokens.ColorSurfacePaperDark,
    },
    overlay: {
      light: tokens.ColorSurfaceOverlayLight,
      dark: tokens.ColorSurfaceOverlayDark,
    },
  },
  
  // Text colors (theme-aware)
  text: {
    primary: {
      light: tokens.ColorTextPrimaryLight,
      dark: tokens.ColorTextPrimaryDark,
    },
    secondary: {
      light: tokens.ColorTextSecondaryLight,
      dark: tokens.ColorTextSecondaryDark,
    },
    disabled: {
      light: tokens.ColorTextDisabledLight,
      dark: tokens.ColorTextDisabledDark,
    },
  },
};

// Spacing tokens
export const spacing = {
  scale: {
    0: tokens.SpacingScale0,
    1: tokens.SpacingScale1,
    2: tokens.SpacingScale2,
    3: tokens.SpacingScale3,
    4: tokens.SpacingScale4,
    5: tokens.SpacingScale5,
    6: tokens.SpacingScale6,
    8: tokens.SpacingScale8,
    10: tokens.SpacingScale10,
    12: tokens.SpacingScale12,
    16: tokens.SpacingScale16,
    20: tokens.SpacingScale20,
    24: tokens.SpacingScale24,
    32: tokens.SpacingScale32,
  },
  semantic: {
    component: {
      padding: {
        sm: tokens.SpacingSemanticComponentPaddingSm,
        md: tokens.SpacingSemanticComponentPaddingMd,
        lg: tokens.SpacingSemanticComponentPaddingLg,
        xl: tokens.SpacingSemanticComponentPaddingXl,
      },
      margin: {
        sm: tokens.SpacingSemanticComponentMarginSm,
        md: tokens.SpacingSemanticComponentMarginMd,
        lg: tokens.SpacingSemanticComponentMarginLg,
        xl: tokens.SpacingSemanticComponentMarginXl,
      },
    },
    layout: {
      container: {
        sm: tokens.SpacingSemanticLayoutContainerSm,
        md: tokens.SpacingSemanticLayoutContainerMd,
        lg: tokens.SpacingSemanticLayoutContainerLg,
        xl: tokens.SpacingSemanticLayoutContainerXl,
      },
      section: {
        sm: tokens.SpacingSemanticLayoutSectionSm,
        md: tokens.SpacingSemanticLayoutSectionMd,
        lg: tokens.SpacingSemanticLayoutSectionLg,
        xl: tokens.SpacingSemanticLayoutSectionXl,
      },
    },
    grid: {
      gap: {
        sm: tokens.SpacingSemanticGridGapSm,
        md: tokens.SpacingSemanticGridGapMd,
        lg: tokens.SpacingSemanticGridGapLg,
        xl: tokens.SpacingSemanticGridGapXl,
      },
    },
  },
};

// Typography tokens
export const typography = {
  fonts: {
    primary: tokens.TypographyFontsPrimary,
    secondary: tokens.TypographyFontsSecondary,
    monospace: tokens.TypographyFontsMonospace,
  },
  fontWeights: {
    light: tokens.TypographyFontWeightsLight,
    regular: tokens.TypographyFontWeightsRegular,
    medium: tokens.TypographyFontWeightsMedium,
    semiBold: tokens.TypographyFontWeightsSemiBold,
    bold: tokens.TypographyFontWeightsBold,
    extraBold: tokens.TypographyFontWeightsExtraBold,
  },
  fontSizes: {
    xs: tokens.TypographyFontSizesXs,
    sm: tokens.TypographyFontSizesSm,
    base: tokens.TypographyFontSizesBase,
    lg: tokens.TypographyFontSizesLg,
    xl: tokens.TypographyFontSizesXl,
    '2xl': tokens.TypographyFontSizes2xl,
    '3xl': tokens.TypographyFontSizes3xl,
    '4xl': tokens.TypographyFontSizes4xl,
    '5xl': tokens.TypographyFontSizes5xl,
    '6xl': tokens.TypographyFontSizes6xl,
  },
  lineHeights: {
    tight: tokens.TypographyLineHeightsTight,
    snug: tokens.TypographyLineHeightsSnug,
    normal: tokens.TypographyLineHeightsNormal,
    relaxed: tokens.TypographyLineHeightsRelaxed,
    loose: tokens.TypographyLineHeightsLoose,
  },
  textStyles: {
    display: {
      fontSize: tokens.TypographyTextStylesDisplayFontSize,
      fontWeight: tokens.TypographyTextStylesDisplayFontWeight,
      lineHeight: tokens.TypographyTextStylesDisplayLineHeight,
      letterSpacing: tokens.TypographyTextStylesDisplayLetterSpacing,
      fontFamily: tokens.TypographyTextStylesDisplayFontFamily,
    },
    h1: {
      fontSize: tokens.TypographyTextStylesH1FontSize,
      fontWeight: tokens.TypographyTextStylesH1FontWeight,
      lineHeight: tokens.TypographyTextStylesH1LineHeight,
      letterSpacing: tokens.TypographyTextStylesH1LetterSpacing,
      fontFamily: tokens.TypographyTextStylesH1FontFamily,
    },
    h2: {
      fontSize: tokens.TypographyTextStylesH2FontSize,
      fontWeight: tokens.TypographyTextStylesH2FontWeight,
      lineHeight: tokens.TypographyTextStylesH2LineHeight,
      fontFamily: tokens.TypographyTextStylesH2FontFamily,
    },
    h3: {
      fontSize: tokens.TypographyTextStylesH3FontSize,
      fontWeight: tokens.TypographyTextStylesH3FontWeight,
      lineHeight: tokens.TypographyTextStylesH3LineHeight,
      fontFamily: tokens.TypographyTextStylesH3FontFamily,
    },
    h4: {
      fontSize: tokens.TypographyTextStylesH4FontSize,
      fontWeight: tokens.TypographyTextStylesH4FontWeight,
      lineHeight: tokens.TypographyTextStylesH4LineHeight,
      fontFamily: tokens.TypographyTextStylesH4FontFamily,
    },
    body: {
      fontSize: tokens.TypographyTextStylesBodyFontSize,
      fontWeight: tokens.TypographyTextStylesBodyFontWeight,
      lineHeight: tokens.TypographyTextStylesBodyLineHeight,
      fontFamily: tokens.TypographyTextStylesBodyFontFamily,
    },
    bodyLarge: {
      fontSize: tokens.TypographyTextStylesBodyLargeFontSize,
      fontWeight: tokens.TypographyTextStylesBodyLargeFontWeight,
      lineHeight: tokens.TypographyTextStylesBodyLargeLineHeight,
      fontFamily: tokens.TypographyTextStylesBodyLargeFontFamily,
    },
    caption: {
      fontSize: tokens.TypographyTextStylesCaptionFontSize,
      fontWeight: tokens.TypographyTextStylesCaptionFontWeight,
      lineHeight: tokens.TypographyTextStylesCaptionLineHeight,
      fontFamily: tokens.TypographyTextStylesCaptionFontFamily,
    },
    code: {
      fontSize: tokens.TypographyTextStylesCodeFontSize,
      fontWeight: tokens.TypographyTextStylesCodeFontWeight,
      lineHeight: tokens.TypographyTextStylesCodeLineHeight,
      fontFamily: tokens.TypographyTextStylesCodeFontFamily,
    },
  },
};

// Border radius tokens
export const borderRadius = {
  none: tokens.BorderRadiusNone,
  sm: tokens.BorderRadiusSm,
  base: tokens.BorderRadiusBase,
  md: tokens.BorderRadiusMd,
  lg: tokens.BorderRadiusLg,
  xl: tokens.BorderRadiusXl,
  '2xl': tokens.BorderRadius2xl,
  '3xl': tokens.BorderRadius3xl,
  full: tokens.BorderRadiusFull,
};

// Shadow tokens
export const shadows = {
  none: tokens.ShadowsNone,
  sm: tokens.ShadowsSm,
  base: tokens.ShadowsBase,
  md: tokens.ShadowsMd,
  lg: tokens.ShadowsLg,
  xl: tokens.ShadowsXl,
  '2xl': tokens.Shadows2xl,
};

// Export all tokens as a single object for convenience
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

// Default export
export default designTokens;
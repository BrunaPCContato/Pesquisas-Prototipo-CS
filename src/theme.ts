import type { ThemeConfig } from 'antd'

/**
 * Tokens da marca Contato Seguro (DS CS — Ant Design System for Figma 5.24).
 * Fonte de verdade: token `Colors/Brand/Primary/colorPrimary` = #263072.
 */
export const csTheme: ThemeConfig = {
  token: {
    colorPrimary: '#263072',
    colorInfo: '#263072',
    fontFamily:
      "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
    colorTextHeading: '#263072',
    colorText: '#1f1f2e',
    colorTextSecondary: '#8c8c99',
    colorBgLayout: '#f4f4f5',
    colorBorderSecondary: '#efefef',
    controlHeight: 40,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f4f4f5',
      headerHeight: 72,
    },
    Menu: {
      itemSelectedBg: '#eef0f8',
      itemSelectedColor: '#263072',
      itemColor: '#5b5b6b',
      itemHeight: 46,
      itemBorderRadius: 8,
      iconSize: 18,
      fontSize: 15,
      itemMarginBlock: 4,
    },
    Card: {
      borderRadiusLG: 12,
      headerFontSize: 16,
      colorBorderSecondary: '#efefef',
      paddingLG: 24,
    },
    Button: {
      controlHeight: 40,
      fontWeight: 500,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Tabs: {
      titleFontSize: 16,
      inkBarColor: '#263072',
      itemSelectedColor: '#263072',
    },
    Statistic: {
      contentFontSize: 40,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#263072',
      borderColor: '#efefef',
      headerSplitColor: 'transparent',
    },
    Steps: {
      colorPrimary: '#263072',
    },
  },
}

export const brand = {
  primary: '#263072',
  textMuted: '#8c8c99',
  success: '#52c41a',
  successBg: '#e8f8ea',
  infoBg: '#e6effc',
  warning: '#faad14',
  warningBg: '#fff7e6',
  cardBg: '#fafafa',
  chartBar: '#5cb8e6',
  dimension: '#3ea3d6',
  danger: '#ff4d4f',
}

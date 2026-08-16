const tintColorLight = '#047857'; // Emerald Green
const tintColorDark = '#10B981'; // Mint Green

export const Colors = {
  light: {
    primary: tintColorLight,
    secondary: '#059669',
    background: '#F3F4F6',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: tintColorDark,
    secondary: '#059669',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    error: '#F87171',
    success: '#34D399',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
  },
  
  // Status colors (keep these constant or slightly adjust for contrast if needed)
  status: {
    novo: '#F59E0B', // Amber
    u_obradi: '#3B82F6', // Blue
    rijeseno: '#10B981', // Emerald
  }
};

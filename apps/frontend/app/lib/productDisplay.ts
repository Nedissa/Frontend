export const PRODUCT_IMAGE_BG = '#eef1f4';

export const COLOR_HEX_MAP: Record<string, string> = {
  'svart': '#000000', 'black': '#000000',
  'vit': '#FFFFFF', 'white': '#FFFFFF',
  'silver': '#C0C0C0', 'grå': '#808080', 'gray': '#808080', 'grey': '#808080',
  'röd': '#EF4444', 'red': '#EF4444',
  'blå': '#3B82F6', 'blue': '#3B82F6',
  'grön': '#22C55E', 'green': '#22C55E',
  'gul': '#EAB308', 'yellow': '#EAB308',
};

const COLOR_ORDER = ['röd', 'red', 'blå', 'blue', 'grön', 'green', 'gul', 'yellow', 'silver', 'grå', 'gray', 'grey', 'svart', 'black', 'vit', 'white'];

export function sortColors(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const ai = COLOR_ORDER.indexOf(a.toLowerCase());
    const bi = COLOR_ORDER.indexOf(b.toLowerCase());
    return (ai === -1 ? COLOR_ORDER.length : ai) - (bi === -1 ? COLOR_ORDER.length : bi);
  });
}

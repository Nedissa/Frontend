declare global {
  interface Window {
    klaviyo?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function klaviyoTrack(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.klaviyo) return;
  window.klaviyo.track(event, properties);
}

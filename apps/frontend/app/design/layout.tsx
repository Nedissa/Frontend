export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {children}
    </div>
  );
}

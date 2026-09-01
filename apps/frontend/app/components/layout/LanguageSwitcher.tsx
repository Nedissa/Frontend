const SwedenFlag = () => (
  <svg className="w-6 h-[18px]" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="16" fill="#006AA7"/>
    <rect width="24" height="4" y="6" fill="#FFCD00"/>
    <rect width="4" height="16" x="5" fill="#FFCD00"/>
    <rect width="24" height="16" fill="none" stroke="#333" strokeWidth="0.5"/>
  </svg>
);

export function LanguageSwitcher() {
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-gray-700" style={{ minWidth: '48px' }}>
      <SwedenFlag />
      SV
    </div>
  );
}

export default function AccountLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-20 bg-gray-200 rounded mb-3" />
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

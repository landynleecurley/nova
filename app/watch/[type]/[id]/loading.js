// Shown while the watch page's server component fetches the title.
export default function WatchLoading() {
  return (
    <div className="fixed inset-0 z-[70] bg-nova-dark overflow-hidden">
      <div className="absolute inset-0 skeleton-shimmer" />

      {/* Top bar skeleton */}
      <div className="absolute inset-x-0 top-0 px-4 md:px-8 pt-4 flex items-center gap-4">
        <div className="w-16 h-5 rounded bg-white/10 animate-pulse" />
        <div className="w-40 h-5 rounded bg-white/10 animate-pulse" />
      </div>

      {/* Centered spinner */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-14 h-14 rounded-full border-4 border-white/15 border-t-nova-pink animate-spin" />
      </div>

      {/* Control bar skeleton */}
      <div className="absolute inset-x-0 bottom-0 px-4 md:px-8 pb-6 pt-16">
        <div className="h-1.5 rounded-full bg-white/10 mb-4 animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
          <div className="w-16 h-4 rounded bg-white/10 animate-pulse" />
          <div className="ml-auto w-6 h-6 rounded-full bg-white/10 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

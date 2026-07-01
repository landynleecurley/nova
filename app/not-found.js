import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-nova-pink text-5xl md:text-7xl leading-none">✦</span>
        <span className="nova-wordmark font-black text-7xl md:text-9xl tracking-tighter">nova</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-black mb-3">Keep Streaming</h1>
      <p className="text-nova-gray max-w-md mb-8">
        We can’t find the page you’re looking for. It may have moved, or the title is no
        longer available. Let’s get you back to something to watch.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-nova-pink hover:bg-white text-nova-dark font-bold px-8 py-3 rounded-full transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/browse"
          className="bg-white/15 hover:bg-white/25 backdrop-blur font-bold px-8 py-3 rounded-full transition-colors"
        >
          Browse All
        </Link>
      </div>
      <p className="mt-10 text-white/30 text-sm">Error 404 — Page not found</p>
    </div>
  );
}

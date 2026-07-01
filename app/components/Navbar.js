"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./useProfile";
import ProfileSwitcher from "./ProfileSwitcher";
import { IconUser, IconBookmark, IconUsers, IconHelp, IconPower, IconChevronDown, IconMenu, IconX } from "./icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "TV", href: "/browse?type=tv" },
  { label: "Movies", href: "/browse?type=movie" },
  { label: "Sports", href: "/browse?type=tv" },
  { label: "News", href: "/browse?type=tv" },
];

const USER_EMAIL = "landyn.curley@students.maestrocollege.edu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile] = useProfile();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const boxRef = useRef(null);
  const accountRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on any outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced live search — fires ~250ms after the user stops typing.
  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch (e) {
        if (e.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  function submit(e) {
    e.preventDefault();
    if (q.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  function goTo(item) {
    setOpen(false);
    setQ("");
    router.push(`/${item.type}/${item.id}`);
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-nova-dark/95 backdrop-blur shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="flex items-center gap-3 md:gap-6 px-4 md:px-12 h-16">
        <Link href="/" className="flex items-center gap-1.5 select-none shrink-0">
          <span className="text-nova-pink text-xl md:text-2xl leading-none">✦</span>
          <span className="nova-wordmark font-black text-2xl md:text-3xl tracking-tighter">nova</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/90">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="hover:text-nova-pink transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:gap-4 min-w-0 flex-1 md:flex-none justify-end">
          <form onSubmit={submit} className="relative flex-1 md:flex-none min-w-0 max-w-xs">
          <div ref={boxRef} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => results.length && setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(e);
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Search"
              className="w-full md:w-40 md:focus:w-64 transition-all duration-300 bg-white/10 focus:bg-white/15 border border-white/15 rounded-full pl-9 pr-3 py-1.5 text-sm outline-none focus:border-nova-pink/60 placeholder:text-white/40"
            />
            <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 hover:text-nova-pink">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" strokeLinecap="round" />
              </svg>
            </button>

            {/* Live results dropdown */}
            {open && q.trim() && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] overflow-y-auto no-scrollbar bg-nova-dark rounded-xl border border-white/15 shadow-2xl shadow-black/60 ring-1 ring-black/40 py-2 z-50">
                {loading && results.length === 0 && (
                  <div className="px-4 py-3 text-sm text-nova-gray">Searching…</div>
                )}
                {!loading && results.length === 0 && (
                  <div className="px-4 py-3 text-sm text-nova-gray">No matches for “{q.trim()}”.</div>
                )}
                {results.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => goTo(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition text-left"
                  >
                    <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-white/10">
                      {item.poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-[10px] text-white/40">
                          {item.type}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      <p className="text-xs text-nova-gray">
                        {item.year && <span>{item.year}</span>}
                        {item.year && " · "}
                        <span className="uppercase">{item.type}</span>
                        {item.rating ? <span className="text-nova-pink"> · ★ {item.rating}</span> : null}
                      </p>
                    </div>
                  </button>
                ))}
                {results.length > 0 && (
                  <button
                    onClick={submit}
                    className="w-full text-left px-4 py-2 mt-1 text-sm font-semibold text-nova-pink hover:bg-white/10 transition"
                  >
                    See all results for “{q.trim()}” →
                  </button>
                )}
              </div>
            )}
          </div>
          </form>

          <div ref={accountRef} className="hidden md:block relative">
            <button
              onClick={() => setAccountOpen((o) => !o)}
              className="flex items-center gap-2 group"
              aria-label="Account menu"
              aria-expanded={accountOpen}
            >
              <span className="text-sm font-semibold text-white/90 group-hover:text-nova-pink transition-colors">
                {profile.name}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={profile.name}
                className={`w-9 h-9 rounded-md ring-2 transition ${accountOpen ? "ring-nova-pink" : "ring-transparent group-hover:ring-white"}`}
              />
              <IconChevronDown className={`w-4 h-4 text-white/60 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-nova-dark rounded-xl border border-white/15 shadow-2xl ring-1 ring-black/40 overflow-hidden">
                {/* Profile header */}
                <Link
                  href="/account"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatar} alt={profile.name} className="w-11 h-11 rounded-lg" />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{profile.name}</p>
                    <p className="text-xs text-nova-gray truncate">{USER_EMAIL}</p>
                  </div>
                </Link>

                {/* Menu items */}
                <ul className="py-1 text-sm">
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <IconUser className="w-5 h-5 text-white/70" />
                      <span>Account</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/browse"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <IconBookmark className="w-5 h-5 text-white/70" />
                      <span>My Stuff</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        window.dispatchEvent(new Event("nova:switcher"));
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                    >
                      <IconUsers className="w-5 h-5 text-white/70" />
                      <span>Switch Profile</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <IconHelp className="w-5 h-5 text-white/70" />
                      <span>Help</span>
                    </Link>
                  </li>
                </ul>

                <div className="border-t border-white/10 py-1">
                  <button
                    onClick={() => setAccountOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors text-left"
                  >
                    <IconPower className="w-5 h-5 text-white/70" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 -mr-1 text-white shrink-0"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 top-16 z-40" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden relative z-50 bg-nova-dark border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-5 py-4 border-b border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar} alt={profile.name} className="w-11 h-11 rounded-lg" />
              <div className="min-w-0">
                <p className="font-bold truncate">{profile.name}</p>
                <p className="text-xs text-nova-gray truncate">{USER_EMAIL}</p>
              </div>
            </Link>

            <ul className="py-2">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 font-semibold hover:bg-white/10 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="py-2 border-t border-white/10 text-sm">
              <li>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors">
                  <IconUser className="w-5 h-5 text-white/70" /> Account
                </Link>
              </li>
              <li>
                <Link href="/browse" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors">
                  <IconBookmark className="w-5 h-5 text-white/70" /> My Stuff
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new Event("nova:switcher"));
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <IconUsers className="w-5 h-5 text-white/70" /> Switch Profile
                </button>
              </li>
              <li>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors">
                  <IconHelp className="w-5 h-5 text-white/70" /> Help
                </Link>
              </li>
              <li className="border-t border-white/10 mt-1 pt-1">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <IconPower className="w-5 h-5 text-white/70" /> Log Out
                </button>
              </li>
            </ul>
          </div>
        </>
      )}

      <ProfileSwitcher />
    </header>
  );
}

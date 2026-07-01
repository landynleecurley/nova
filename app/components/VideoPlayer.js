"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  IconPlay,
  IconPause,
  IconVolume,
  IconVolumeMute,
  IconSettings,
  IconMaximize,
  IconRewind,
  IconForward,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
} from "./icons";

const SRC = "/sample.mp4";

const QUALITIES = ["Auto", "1080p", "720p", "480p", "360p"];
const AUDIO_LANGS = ["English", "Spanish", "French", "German", "Japanese"];
const CAPTION_OPTIONS = ["Off", "English", "English [CC]", "Spanish", "French"];

// Generic placeholder subtitle lines (cycled by playback time).
const CAPTION_TEXT = {
  English: [
    "Somewhere, a new story begins.",
    "You feel that? That's momentum.",
    "We don't stop. Not now.",
    "This is only the beginning.",
  ],
  "English [CC]": [
    "[gentle ambient music]",
    "[wind rushing past]",
    "Somewhere, a new story begins.",
    "[music swells]",
  ],
  Spanish: [
    "En algún lugar, comienza una historia.",
    "¿Lo sientes? Eso es impulso.",
    "No nos detenemos. Ahora no.",
    "Esto es solo el comienzo.",
  ],
  French: [
    "Quelque part, une histoire commence.",
    "Tu le sens ? C'est l'élan.",
    "On ne s'arrête pas. Pas maintenant.",
    "Ce n'est que le début.",
  ],
};

function fmt(t) {
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({ title, backdrop }) {
  const router = useRouter();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [ready, setReady] = useState(false);

  // Playback options
  const [quality, setQuality] = useState("Auto");
  const [audio, setAudio] = useState("English");
  const [captions, setCaptions] = useState("Off");
  const [menu, setMenu] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menu;
  }, [menu]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }, []);

  const seek = useCallback((delta) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(duration, Math.max(0, v.currentTime + delta));
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const exit = useCallback(() => router.back(), [router]);

  // Auto-hide controls while playing.
  const nudgeControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && !menuOpenRef.current) setShowControls(false);
    }, 2800);
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          seek(5);
          break;
        case "ArrowLeft":
          seek(-5);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
        case "Escape":
          if (!document.fullscreenElement) exit();
          break;
        default:
          return;
      }
      nudgeControls();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seek, toggleFullscreen, toggleMute, exit, nudgeControls]);

  const pct = duration ? (current / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  const captionLines = captions !== "Off" ? CAPTION_TEXT[captions] || CAPTION_TEXT.English : null;
  const captionText =
    captionLines && ready && playing
      ? captionLines[Math.floor(current / 2.5) % captionLines.length]
      : null;

  const MENUS = {
    quality: { label: "Quality", options: QUALITIES, value: quality, set: setQuality },
    audio: { label: "Audio", options: AUDIO_LANGS, value: audio, set: setAudio },
    captions: { label: "Subtitles / CC", options: CAPTION_OPTIONS, value: captions, set: setCaptions },
  };

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[70] bg-black select-none"
      onMouseMove={nudgeControls}
      onTouchStart={nudgeControls}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={SRC}
        poster={backdrop || undefined}
        autoPlay
        loop
        playsInline
        className="w-full h-full object-contain"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setReady(true);
        }}
        onTimeUpdate={(e) => {
          setCurrent(e.currentTarget.currentTime);
          const b = e.currentTarget.buffered;
          if (b.length) setBuffered(b.end(b.length - 1));
        }}
        onPlay={() => {
          setPlaying(true);
          nudgeControls();
        }}
        onPause={() => {
          setPlaying(false);
          setShowControls(true);
        }}
      />

      {/* Loading spinner */}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-nova-pink animate-spin" />
        </div>
      )}

      {/* Center play/pause flash when paused */}
      {ready && !playing && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/50 grid place-items-center">
            <IconPlay className="w-9 h-9 text-white" />
          </div>
        </div>
      )}

      {/* Subtitles */}
      {captionText && (
        <div
          className={`pointer-events-none absolute inset-x-0 flex justify-center px-4 transition-all duration-300 ${
            showControls ? "bottom-28" : "bottom-12"
          }`}
        >
          <span className="bg-black/75 text-white text-lg md:text-2xl font-medium px-3 py-1 rounded text-center max-w-3xl">
            {captionText}
          </span>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setMenu(false);
          setSubmenu(null);
        }}
      >
        {/* Top bar */}
        <div className="bg-gradient-to-b from-black/80 to-transparent px-4 md:px-8 pt-4 pb-10 flex items-center gap-4">
          <button
            onClick={exit}
            className="flex items-center gap-2 text-white/90 hover:text-white font-semibold"
            aria-label="Back"
          >
            <IconChevronLeft className="w-6 h-6" /> Back
          </button>
          <div className="min-w-0">
            <p className="font-black text-lg md:text-xl truncate">{title}</p>
          </div>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-nova-pink/90 text-white px-2 py-1 rounded">
            Preview
          </span>
        </div>

        {/* Bottom bar */}
        <div className="bg-gradient-to-t from-black/85 to-transparent px-4 md:px-8 pb-5 pt-16">
          {/* Progress bar */}
          <div className="group/bar relative h-4 flex items-center cursor-pointer mb-2">
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/25 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${bufPct}%` }} />
              <div className="absolute inset-y-0 left-0 nova-gradient" style={{ width: `${pct}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="any"
              value={current}
              onChange={(e) => {
                const v = videoRef.current;
                if (v) v.currentTime = Number(e.target.value);
                setCurrent(Number(e.target.value));
              }}
              className="absolute inset-x-0 w-full appearance-none bg-transparent h-4 cursor-pointer accent-nova-pink"
              aria-label="Seek"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-white">
            <button onClick={togglePlay} className="hover:text-nova-pink" aria-label={playing ? "Pause" : "Play"}>
              {playing ? <IconPause className="w-6 h-6" /> : <IconPlay className="w-6 h-6" />}
            </button>
            <button onClick={() => seek(-10)} className="hidden sm:flex items-center gap-1 text-sm hover:text-nova-pink" aria-label="Back 10s">
              <IconRewind className="w-5 h-5" /> 10
            </button>
            <button onClick={() => seek(10)} className="hidden sm:flex items-center gap-1 text-sm hover:text-nova-pink" aria-label="Forward 10s">
              10 <IconForward className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-nova-pink" aria-label="Mute">
                {muted || volume === 0 ? <IconVolumeMute className="w-5 h-5" /> : <IconVolume className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const v = videoRef.current;
                  if (v) {
                    v.volume = val;
                    v.muted = val === 0;
                  }
                  setVolume(val);
                  setMuted(val === 0);
                }}
                className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-nova-pink cursor-pointer"
                aria-label="Volume"
              />
            </div>

            <span className="text-sm tabular-nums text-white/80">
              {fmt(current)} <span className="text-white/40">/ {fmt(duration)}</span>
            </span>

            <div className="relative ml-auto flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenu((m) => !m);
                  setSubmenu(null);
                }}
                className={`transition-colors ${menu ? "text-nova-pink" : "hover:text-nova-pink"}`}
                aria-label="Settings"
              >
                <IconSettings className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-nova-pink" aria-label="Fullscreen">
                <IconMaximize className="w-5 h-5" />
              </button>

              {/* Settings menu */}
              {menu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full right-0 mb-3 w-60 bg-nova-dark rounded-xl border border-white/15 shadow-2xl ring-1 ring-black/40 overflow-hidden text-sm"
                >
                  {!submenu ? (
                    <ul className="py-1">
                      {[
                        ["quality", "Quality"],
                        ["audio", "Audio"],
                        ["captions", "Subtitles / CC"],
                      ].map(([key, label]) => (
                        <li key={key}>
                          <button
                            onClick={() => setSubmenu(key)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors"
                          >
                            <span className="font-semibold text-white">{label}</span>
                            <span className="text-white/60 flex items-center gap-1">
                              {MENUS[key].value}
                              <IconChevronRight className="w-4 h-4 text-white/30" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-1">
                      <button
                        onClick={() => setSubmenu(null)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 border-b border-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <IconChevronLeft className="w-5 h-5" />
                        <span className="font-semibold">{MENUS[submenu].label}</span>
                      </button>
                      {MENUS[submenu].options.map((opt) => {
                        const active = MENUS[submenu].value === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              MENUS[submenu].set(opt);
                              setMenu(false);
                              setSubmenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 transition-colors"
                          >
                            <IconCheck className={`w-4 h-4 ${active ? "text-nova-pink" : "text-transparent"}`} />
                            <span className={active ? "text-white font-semibold" : "text-white/80"}>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

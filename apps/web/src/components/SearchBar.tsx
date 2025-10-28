import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppWindow, Mic, Search as SearchIcon } from "lucide-react";

import { fetchInspirationPrompts, fetchSearchSuggestions } from "../api/search";

const ICON_SIZE = 18;

type GenericSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  addEventListener: (type: string, listener: (event: any) => void) => void;
};

type SearchBarProps = {
  initialQuery?: string;
  showActions?: boolean;
};

export function SearchBar({ initialQuery = "", showActions = true }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const speechRef = useRef<GenericSpeechRecognition | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const controller = new AbortController();
    fetchInspirationPrompts(controller.signal)
      .then((items) => {
        if (items.length > 0) {
          setInspirations(items);
        }
      })
      .catch(() => {
        // Swallow errors; fallback inspiration will be used.
      });

    return () => controller.abort();
  }, []);

  const performSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      navigate({ pathname: "/search", search: `?q=${encodeURIComponent(trimmed)}` });
      setOpen(false);
    },
    [navigate]
  );

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as Record<string, any>).SpeechRecognition || (window as Record<string, any>).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition: GenericSpeechRecognition = new SpeechRecognitionCtor();
    speechRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("result", (event: any) => {
      const transcript = event.results[0][0].transcript as string;
      setQuery(transcript);
      performSearch(transcript);
    });

    recognition.addEventListener("end", () => {
      setListening(false);
    });

    recognition.addEventListener("error", () => {
      setListening(false);
    });

    return () => {
      recognition.stop();
      speechRef.current = null;
    };
  }, [performSearch]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      performSearch(query);
    },
    [performSearch, query]
  );

  const inspiration = useMemo(() => {
    if (inspirations.length === 0) {
      return "discover new ideas";
    }
    return inspirations[Math.floor(Math.random() * inspirations.length)];
  }, [inspirations]);

  const handleLucky = useCallback(() => {
    performSearch(inspiration);
    setQuery(inspiration);
  }, [inspiration, performSearch]);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setOpen(false);
      return () => controller.abort();
    }

    const timeout = window.setTimeout(async () => {
      try {
        const next = await fetchSearchSuggestions(trimmed, controller.signal);
        setSuggestions(next);
        setOpen(next.length > 0);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
          console.warn("Failed to load suggestions", error);
        }
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!suggestionsRef.current) return;
      if (!suggestionsRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onMicClick = useCallback(() => {
    const recognition = speechRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      return;
    }
    setListening(true);
    recognition.start();
  }, [listening]);

  const showSuggestions = open && suggestions.length > 0;

  return (
    <div className="search-stack">
      <div className="search" role="search">
        <form className="search-form" onSubmit={handleSubmit} autoComplete="off">
          <button
            className="icon-btn"
            type="button"
            title="Apps"
            aria-label="Apps"
            onClick={() => navigate("/tasks")}
          >
            <AppWindow size={ICON_SIZE} />
          </button>
          <input
            ref={inputRef}
            id="q"
            name="q"
            type="search"
            placeholder="Search the web or press '/' to focus"
            aria-label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(suggestions.length > 0)}
          />
          <button
            className="icon-btn"
            type="button"
            title={speechSupported ? "Voice search" : "Voice search not supported"}
            aria-label="Voice search"
            onClick={onMicClick}
            disabled={!speechSupported}
            style={listening ? { background: "#2ecc7040" } : undefined}
          >
            <Mic size={ICON_SIZE} />
          </button>
          <button className="icon-btn" type="submit" title="Search" aria-label="Search">
            <SearchIcon size={ICON_SIZE} />
          </button>
        </form>
        <div
          ref={suggestionsRef}
          className={`suggestions${showSuggestions ? " active" : ""}`}
          aria-live="polite"
          role="listbox"
        >
          {showSuggestions && (
            <ul>
              {suggestions.map((item) => (
                <li
                  key={item}
                  role="option"
                  tabIndex={0}
                  onClick={() => {
                    setQuery(item);
                    performSearch(item);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      setQuery(item);
                      performSearch(item);
                    }
                  }}
                >
                  <SearchIcon size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {showActions && (
        <div className="btns" role="group" aria-label="Search actions">
          <button className="btn" type="button" onClick={() => performSearch(query)}>
            Auirah Search
          </button>
          <button className="btn" type="button" onClick={handleLucky}>
            I'm Feeling Inspired
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Sparkles,
  X,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CHAT_SUGGESTIONS, replyTo } from '@/lib/ai/chatbot';
import { usePreferences } from '@/lib/ai/use-preferences';
import { cn } from '@/lib/utils';

const WELCOME = {
  role: 'bot',
  text: "Hey! I'm Verse \u2014 your hackathon co-pilot. Ask me anything about hackathons, or try a suggestion below.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([WELCOME]);
  const [text, setText] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);
  const { prefs, bookmarks } = usePreferences();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = (rawText) => {
    const content = String(rawText ?? text).trim();
    if (!content) return;
    setMsgs((m) => [...m, { role: 'user', text: content }]);
    setText('');
    setThinking(true);
    // Simulate latency for placeholder "thinking".
    setTimeout(() => {
      const reply = replyTo(content, { ...prefs, bookmarks });
      setMsgs((m) => [...m, { role: 'bot', ...reply }]);
      setThinking(false);
    }, 550 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        aria-label="Open AI assistant"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-fuchsia-500" />
        </span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-5 z-50 flex h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10"
          >
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-fuchsia-500/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Verse AI</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Placeholder \u00b7 rule-based
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="font-normal">
                Beta
              </Badge>
            </div>

            <ScrollArea className="flex-1" viewportRef={scrollRef}>
              <div ref={scrollRef} className="space-y-3 px-4 py-4">
                {msgs.map((m, i) => (
                  <MessageBubble key={i} msg={m} />
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verse is thinking\u2026
                  </div>
                )}
              </div>
            </ScrollArea>

            {msgs.length <= 1 && (
              <div className="border-t px-4 py-2">
                <div className="flex flex-wrap gap-1.5">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border bg-background px-2.5 py-1 text-[11px] transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t p-3"
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about hackathons\u2026"
                className="h-9"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!text.trim() || thinking}
                className="h-9 w-9 shrink-0 bg-gradient-to-r from-primary to-fuchsia-500"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm',
          isUser
            ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {msg.text}
        {msg.hackathons?.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {msg.hackathons.map((h) => (
              <Link
                key={h.id}
                href={h.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  isUser
                    ? 'bg-white/15 hover:bg-white/25'
                    : 'bg-background hover:bg-accent'
                )}
              >
                <span className="line-clamp-1 font-medium">
                  {h.title}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

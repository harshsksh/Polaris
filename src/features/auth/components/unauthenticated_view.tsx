"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const SLIDES = [
    {
        src: "/images/code-editor-view.png",
        label: "AI writes your code",
        sub: "Just describe what you want. Polaris reads your files and makes it happen.",
    },
    {
        src: "/images/editor-preview-mode.png",
        label: "See it live — instantly",
        sub: "Your app boots in the browser. No terminal, no local server.",
    },
    {
        src: "/images/new-project-dialog.png",
        label: "Start from a prompt",
        sub: "Type an idea. Polaris scaffolds the entire project in seconds.",
    },
    {
        src: "/images/search-previous-conversations-dialog.png",
        label: "Every chat is saved",
        sub: "Pick up any AI conversation right where you left off.",
    },
];

const PILLS = [
    { icon: "🤖", label: "AI Agent" },
    { icon: "⚡", label: "Live Preview" },
    { icon: "🐙", label: "GitHub Sync" },
    { icon: "📁", label: "Full File Explorer" },
];

export const UnauthenticatedView = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SLIDES.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const slide = SLIDES[activeIndex];

    return (
        <div className={cn("flex h-screen w-full overflow-hidden bg-sidebar", font.className)}>

            {/* ── LEFT PANEL ── */}
            <div className="relative hidden lg:flex flex-col w-[60%] h-full overflow-hidden bg-sidebar">

                {/* Radial spotlight behind screenshots */}
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 60% at 50% 55%, oklch(0.38 0.08 264 / 0.35) 0%, transparent 70%)",
                    }}
                />

                {/* Top brand */}
                <div className="relative z-10 flex items-center gap-2.5 p-8">
                    <Image src="/logo.svg" alt="Polaris" width={36} height={36} />
                    <span className="text-2xl font-semibold text-foreground tracking-tight">
                        Polaris
                    </span>
                </div>

                {/* Screenshot showcase */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 gap-6">

                    {/* Caption */}
                    <div className="text-center space-y-1 min-h-13">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`label-${activeIndex}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.35 }}
                                className="text-lg font-semibold text-foreground"
                            >
                                {slide.label}
                            </motion.p>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={`sub-${activeIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35, delay: 0.05 }}
                                className="text-sm text-muted-foreground"
                            >
                                {slide.sub}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Screenshot frame */}
                    <div className="relative w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        {/* Top fade */}
                        <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 z-10 bg-linear-to-b from-sidebar to-transparent" />
                        {/* Bottom fade */}
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 z-10 bg-linear-to-t from-sidebar to-transparent" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`img-${activeIndex}`}
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.01 }}
                                transition={{ duration: 0.45 }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={slide.src}
                                    alt={slide.label}
                                    className="w-full object-cover object-top"
                                    style={{ maxHeight: "380px" }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Slide dots */}
                    <div className="flex items-center gap-2">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    i === activeIndex
                                        ? "w-6 bg-foreground/80"
                                        : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Feature pills */}
                <div className="relative z-10 flex items-center justify-center gap-2 pb-8 flex-wrap px-6">
                    {PILLS.map((pill) => (
                        <div
                            key={pill.label}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-muted-foreground"
                        >
                            <span>{pill.icon}</span>
                            <span>{pill.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex flex-col items-center justify-center flex-1 h-full bg-background border-l border-border/50 px-8 py-12">

                <div className="w-full max-w-sm flex flex-col gap-8">

                    {/* Mobile-only brand */}
                    <div className="flex items-center gap-2.5 lg:hidden">
                        <Image src="/logo.svg" alt="Polaris" width={32} height={32} />
                        <span className="text-xl font-semibold text-foreground">Polaris</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground leading-tight">
                            Polaris your ideas<br />into reality.
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your AI-powered coding partner. Describe what you want to build —
                            Polaris writes the code, runs it live, and pushes it to GitHub.
                        </p>
                    </div>

                    {/* Auth buttons */}
                    <div className="flex flex-col gap-3">
                        <SignInButton>
                            <Button className="w-full h-10 text-sm font-medium">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button variant="outline" className="w-full h-10 text-sm font-medium">
                                Create a free account
                            </Button>
                        </SignUpButton>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/50" />

                    {/* GitHub link */}
                    <a
                        href="https://github.com/adityagarg2614/polaris"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <FaGithub className="size-4 shrink-0" />
                        <span>Open source — view on GitHub</span>
                        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                        </span>
                    </a>

                </div>
            </div>

        </div>
    );
};
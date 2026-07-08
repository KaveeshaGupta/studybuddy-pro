"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Flag, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "StudyBuddy", icon: BookOpen },
  { href: "/mission", label: "Mission", icon: Flag },
];

export function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const ThemeIcon = dark ? Moon : Sun;

  return (
    <header className="border-b border-[#ECECF0] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-7 py-3.5">
        <div className="mr-1.5 flex items-center gap-[11px]">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[var(--sb-accent)] shadow-[0_4px_12px_rgba(124,58,237,0.28)]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-[-0.02em] text-[#18181B]">
            StudyBuddy
          </span>
        </div>

        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-[7px] rounded-[10px] px-[15px] py-[9px] text-[15px] font-semibold",
                  active
                    ? "bg-[#F3F1FD] text-[var(--sb-accent)]"
                    : "text-[#3F3F46]",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#52525B]"
          >
            <ThemeIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}

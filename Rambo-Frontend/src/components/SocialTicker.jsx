import React from "react";
import { motion } from "framer-motion";

export default function SocialTicker() {
  const socialItems = [
    {
      id: 1,
      // Facebook Icon
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center p-2.5 shadow-sm">
          <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      ),
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61594253841482",
    },
    {
      id: 2,
      // Instagram Gradient Icon
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center p-2.5 shadow-sm">
          <svg className="w-full h-full text-white fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      ),
      label: "Instagram",
      href: "https://www.instagram.com/rambobathaccessories/",
    },
    {
      id: 3,
      // TikTok Black Icon with Cyan/Magenta Offset
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-sm relative overflow-hidden">
          <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24">
            <path
              className="fill-[#25F4EE]"
              d="M12.58 3h2.5a5.5 5.5 0 0 0 3.8 2.2V8a8.2 8.2 0 0 1-3.8-1.1V14.5a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1V12a2.5 2.5 0 1 0 2.1 2.5V3z"
              transform="translate(-0.8, -0.6)"
            />
            <path
              className="fill-[#FE2C55]"
              d="M12.58 3h2.5a5.5 5.5 0 0 0 3.8 2.2V8a8.2 8.2 0 0 1-3.8-1.1V14.5a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1V12a2.5 2.5 0 1 0 2.1 2.5V3z"
              transform="translate(0.8, 0.6)"
            />
            <path
              className="fill-white"
              d="M12.58 3h2.5a5.5 5.5 0 0 0 3.8 2.2V8a8.2 8.2 0 0 1-3.8-1.1V14.5a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1V12a2.5 2.5 0 1 0 2.1 2.5V3z"
            />
          </svg>
        </div>
      ),
      label: "TikTok",
      href: "https://www.tiktok.com/@rambobathaccesories",
    },
  ];

  const duplicatedItems = [
    ...socialItems,
    ...socialItems,
    ...socialItems,
    ...socialItems,
  ];

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#08051a] py-10 overflow-hidden my-8">
      <div className="flex w-full">
        <motion.div
          className="flex gap-16 sm:gap-28 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 shrink-0 min-w-[140px] cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              {item.icon}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center tracking-tight">
                {item.label}
              </p>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
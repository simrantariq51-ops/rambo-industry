const variants = {
  primary:
    "bg-amber-500 text-navy-950 hover:bg-amber-400 shadow-[0_0_0_1px_rgba(232,163,61,0.4)]",
  outline:
    "border border-steel-300/60 text-white hover:border-amber-500 hover:text-amber-400",
  outlineDark:
    "border border-navy-900/30 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  ghost: "text-navy-900 hover:text-amber-600",
};

export default function Button({
  as = "a",
  href = "#",
  variant = "primary",
  className = "",
  children,
  icon: Icon,
  onClick,
  type,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 font-display uppercase tracking-wide text-sm font-medium transition-colors duration-200 cursor-pointer";
  const classes = `${base} ${variants[variant]} ${className}`;

  if (as === "button") {
    return (
      <button type={type || "button"} onClick={onClick} className={classes}>
        {children}
        {Icon && <Icon size={16} strokeWidth={2.25} />}
      </button>
    );
  }

  return (
    <a href={href} onClick={onClick} className={classes}>
      {children}
      {Icon && <Icon size={16} strokeWidth={2.25} />}
    </a>
  );
}

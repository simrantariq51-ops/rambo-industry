export default function SectionTag({ index, label, dark = false }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className={`tag-label ${dark ? "text-amber-400" : "text-amber-600"}`}
      >
        {index ? `FIG. ${index} —` : ""} {label}
      </span>
      <span
        className={`h-px flex-1 max-w-16 ${dark ? "bg-steel-500/40" : "bg-steel-500/30"}`}
      />
    </div>
  );
}

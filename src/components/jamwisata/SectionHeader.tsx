export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`jw-eyebrow ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>
      <h2 className="jw-section-title">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--jw-muted)] sm:text-base">{description}</p> : null}
    </div>
  );
}

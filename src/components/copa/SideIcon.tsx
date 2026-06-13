import { cn } from "@/lib/utils";

export function isSvgSideIcon(value: string) {
  return value.startsWith("data:image/svg+xml;base64,");
}

export function SideIcon({
  icon,
  label,
  className,
}: {
  icon: string;
  label: string;
  className?: string;
}) {
  if (isSvgSideIcon(icon)) {
    return (
      <img
        src={icon}
        alt=""
        aria-label={label}
        className={cn("h-7 w-7 object-contain", className)}
      />
    );
  }

  return (
    <span aria-label={label} className={cn("text-2xl leading-none", className)}>
      {icon}
    </span>
  );
}

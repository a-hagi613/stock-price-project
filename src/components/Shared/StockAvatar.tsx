interface StockAvatarProps {
  symbol?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const LOGO_MAP: Record<string, string> = {
  NVDA: "/nvidia.svg",
  TSLA: "/tesla.svg",
  AAPL: "/apple.svg",
  GOOGL: "/google.svg",
};

const sizeClasses: Record<
  NonNullable<StockAvatarProps["size"]>,
  { wrapper: string; image: string; text: string }
> = {
  sm: { wrapper: "w-8 h-8", image: "w-5 h-5", text: "text-xs" },
  md: { wrapper: "w-11 h-11", image: "w-7 h-7", text: "text-sm" },
  lg: { wrapper: "w-14 h-14", image: "w-9 h-9", text: "text-base" },
};

const getInitials = (symbol?: string, name?: string) => {
  // Special handling for market notifications - show emojis
  if (symbol === "MARKET") return "📰";
  if (symbol === "ALERT") return "⚠️";

  if (symbol) return symbol.slice(0, 2).toUpperCase();
  if (name) {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return "??";
};

const StockAvatar = ({ symbol, name, size = "md" }: StockAvatarProps) => {
  const normalizedSymbol = symbol?.toUpperCase();
  const logo = normalizedSymbol ? LOGO_MAP[normalizedSymbol] : undefined;
  const sizeClass = sizeClasses[size];
  const initials = getInitials(normalizedSymbol, name);

  // Check if initials are emojis (special market notifications)
  const isEmoji = initials === "📰" || initials === "⚠️";

  return (
    <div
      className={`${sizeClass.wrapper} rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center`}
    >
      {logo ? (
        <img
          src={logo}
          alt={`${normalizedSymbol ?? name ?? "stock"} logo`}
          className={`${sizeClass.image} object-contain`}
        />
      ) : (
        <span className={`${isEmoji ? 'text-2xl' : `font-semibold text-slate-500 ${sizeClass.text}`}`}>
          {initials}
        </span>
      )}
    </div>
  );
};

export default StockAvatar;


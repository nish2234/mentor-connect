import { cn } from "../../lib/utils";

export default function ShinyText({
    text,
    disabled = false,
    speed = 5,
    className = "",
}) {
    return (
        <span
            className={cn(
                "inline-block bg-clip-text text-transparent",
                "bg-[linear-gradient(120deg,rgba(255,255,255,0)_40%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_60%)]",
                "bg-[length:200%_100%]",
                disabled ? "" : "animate-shine",
                className
            )}
            style={{
                backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%), linear-gradient(to right, #6366f1, #8b5cf6, #a855f7)`,
                backgroundSize: "200% 100%, 100% 100%",
                animation: disabled ? "none" : `shine ${speed}s linear infinite`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}
        >
            <style>{`
        @keyframes shine {
          0% { background-position: 100% 0, 0 0; }
          100% { background-position: -100% 0, 0 0; }
        }
      `}</style>
            {text}
        </span>
    );
}

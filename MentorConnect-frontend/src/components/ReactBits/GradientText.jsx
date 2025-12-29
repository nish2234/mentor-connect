import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function GradientText({
    children,
    className = "",
    colors = ["#6366f1", "#8b5cf6", "#a855f7", "#6366f1"],
    animationSpeed = 8,
    showBorder = false,
}) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
        animation: `gradient ${animationSpeed}s linear infinite`,
    };

    return (
        <>
            <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
            <motion.span
                className={cn(
                    "inline-block bg-clip-text text-transparent",
                    showBorder && "border-b-2 border-current",
                    className
                )}
                style={gradientStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.span>
        </>
    );
}

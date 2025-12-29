import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function AnimatedCard({ children, className = "", delay = 0 }) {
    return (
        <motion.div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-surface border border-surface-light",
                "transition-all duration-300",
                "hover:border-primary hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]",
                className
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
        >
            {/* Gradient border glow effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary via-purple-500 to-primary opacity-30 blur-sm" />
            </div>
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

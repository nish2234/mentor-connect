import { useMemo } from "react";
import { motion } from "framer-motion";

export default function SplitText({
    text = "",
    className = "",
    delay = 0,
    animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
    animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
    easing = [0.25, 0.1, 0.25, 1],
    threshold = 0.1,
    rootMargin = "-100px",
    textAlign = "center",
    onLetterAnimationComplete,
}) {
    const words = useMemo(() => text.split(" "), [text]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const wordVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.03,
            },
        },
    };

    const letterVariants = {
        hidden: animationFrom,
        visible: {
            ...animationTo,
            transition: {
                duration: 0.5,
                ease: easing,
            },
        },
    };

    return (
        <motion.div
            className={className}
            style={{ textAlign, display: "flex", flexWrap: "wrap", justifyContent: textAlign === "center" ? "center" : "flex-start", gap: "0.5em" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: threshold, margin: rootMargin }}
        >
            {words.map((word, wordIndex) => (
                <motion.span
                    key={wordIndex}
                    variants={wordVariants}
                    style={{ display: "inline-flex" }}
                >
                    {word.split("").map((letter, letterIndex) => (
                        <motion.span
                            key={letterIndex}
                            variants={letterVariants}
                            onAnimationComplete={
                                wordIndex === words.length - 1 && letterIndex === word.length - 1
                                    ? onLetterAnimationComplete
                                    : undefined
                            }
                            style={{ display: "inline-block" }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.span>
            ))}
        </motion.div>
    );
}

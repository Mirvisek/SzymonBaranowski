
'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export default function ScrollReveal({
    children,
    width = "100%",
    delay = 0.2,
    direction = "up"
}: ScrollRevealProps) {

    const getInitialProps = () => {
        switch (direction) {
            case "up": return { y: 40, opacity: 0 };
            case "down": return { y: -40, opacity: 0 };
            case "left": return { x: 40, opacity: 0 };
            case "right": return { x: -40, opacity: 0 };
            default: return { y: 40, opacity: 0 };
        }
    };

    return (
        <div style={{ position: "relative", width, overflow: "visible" }}>
            <motion.div
                variants={{
                    hidden: getInitialProps(),
                    visible: { x: 0, y: 0, opacity: 1 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.21, 0.47, 0.32, 0.98]
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";

/**
 * Entrada sutil (200 ms). Curta de propósito: animações longas deixam
 * os testes automatizados instáveis.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

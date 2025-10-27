
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface PlantTreeAnimationProps {
  onComplete: () => void;
}

export function PlantTreeAnimation({ onComplete }: PlantTreeAnimationProps) {
  const treeContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      }
    },
  };

  const trunkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1, ease: "easeInOut" } 
    },
  };

  const branchVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 0.7, ease: "easeInOut" } 
    },
  };

  const leafVariants = {
    hidden: { scale: 0, opacity: 0, transformOrigin: "center" },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 15 } 
    },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="bg-card rounded-2xl p-6 md:p-8 text-center shadow-2xl max-w-sm w-full"
      >
        <motion.div 
            className="mb-4"
            variants={treeContainerVariants}
            initial="hidden"
            animate="visible"
        >
          {/* Detailed SVG Tree Animation */}
          <svg
            className="w-32 h-32 mx-auto text-green-500"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Ground */}
            <motion.line x1="20" y1="180" x2="180" y2="180" variants={trunkVariants} />
            
            {/* Trunk */}
            <motion.path d="M100,180 V50" variants={trunkVariants} />

            {/* Branches */}
            <motion.path d="M100,120 Q80,110 60,90" strokeWidth="4" variants={branchVariants} />
            <motion.path d="M100,100 Q120,90 140,70" strokeWidth="4" variants={branchVariants} />
            <motion.path d="M100,80 Q85,75 70,50" strokeWidth="4" variants={branchVariants} />
            <motion.path d="M100,140 Q110,135 120,115" strokeWidth="4" variants={branchVariants} />

            {/* Leaves (circles for simplicity) */}
            <motion.circle cx="60" cy="90" r="15" fill="currentColor" stroke="none" variants={leafVariants} />
            <motion.circle cx="140" cy="70" r="18" fill="currentColor" stroke="none" variants={leafVariants} />
            <motion.circle cx="70" cy="50" r="16" fill="currentColor" stroke="none" variants={leafVariants} />
            <motion.circle cx="120" cy="115" r="12" fill="currentColor" stroke="none" variants={leafVariants} />
            <motion.circle cx="95" cy="40" r="20" fill="currentColor" stroke="none" variants={leafVariants} />
             <motion.circle cx="125" cy="90" r="14" fill="currentColor" stroke="none" variants={leafVariants} />
          </svg>
        </motion.div>
        
        <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2"
        >
            <CheckCircle/> Tree Planted!
        </motion.h2>

        <motion.p
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 2.7 }}
             className="text-muted-foreground mb-6"
        >
            Thank you for making a positive impact on the environment. Your contribution matters.
        </motion.p>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.9 }}
        >
            <Button onClick={onComplete} className="w-full">
                Back to Dashboard
            </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

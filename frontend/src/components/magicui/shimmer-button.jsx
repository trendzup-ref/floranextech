import React from "react";
import { cn } from "@/lib/utils";

export const ShimmerButton = React.forwardRef(
  (
    {
      shimmerColor = "#3df2e0",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(2, 2, 2, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        }}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-secondary/30 px-6 py-3 [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-marquee [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin [animation-duration:var(--speed)] absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_0deg,transparent_0_340deg,var(--shimmer-color)_360deg)]" />
          </div>
        </div>
        {children}

        {/* Backdrop */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#3df2e030]",
            "group-active:shadow-[inset_0_-10px_10px_#3df2e040]"
          )}
        />

        {/* content highlight */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";


"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const MinimalToggle = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative inline-block h-[1.8em] w-[3.7em] text-[17px]">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "group h-0 w-0",
            "[&:checked+span:before]:translate-x-[1.9em]",
            "[&:checked+span:before]:bg-green-500/70",
            "dark:[&:checked+span:before]:bg-green-500",
            "[&:checked+span]:bg-green-300",
            "dark:[&:checked+span]:bg-green-900",
            className
          )}
          {...props}
        />
        <span className={cn(
          "absolute inset-0 cursor-pointer rounded-[30px] bg-gray-300 transition ease-in-out",
          "before:absolute before:bottom-[0.2em] before:left-[0.2em] before:h-[1.4em] before:w-[1.4em]",
          "before:rounded-[20px] before:bg-gray-400 before:transition before:duration-300 before:content-['']",
          "dark:bg-gray-700 dark:before:bg-gray-400"
        )} />
      </label>
    )
  }
)
MinimalToggle.displayName = "MinimalToggle"

const OrangeToggle = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "ease before:ease relative h-6 w-12 appearance-none rounded-full bg-stone-300",
          "transition duration-300",
          "before:absolute before:left-[calc(1.5em_-_1.6em)] before:top-[calc(1.5em_-_1.6em)]",
          "before:block before:h-[1.7em] before:w-[1.6em] before:cursor-pointer",
          "before:rounded-full before:border before:border-solid before:border-stone-400",
          "before:bg-white before:transition-all before:duration-300 before:content-['']",
          "checked:bg-orange-600 checked:before:translate-x-full checked:before:border-orange-500",
          "hover:before:shadow-[0_0_0px_8px_rgba(0,0,0,0.15)]",
          "checked:hover:before:shadow-[0_0_0px_8px_rgba(236,72,72,0.15)]",
          className
        )}
        {...props}
      />
    )
  }
)
OrangeToggle.displayName = "OrangeToggle"

export { MinimalToggle, OrangeToggle }
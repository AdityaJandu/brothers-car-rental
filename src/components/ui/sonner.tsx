"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { BadgeCheck, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <BadgeCheck className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200/50 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950/80 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800/50 font-medium",
          description: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 font-normal",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400",
          success:
            "group-[.toaster]:!text-emerald-600 group-[.toaster]:!border-emerald-200/50 dark:group-[.toaster]:!text-emerald-500 dark:group-[.toaster]:!border-emerald-900/50",
          error:
            "group-[.toaster]:!text-rose-600 group-[.toaster]:!border-rose-200/50 dark:group-[.toaster]:!text-rose-500 dark:group-[.toaster]:!border-rose-900/50",
          warning:
            "group-[.toaster]:!text-amber-600 group-[.toaster]:!border-amber-200/50 dark:group-[.toaster]:!text-amber-500 dark:group-[.toaster]:!border-amber-900/50",
          info: "group-[.toaster]:!text-blue-600 group-[.toaster]:!border-blue-200/50 dark:group-[.toaster]:!text-blue-500 dark:group-[.toaster]:!border-blue-900/50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

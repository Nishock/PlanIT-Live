"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[100] flex flex-col gap-3 p-4 m-0 top-20 right-4 max-w-sm w-full",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full data-[state=open]:fade-in-0 backdrop-blur-xl border border-white/20",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-slate-900/90 to-slate-800/90 text-white shadow-slate-900/50",
        destructive: "bg-gradient-to-r from-red-500/90 to-pink-600/90 text-white shadow-red-500/50",
        success: "bg-gradient-to-r from-emerald-500/90 to-teal-600/90 text-white shadow-emerald-500/50",
        info: "bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white shadow-blue-500/50",
        warning: "bg-gradient-to-r from-amber-500/90 to-orange-600/90 text-white shadow-amber-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  const getIcon = () => {
    const iconClass = "h-6 w-6 animate-in zoom-in-50 duration-300"
    
    switch (variant) {
      case "destructive":
        return <AlertCircle className={cn(iconClass, "text-red-100")} />
      case "success":
        return <CheckCircle className={cn(iconClass, "text-emerald-100")} />
      case "info":
        return <Info className={cn(iconClass, "text-blue-100")} />
      case "warning":
        return <AlertTriangle className={cn(iconClass, "text-amber-100")} />
      default:
        return <Info className={cn(iconClass, "text-slate-100")} />
    }
  }

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse opacity-50" />
      
      {/* Main content */}
      <div className="flex items-start gap-4 w-full p-4 relative z-10">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
      
      {/* Close button */}
      <ToastClose className="absolute right-3 top-3 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 focus:ring-2 focus:outline-none focus:ring-white/50 rounded-lg p-1">
        <X className="h-4 w-4" />
      </ToastClose>
      
      {/* Progress bar */}
      <div className="absolute left-0 bottom-0 h-1 w-full bg-black/20 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-white/60 to-white/40 animate-[progress_4s_linear] transform-gpu" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-10 translate-y-10" />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 text-sm font-medium text-white transition-all hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1 text-white/70 opacity-70 transition-all hover:text-white hover:opacity-100 hover:bg-black/20 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold tracking-tight text-white/95", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-white/80 leading-relaxed mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

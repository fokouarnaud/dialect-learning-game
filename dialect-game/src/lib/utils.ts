/**
 * Utilitaires pour shadcn/ui - Configuration TailwindCSS et clsx
 * Task 1.5: Intégration shadcn/ui - Setup et composants base
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine les classes TailwindCSS avec clsx et tailwind-merge
 * Évite les conflits de classes et optimise le bundle CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utilitaires pour les variantes de composants
 */
export const focusRing = [
  // Focus ring moderne compatible avec shadcn/ui
  "focus-visible:outline-none",
  "focus-visible:ring-2", 
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
]

export const buttonVariants = {
  base: [
    "inline-flex",
    "items-center", 
    "justify-center",
    "whitespace-nowrap",
    "rounded-md",
    "text-sm",
    "font-medium",
    "ring-offset-background",
    "transition-colors",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    ...focusRing,
  ],
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
}

/**
 * Utilitaire pour formater les noms de classe avec préfixes
 */
export function formatClassName(className: string, prefix = ""): string {
  if (!className) return ""
  if (!prefix) return className
  
  return className
    .split(' ')
    .map(cls => cls.startsWith(prefix) ? cls : `${prefix}${cls}`)
    .join(' ')
}

/**
 * Vérification des classes TailwindCSS valides
 */
export function isValidTailwindClass(className: string): boolean {
  const validPrefixes = [
    'bg-', 'text-', 'border-', 'rounded-', 'shadow-', 'hover:', 'focus:',
    'active:', 'disabled:', 'dark:', 'sm:', 'md:', 'lg:', 'xl:', '2xl:',
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'm-', 'mx-', 'my-',
    'mt-', 'mr-', 'mb-', 'ml-', 'w-', 'h-', 'min-w-', 'min-h-', 'max-w-',
    'max-h-', 'flex', 'grid', 'inline', 'block', 'hidden', 'absolute',
    'relative', 'fixed', 'static', 'sticky'
  ]
  
  return validPrefixes.some(prefix => 
    className.startsWith(prefix) || className === prefix.replace(/[:-]$/, '')
  )
}

/**
 * Génération de variantes avec class-variance-authority
 */
export { cva, type VariantProps } from "class-variance-authority"
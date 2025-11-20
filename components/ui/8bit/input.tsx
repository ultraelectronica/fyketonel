import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import "./styles/retro.css";

export const inputVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

function Input({ ...props }: BitInputProps) {
  const { className, font, type = "text" } = props;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type={type}
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-background text-foreground rounded-none transition-transform ring-0 border-0 focus:outline-none",
          font !== "normal" && "retro",
          className
        )}
      />

      <div
        className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export { Input };


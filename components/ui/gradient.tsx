import { clsx } from "clsx";

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "bg-linear-115 from-[#EFD5C3] from-28% via-[#958397] via-70% to-[#896978] sm:bg-linear-145"
      )}
    />
  );
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          "absolute -top-44 -right-60 h-[30rem] w-[50rem] transform-gpu md:right-0",
          "bg-gradient-to-br from-[#e4782a] via-[#1c693c] to-[#7b1645]",
          "rotate-[-10deg] rounded-full blur-3xl opacity-30"
        )}
      />
    </div>
  );
}

export function OnboardingBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      {/* Main layer - large soft gradient */}
      <div
        className={clsx(
          "absolute -top-64 -left-96 h-[600px] w-[1200px] transform-gpu",
          "bg-gradient-to-br from-[#EFD5C3] via-[#839791] to-[#896978]",
          "rotate-[-20deg] rounded-full blur-[180px] opacity-70"
        )}
      />

      {/* Secondary layer - more saturated and contrasting */}
      <div
        className={clsx(
          "absolute top-20 right-0 h-[400px] w-[800px] transform-gpu",
          "bg-gradient-to-tr from-[#896978] via-[#839791] to-[#EFD5C3]",
          "rotate-[25deg] rounded-full blur-[100px] opacity-60"
        )}
      />

      {/* Small decorative layer for extra depth */}
      <div
        className={clsx(
          "absolute bottom-10 left-10 h-[300px] w-[300px] transform-gpu",
          "bg-gradient-to-tl from-[#839791] via-[#896978] to-[#EFD5C3]",
          "rotate-[45deg] rounded-full blur-[120px] opacity-50"
        )}
      />
    </div>
  );
}

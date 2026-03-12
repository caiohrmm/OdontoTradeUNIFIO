import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  withText?: boolean;
};

export function BrandLogo({
  className,
  logoClassName,
  textClassName,
  withText = true,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/image.png"
        alt="Logo OdontoTrade"
        width={32}
        height={32}
        className={cn("h-8 w-8 object-contain", logoClassName)}
      />
      {withText ? (
        <span className={cn("font-semibold tracking-tight text-slate-900", textClassName)}>
          OdontoTrade
        </span>
      ) : null}
    </div>
  );
}

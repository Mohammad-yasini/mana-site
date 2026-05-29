"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = { header: ReactNode; footer: ReactNode; children: ReactNode };

export function SiteChrome({ header, footer, children }: Props) {
  const pathname = usePathname() || "/";
  const bare = pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}

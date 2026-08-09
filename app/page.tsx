import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { HeroSection } from "@/components/marketing/hero-section";
import { SummaryPreview } from "@/components/marketing/summary-preview";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { CategoriesPreview } from "@/components/marketing/categories-preview";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-(--container-max) flex-col px-6 divide-y divide-border">
      <HeroSection />
      <SummaryPreview />
      <DashboardPreview />
      <CategoriesPreview />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  // 🔥 FIRST check onboarding
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // 🔥 ONLY fetch insights after confirming user is onboarded
  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;
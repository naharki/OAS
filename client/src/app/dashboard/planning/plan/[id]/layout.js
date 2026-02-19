import PlanActionHeader from "@/components/planning/PlanActionHeader";
import ActionTabs from "./ActionTabs";
import axios from "axios";
import { plansService } from "@/services/planServices";

export default async function PlanLayout({ children, params }) {
  const { id } = await params;
  const plan = await plansService.get(id);
  console.log("plan data", plan.data);

  return (
    <div>
      <div>
        <PlanActionHeader planDetails={plan.data} />
      </div>
      <ActionTabs planId={id} />
      {children}
    </div>
  );
}

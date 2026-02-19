"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { key: "detail", label: "योजना विवरण" },
  { key: "incharge", label: "आयोजनाको इन्चार्ज" },
  { key: "estimate", label: "लागत अनुमान" },
  { key: "target", label: "लक्ष्य प्रविष्टि" },
  { key: "executer", label: "कार्यान्वयन निकाय" },
  { key: "agreement", label: "सम्झौता" },
  { key: "payment", label: "पेश्की भुक्तानी" },
  { key: "evaluation", label: "मूल्याङ्कन" },
  { key: "documents", label: "कागजातहरू" },
];

export default function ActionTabs({ planId }) {
  const pathname = usePathname();
  const router = useRouter();
  console.log("ActionTabs planId:", planId);

  const activeTab = pathname.split("/").pop();

  return (
    <div>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() =>
            router.push(`/dashboard/planning/plan/${planId}/${tab.key}`)
          }
          style={{
            fontWeight: activeTab === tab.key ? "bold" : "normal",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

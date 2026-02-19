"use client";

import {
  BarChart3,
  FileText,
  Users,
  Hospital,
} from "lucide-react";

export default function HomePage() {
  const apps = [
     {
      titleNp: "प्रयोगकर्ता व्यवस्थापन प्रणाली",
      titleEn: "User Management System",
      icon: BarChart3,
      color: "primary",
      url: "/user-management/login/",
    },
    {
      titleNp: "योजना व्यवस्थापन प्रणाली",
      titleEn: "Planning Management System",
      icon: BarChart3,
      color: "primary",
      url: "https://planning.khaireni.com.np",
    },
    {
      titleNp: "दर्ता / चलानी प्रणाली",
      titleEn: "Darta Chalani System",
      icon: FileText,
      color: "success",
      url: "/darta-chalani/login/",
    },
    {
      titleNp: "समिति व्यवस्थापन",
      titleEn: "Committee Management System",
      icon: Users,
      color: "warning",
      url: "https://committee.khaireni.com.np",
    },
    {
      titleNp: "अस्पताल सूचना प्रणाली",
      titleEn: "Hospital Information System",
      icon: Hospital,
      color: "danger",
      url: "https://hospital.khaireni.com.np",
    },
  ];

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* MAIN CONTENT */}
      <div className="container py-5 flex-grow-1">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-1">खैरेनी गाउँपालिका</h2>
          <p className="text-muted mb-0">
            Integrated Digital Governance Systems
          </p>
        </div>

        {/* Apps Grid */}
        <div className="row g-4">
          {apps.map((app, index) => {
            const Icon = app.icon;

            return (
              <div
                key={index}
                className="col-xl-3 col-lg-4 col-md-6"
                style={{
                  animation: "fadeUp 0.6s ease forwards",
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="card h-100 border-0 shadow-sm text-center p-4"
                  style={{ transition: "all 0.25s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 25px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 .125rem .25rem rgba(0,0,0,.075)";
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`rounded-circle bg-${app.color} bg-opacity-10 d-flex align-items-center justify-content-center mx-auto`}
                    style={{ width: 72, height: 72 }}
                  >
                    <Icon
                      size={32}
                      className={`text-${app.color}`}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Text */}
                  <div className="card-body px-2">
                    <h6 className="fw-semibold mt-3 mb-1">
                      {app.titleNp}
                    </h6>
                    <small className="text-muted d-block mb-3">
                      {app.titleEn}
                    </small>

                    <a
                      href={app.url}
                      className={`btn btn-outline-${app.color} btn-sm`}
                    >
                      प्रणाली खोल्नुहोस्
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-3 small text-muted border-top">
        © {new Date().getFullYear()} Khaireni Rural Municipality |Designed & Developed by
        Sujan Naharki Chhetri
      </footer>

      {/* Inline animation */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

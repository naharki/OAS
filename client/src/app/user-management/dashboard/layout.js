'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { LogOut, Menu } from 'lucide-react';
import { useOffice } from "@/hook/useOffice";
import axios from 'axios';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  // ✅ Hook is NOW inside component
  const { office, loading } = useOffice();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(s => !s);
  const [loadingPage, setLoadingPage] = useState(true);
  
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/me/", { withCredentials: true })
      .then(() => setLoadingPage(false))
      .catch(() => router.replace("/user-management/login"));
  }, []);

  if (loadingPage) return null; // hide content until auth verified

  const handleLogout = async() => {
   try {
    await axios.post(
      "http://127.0.0.1:8000/api/users/logout/",{},
      { withCredentials: true }
    );
    router.push("/"); // or /login
  } catch (err) {
    console.error("Logout failed", err);
  }
  };

  const initials = (office?.name || '')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar collapsed={sidebarCollapsed} />

      <main className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f6f7fb', overflow: 'auto' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 3000 }}>
          <div className="container-fluid px-3" style={{ background: 'linear-gradient(90deg, #ffffff 0%, #f8f9ff 100%)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="d-flex align-items-center justify-content-between" style={{ height: 64 }}>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-ghost me-2 d-flex align-items-center justify-content-center"
                  onClick={toggleSidebar}
                  style={{ width:42, height:42, borderRadius:8 }}
                >
                  <Menu size={22} />
                </button>

                <div
                  style={{
                    width:44,
                    height:44,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg,#6f8cff,#3aa0ff)',
                    color:'#fff',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    fontWeight:700,
                    marginRight:12
                  }}
                >
                  {initials}
                </div>

                <div>
                  {/* ✅ OFFICE NAME */}
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>
                    {loading ? 'Loading...' : office?.name}
                  </div>
                  <div className="text-muted small">Dashboard</div>
                </div>
              </div>

              <button
                className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: 20 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

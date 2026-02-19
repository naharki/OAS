"use client"
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
//   const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username,
        password,
      }, {
        withCredentials: true,
      });

      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        withCredentials: true,
      });
     
      const user = res.data;

      // 3️⃣ redirect based on role
    //   if (user.role === "superadmin") {
    //     router.push("/superadmin");
    //     return;
    //   }

      const hasApp = user.accessible_apps.some((a) => a.name === "user-management");
      if (!hasApp) {
        alert("You do not have access to this app");
        return;
      }

      router.push(`/user-management/dashboard`);
    } catch (err) {
      // Handle backend errors
      if (err.response) {
        // Server responded with status code outside 2xx
        setError(err.response.data.error || "Login failed");
      } else if (err.request) {
        // Request made but no response
        setError("Server did not respond. Try again later.");
      } else {
        // Something else
        setError("An unexpected error occurred");
      }
    }
  };
  const handleCancel = () => {
    router.push("/");
  };

  return (
  <div
       className="d-flex align-items-center justify-content-center vh-100"
       style={{ backgroundColor: "#f8f9fa" }}
     >
       <div
         className="card p-5 shadow-sm border-0"
         style={{
           width: 360,
           borderRadius: "1rem",
           transition: "transform 0.3s ease, box-shadow 0.3s ease",
         }}
       >
        <h4 className="text-center mb-4 fw-bold text-primary">User Management</h4>
         <h3 className="text-center mb-4 fw-bold text-dark">Login</h3>
         <form onSubmit={handleLogin}>
           {/* username/email Input */}
           <div className="mb-4 position-relative">
             <label className="form-label fw-semibold">Email</label>
             <div className="input-group">
               <span className="input-group-text bg-white border-end-0">
                 <Mail size={18} />
               </span>
               <input
                 type="text"
                 className="form-control border-start-0"
                 placeholder="Enter your username/email"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 required
                 style={{
                   transition: "all 0.3s ease",
                 }}
                 onFocus={(e) => (e.target.style.boxShadow = "0 0 8px #2575fc")}
                 onBlur={(e) => (e.target.style.boxShadow = "none")}
               />
             </div>
           </div>

           {/* Password Input */}
           <div className="mb-4 position-relative">
             <label className="form-label fw-semibold">Password</label>
             <div className="input-group">
               <span className="input-group-text bg-white border-end-0">
                 <Lock size={18} />
               </span>
               <input
                 type="password"
                 className="form-control border-start-0"
                 placeholder="Enter your password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 style={{
                   transition: "all 0.3s ease",
                 }}
                 onFocus={(e) => (e.target.style.boxShadow = "0 0 8px #2575fc")}
                 onBlur={(e) => (e.target.style.boxShadow = "none")}
               />
             </div>
           </div>
           {/* Error message */}
          {error && (
            <p className="text-danger text-center mb-3 fw-semibold">{error}</p>
          )}


           {/* Login Button */}
           <button
             type="submit"
             className="btn btn-primary w-100 fw-bold"
             style={{
               transition: "all 0.3s ease",
             }}
             onMouseEnter={(e) =>
               (e.target.style.transform = "scale(1.05)")
             }
             onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
           >
             Login
           </button>
           <button
             type="button"
             className="btn btn-danger w-100 mt-2 fw-bold"
              style={{  
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              onClick={handleCancel}
           >
             Cancel
           </button>
         </form>

         {/* Footer Links */}
         <p className="text-center mt-3 text-muted">
           Forgot your password?{" "}
           <a href="#" className="text-primary fw-semibold">
             Reset
           </a>
         </p>
       </div>
     </div>
   );
}

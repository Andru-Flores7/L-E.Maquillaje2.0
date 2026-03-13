import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Tips from "./pages/Tips";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import Checkout from "./pages/Checkout";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const [session, setSession] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    // Check active session on load
    import("./services/supabaseClient").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        checkAdminRole(session);
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        checkAdminRole(session);
      });
    });
  }, []);

  const checkAdminRole = (currentSession) => {
    // Basic verification: If there is a session, we consider them an admin
    // In a real production app with multiple roles, you would query a profiles table here
    // or check JWT claims to ensure they have the 'admin' role.
    if (currentSession?.user) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    const { supabase } = await import("./services/supabaseClient");
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="app-main">
        <Toaster position="bottom-right" reverseOrder={false} />
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tips" element={<Tips />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPanel session={session} onLogout={handleLogout} />
              ) : (
                <AdminLogin
                  onLoginSuccess={(sess) => {
                    setSession(sess);
                    setIsAdmin(true);
                  }}
                />
              )
            }
          />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

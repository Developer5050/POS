"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className="flex flex-col transition-all duration-300 h-screen overflow-hidden flex-1"
        style={{
          marginLeft: sidebarCollapsed ? "5%" : "18%",
        }}
      >
        <Navbar onMenuClick={toggleSidebar} collapsed={sidebarCollapsed} />

        <main className="flex-1 p-6 overflow-auto pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
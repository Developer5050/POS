"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers, FaMoneyBillWave, FaUserCog, FaCog } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FiBox, FiTruck } from "react-icons/fi";
import { IoCartOutline, IoHomeOutline } from "react-icons/io5";
import { LiaCommentDollarSolid } from "react-icons/lia";

interface SidebarProps {
  collapsed?: boolean;
}

const menuItems = [
  { name: "Dashboard", href: "/", icon: MdOutlineDashboard },
  { name: "Products", href: "/products", icon: FiBox },
  { name: "Customers", href: "/customers", icon: FaUsers },
  { name: "New Orders", href: "/orders", icon: IoCartOutline },
  { name: "Suppliers", href: "/suppliers", icon: FiTruck },
  { name: "Invoices", href: "/invoices", icon: LiaCommentDollarSolid },
  { name: "Expenses", href: "/expenses", icon: FaMoneyBillWave },
  { name: "Employees", href: "/employees", icon: FaUserCog },
  { name: "Settings", href: "/settings", icon: FaCog },
];

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-[#020b1a] dark:bg-[#020b1a] h-screen fixed top-0 left-0 transition-all duration-300 overflow-y-auto`}
      style={{ width: collapsed ? "5%" : "18%" }}
    >
      <div className="flex flex-col h-full overflow-hidden">

        <div
          className={`flex items-center gap-2 h-16 px-4 transition-all duration-300 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="bg-[#27AA83] text-white p-2 rounded-lg flex items-center justify-center">
            <IoHomeOutline className={`text-xl`} />
          </div>
          {!collapsed && <h1 className="text-md font-bold text-white">RetailPOS</h1>}
        </div>

        <div className="border-b border-zinc-700 dark:border-zinc-300"></div>

        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 p-2 rounded-md text-[#C5CAD3] text-[13px] cursor-pointer transition-colors duration-200
                    ${isActive ? "bg-[#27AA83] text-white" : "hover:bg-[#1a253a]"}`}
                  >
                    <Icon className="text-lg" />
                    {!collapsed && item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
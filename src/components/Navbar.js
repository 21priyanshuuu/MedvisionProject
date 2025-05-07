"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (data.isAuthenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);

          // Fetch user role only if authenticated
          const roleRes = await fetch(
            `/api/users?email=${data.user.email}&type=role`
          );
          const roleData = await roleRes.json();

          if (roleRes.ok) {
            setRole(roleData.role);
          } else {
            console.error("Failed to fetch user role:", roleData.error);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthStatus();
  }, []);

  // Define menu items based on user role
  const roleMenuItems = {
    Patient: [
      { label: "Search Doctors", path: "/pages/patient/searchdocs" },
      { label: "Appointments", path: "/pages/patient/myappointments" },
      { label: "Chat", path: "/pages/chat" },
    ],
    Doctor: [
      { label: "My Profile", path: "/pages/doctor/docdetails" },
      { label: "Patient List", path: "/pages/doctor/patients" },
      { label: "Chat", path: "/pages/chat" },
    ],
    Hospital: [
      { label: "Manage Staff", path: "/pages/hospital/staff" },
      { label: "Reports", path: "/pages/hospital/reports" },
    ],
  };

  return (
    <nav className="bg-gray-900 text-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <Link href="/">Healthcare A.I.</Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Button variant="ghost" className="hover:bg-gray-800" asChild>
              <Link href="/">Home</Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="hover:bg-gray-800" asChild>
              <Link href="/pages/about">About</Link>
            </Button>
          </li>
          <li>
            <Button
              className="bg-gradient-to-r from-purple-600 to-yellow-400 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
              asChild
            >
              <Link href="/report">✨ Ai dignosis</Link>
            </Button>
          </li>

          {/* Dynamic Role-Based Menu */}
          {loading ? (
            <li className="text-gray-400">Loading...</li>
          ) : (
            roleMenuItems[role]?.map((item) => (
              <li key={item.label}>
                <Button variant="ghost" className="hover:bg-gray-800" asChild>
                  <Link href={item.path}>{item.label}</Link>
                </Button>
              </li>
            ))
          )}
        </ul>

        {/* Authentication & Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="border-gray-500 text-black hover:bg-gray-700"
                asChild
              >
                <Link href="/pages/profile">
                  {user?.given_name || "Profile"}
                </Link>
              </Button>
              <LogoutLink className="bg-red-600 hover:bg-red-500"></LogoutLink>
            </>
          ) : (
            <LoginLink>
              <Button className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                Login
              </Button>
            </LoginLink>
          )}
        </div>

        {/* Mobile Menu (Hamburger) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu className="w-6 h-6 text-gray-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900 text-gray-200">
              <ul className="flex flex-col space-y-6 text-lg mt-6">
                <li>
                  <Link href="/" className="hover:text-gray-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pages/about" className="hover:text-gray-400">
                    About
                  </Link>
                </li>
                {/* <li>
                  <Link href="/pages/contact" className="hover:text-gray-400">Contact</Link>
                </li> */}

                {/* Dynamic Role-Based Menu */}
                {loading ? (
                  <li className="text-gray-400">Loading...</li>
                ) : (
                  roleMenuItems[role]?.map((item) => (
                    <li key={item.label}>
                      <Link href={item.path} className="hover:text-gray-400">
                        {item.label}
                      </Link>
                    </li>
                  ))
                )}
              </ul>

              {/* Auth Buttons in Mobile View */}
              <div className="mt-6">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-500 hover:bg-gray-700"
                      asChild
                    >
                      <Link href="/pages/profile">
                        {user?.given_name || "Profile"}
                      </Link>
                    </Button>
                    <LogoutLink>
                      <Button
                        variant="destructive"
                        className="w-full bg-red-600 hover:bg-red-500 mt-4"
                      >
                        Logout
                      </Button>
                    </LogoutLink>
                  </>
                ) : (
                  <LoginLink>
                    <Button className="w-full bg-gray-700 text-gray-200 hover:bg-gray-600 mt-4">
                      Login
                    </Button>
                  </LoginLink>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

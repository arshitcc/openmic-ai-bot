"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BotIcon,
  PhoneIcon,
  UsersIcon,
  BarChart3Icon,
  HomeIcon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Bots", href: "/bots", icon: BotIcon },
  { name: "Calls", href: "/calls", icon: PhoneIcon },
  { name: "Patients", href: "/patients", icon: UsersIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart3Icon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <BotIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                OpenMic AI
              </span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Medical Intake System</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

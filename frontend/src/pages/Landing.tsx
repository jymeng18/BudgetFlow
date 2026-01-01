/**
 * Filename: Landing.tsx
 *
 * Desc: Landing page for webapp, start at route '/'
 *
 * Author: Jerry Meng
 *
 * Last Modified: Dec 2025
 */

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  ClipboardList,
  Leaf,
  Heart,
  CreditCard,
  PiggyBank,
} from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";

interface Feature {
  icon: ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
}

const Landing = () => {
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: <ClipboardList />,
      title: "Manage your finances",
      subtitle: "Track every dollar in your bank account with ease.",
      linkText: "Be Organized",
    },
    {
      icon: <CreditCard />,
      title: "Pay off all debts",
      subtitle: "Track every dollar in your bank account with ease.",
      linkText: "Be Organized",
    },
    {
      icon: <Heart />,
      title: "Stop arguing about money with my partner",
      subtitle: "Get on the same page with shared budgets",
      linkText: "Conquer Conflict",
    },
    {
      icon: <PiggyBank />,
      title: "Save more money without feeling restricted",
      subtitle: "Build savings while enjoying life",
      linkText: "Save Yourself",
    },
  ];

  return (
    <div>
        {/* 5 Cards Section */}
        <div>
            <Sidebar />
            <h1>LANDING PAGE!</h1>
        </div>
    </div>
  )





};

export default Landing;

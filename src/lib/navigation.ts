import {
  BookOpenText,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  testId: string;
  adminOnly?: boolean;
};

export type NavSection = { title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        testId: "nav-link-dashboard",
      },
      {
        href: "/tasks",
        label: "Tarefas",
        icon: ListTodo,
        testId: "nav-link-tasks",
      },
    ],
  },
  {
    title: "Prática",
    items: [
      {
        href: "/challenges/locators",
        label: "Desafios de Localizadores",
        icon: Target,
        testId: "nav-link-locators",
      },
      {
        href: "/challenges/assertions",
        label: "Desafios de Assertions",
        icon: CheckCircle2,
        testId: "nav-link-assertions",
      },
    ],
  },
  {
    title: "Recursos",
    items: [
      {
        href: "/api-docs",
        label: "Documentação da API",
        icon: BookOpenText,
        testId: "nav-link-api-docs",
      },
      {
        href: "/admin",
        label: "Painel Admin",
        icon: ShieldCheck,
        testId: "nav-link-admin",
        adminOnly: true,
      },
    ],
  },
];

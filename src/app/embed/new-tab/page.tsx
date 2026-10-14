import type { Metadata } from "next";
import { NewTabContent } from "@/components/challenges/embed/new-tab-content";

export const metadata: Metadata = { title: "Comprovante de inscrição" };

export default async function NewTabPage({
  searchParams,
}: PageProps<"/embed/new-tab">) {
  const { source } = await searchParams;
  const value = Array.isArray(source) ? source[0] : source;

  return <NewTabContent source={value === "popup" ? "popup" : "link"} />;
}

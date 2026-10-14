import type { Metadata } from "next";
import { IframeForm } from "@/components/challenges/embed/iframe-form";

export const metadata: Metadata = { title: "Formulário de inscrição" };

export default function IframeFormPage() {
  return (
    <main aria-label="Formulário de inscrição">
      <IframeForm />
    </main>
  );
}

"use client";

import { RouteError } from "@/components/shared/route-error";

export default function AssertionChallengesError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <RouteError {...props} title="Não foi possível carregar o desafio" />;
}

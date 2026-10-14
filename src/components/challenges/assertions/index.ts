import type { ComponentType } from "react";
import { ApiResponsesChallenge } from "./api-responses";
import { AttributesAndClassesChallenge } from "./attributes-and-classes";
import { CartTotalsChallenge } from "./cart-totals";
import { FormValidationChallenge } from "./form-validation";
import { ListCountChallenge } from "./list-count";
import { SortingChallenge } from "./sorting";
import { StateChallenge } from "./state";
import { TextChallenge } from "./text";
import { UrlAndTitleChallenge } from "./url-and-title";
import { VisibilityChallenge } from "./visibility";

/** Componente interativo de cada desafio, indexado pelo slug do catálogo. */
export const ASSERTION_CHALLENGE_COMPONENTS: Record<
  string,
  ComponentType<{ nonce: string }>
> = {
  text: TextChallenge,
  visibility: VisibilityChallenge,
  state: StateChallenge,
  "attributes-and-classes": AttributesAndClassesChallenge,
  "url-and-title": UrlAndTitleChallenge,
  "list-count": ListCountChallenge,
  "cart-totals": CartTotalsChallenge,
  "form-validation": FormValidationChallenge,
  sorting: SortingChallenge,
  "api-responses": ApiResponsesChallenge,
};

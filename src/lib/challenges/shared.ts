// Tipos e textos comuns às áreas de desafios (localizadores e assertions).

export const CHALLENGE_LEVELS = ["easy", "medium", "hard"] as const;
export type ChallengeLevel = (typeof CHALLENGE_LEVELS)[number];

export const LEVEL_LABELS: Record<ChallengeLevel, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

/** Área à qual um desafio pertence; define a URL e o registro de componentes. */
export type ChallengeArea = "locators" | "assertions";

export type Challenge = {
  slug: string;
  number: number;
  title: string;
  level: ChallengeLevel;
  /** Frase curta exibida no catálogo. */
  summary: string;
  /** Explicação exibida na página do desafio. */
  description: string;
  /** O que o aluno deve localizar ou validar. */
  objectives: string[];
  /** Conteúdo do bloco "Dica". Trechos entre crases viram <code>. */
  hints: string[];
  tags: string[];
  /**
   * Desafios sobre ausência de id/data-testid: a área de prática não recebe
   * nenhum desses atributos, nem no contêiner.
   */
  bare?: boolean;
};

/** Lê o parâmetro ?level= da URL; valores desconhecidos são ignorados. */
export function parseLevel(value: string | string[] | undefined) {
  const single = Array.isArray(value) ? value[0] : value;
  return CHALLENGE_LEVELS.find((level) => level === single);
}

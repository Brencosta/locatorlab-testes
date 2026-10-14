/**
 * Centavos -> "R$ 1.234,56".
 * Feito à mão (com espaço comum depois de "R$") para o texto ser idêntico em
 * qualquer navegador e fácil de comparar nos testes.
 */
export function formatBRL(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  const reais = String(Math.floor(absolute / 100)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );
  const centavos = String(absolute % 100).padStart(2, "0");
  return `${sign}R$ ${reais},${centavos}`;
}

/** "2024-03-15" -> "15/03/2024" */
export function formatDateBR(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

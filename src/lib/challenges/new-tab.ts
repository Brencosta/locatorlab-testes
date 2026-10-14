// Dados compartilhados entre o desafio 18 e a página que ele abre em outra aba.
export const NEW_TAB_PATH = "/embed/new-tab";
export const NEW_TAB_CHANNEL = "locatorlab-new-tab";
export const RECEIPT_CODE = "LL-2048";

export type NewTabMessage = { code: string; source: string };

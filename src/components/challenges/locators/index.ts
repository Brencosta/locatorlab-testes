import type { ComponentType } from "react";
import { BasicAttributesChallenge } from "./basic-attributes";
import { ConditionalButtonChallenge } from "./conditional-button";
import { DataTestidChallenge } from "./data-testid";
import { DialogsChallenge } from "./dialogs";
import { DragAndDropChallenge } from "./drag-and-drop";
import { DropdownsChallenge } from "./dropdowns";
import { DynamicIdsChallenge } from "./dynamic-ids";
import { FileUploadChallenge } from "./file-upload";
import { HoverMenuChallenge } from "./hover-menu";
import { IframeChallenge } from "./iframe";
import { NestedElementsChallenge } from "./nested-elements";
import { NewTabsChallenge } from "./new-tabs";
import { PaginatedTableChallenge } from "./paginated-table";
import { RelativeLocatorsChallenge } from "./relative-locators";
import { RepeatedItemsChallenge } from "./repeated-items";
import { SelectionControlsChallenge } from "./selection-controls";
import { ShadowDomChallenge } from "./shadow-dom";
import { TextAndRoleChallenge } from "./text-and-role";
import { WaitsChallenge } from "./waits";

/** Componente interativo de cada desafio, indexado pelo slug do catálogo. */
export const LOCATOR_CHALLENGE_COMPONENTS: Record<
  string,
  ComponentType<{ nonce: string }>
> = {
  "basic-attributes": BasicAttributesChallenge,
  "relative-locators": RelativeLocatorsChallenge,
  "dynamic-ids": DynamicIdsChallenge,
  "data-testid": DataTestidChallenge,
  "text-and-role": TextAndRoleChallenge,
  "repeated-items": RepeatedItemsChallenge,
  "nested-elements": NestedElementsChallenge,
  iframe: IframeChallenge,
  "shadow-dom": ShadowDomChallenge,
  waits: WaitsChallenge,
  "conditional-button": ConditionalButtonChallenge,
  dropdowns: DropdownsChallenge,
  "selection-controls": SelectionControlsChallenge,
  dialogs: DialogsChallenge,
  "hover-menu": HoverMenuChallenge,
  "drag-and-drop": DragAndDropChallenge,
  "file-upload": FileUploadChallenge,
  "new-tabs": NewTabsChallenge,
  "paginated-table": PaginatedTableChallenge,
};

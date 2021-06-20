import { KeyboardEventCodes, KeyboardEventKeys } from "./keyboardEventOptions";

export interface IUseKeyProps<CodeType extends "key" | "code" = "key"> {
  codeType?: CodeType;
  keyFunction?: "keydown" | "keyup";
  key: CodeType extends "key" ? KeyboardEventKeys : KeyboardEventCodes;
  action: () => void;
}

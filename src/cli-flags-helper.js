import { targetList } from "./targetList.json";

export const targetSet = new Set([...targetList]);

export function getTarget() {
  const onlyArg = import.meta.env.VITE_ONLY;
  return targetSet.has(onlyArg) ? [onlyArg] : [...targetSet];
}

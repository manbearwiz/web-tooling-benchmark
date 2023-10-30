import { targetList as list } from "./targetList.json";

export const targetList = new Set([...list]);

function getOnlyFlag() {
  const onlyIndex = process.argv.indexOf("--only");
  if (onlyIndex != -1) {
    return process.argv[onlyIndex + 1];
  }
}

export function getTarget() {
  const onlyArg = getOnlyFlag();
  if (targetList.has(onlyArg)) {
    return [onlyArg];
  } else if (typeof ONLY != "undefined" && targetList.has(ONLY)) {
    return [ONLY];
  } else {
    return [...targetList];
  }
}

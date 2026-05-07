export interface ParsedScopeSaveArgs {
  id: string;
  extends: string[];
  whitelist: string[];
  blacklist: string[];
}

export function parseScopeSaveArgs(args: string[]): ParsedScopeSaveArgs {
  if (args.length === 0) {
    throw new Error(
      'usage: ai:scope save <id> [--extends a,b] [--whitelist x.*,y.*] [--blacklist *.delete]',
    );
  }
  const result: ParsedScopeSaveArgs = {
    id: args[0],
    extends: [],
    whitelist: [],
    blacklist: [],
  };
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    const value = args[i + 1];
    if (flag === '--extends' || flag === '--whitelist' || flag === '--blacklist') {
      if (value === undefined) throw new Error(`missing value for ${flag}`);
      const split = value.split(',').map((s) => s.trim()).filter(Boolean);
      if (flag === '--extends') result.extends = split;
      if (flag === '--whitelist') result.whitelist = split;
      if (flag === '--blacklist') result.blacklist = split;
      i++;
    } else {
      throw new Error(`unknown flag: ${flag}`);
    }
  }
  return result;
}

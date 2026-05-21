export type CardSegment =
  | { kind: 'text'; markdown: string }
  | {
      kind: 'tool-call';
      id: string;
      name: string;
      argsPreview: string;
      resultPreview?: string;
      error?: boolean;
    };

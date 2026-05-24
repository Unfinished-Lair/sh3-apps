export type CardSegment =
  | { kind: 'text'; markdown: string }
  | { kind: 'reasoning'; markdown: string }
  | {
      kind: 'tool-call';
      id: string;
      name: string;
      argsPreview: string;
      resultPreview?: string;
      error?: boolean;
    };

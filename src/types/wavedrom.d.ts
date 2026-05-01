declare module 'wavedrom' {
  export function processAll(): void;
  export function eva(id: string): any;
  export function renderAny(index: number, source: any, waveSkin: any, notFirstSignal?: boolean): any[];
  export function renderWaveForm(index: number, source: any, output: string, notFirstSignal?: boolean): void;
  export function renderWaveElement(index: number, source: any, outputElement: HTMLElement, waveSkin: any, notFirstSignal?: boolean): void;
  export function editorRefresh(): void;
  export const waveSkin: any;
  export const version: string;
  export const onml: {
    stringify(arr: any[]): string;
    tt(...args: any[]): any[];
  };
}

declare module '*.js' {
  const content: any;
  export default content;
}

declare module "@arcblock/did-connect";

declare module "@arcblock/ux";

declare module 'vite-plugin-blocklet' {
  export interface BlockletPluginOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export function createBlockletPlugin(options?: BlockletPluginOptions): import('vite').Plugin;
}

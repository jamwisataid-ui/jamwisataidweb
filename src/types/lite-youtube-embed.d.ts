declare module "lite-youtube-embed";

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": import("react").DetailedHTMLProps<
        import("react").HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        videoid: string;
        playlabel?: string;
        params?: string;
      };
    }
  }
}

import type { SVGProps } from "react";
const SvgSlider = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="m7.4 4.2 4.6 6.134.641-.853L16.6 4.2zm3.2 1.6h2.8L12 7.666zM3.2 12v8h1.6v-8zm12 0v8h1.6v-8zm12 0v8h1.6v-8zm-21 2v4h1.6v-4zm3 0v4h1.6v-4zm3 0v4h1.6v-4zm6 0v4h1.6v-4zm3 0v4h1.6v-4zm3 0v4h1.6v-4zM18 21.666l-.641.853L13.4 27.8h9.2zm0 2.668 1.4 1.866h-2.8z" />
  </svg>
);
export default SvgSlider;

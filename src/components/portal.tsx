import { useEffect } from "react";
import { createPortal } from "react-dom";

interface IPortalProps {
  children: JSX.Element;
}
const Portal = ({ children }: IPortalProps): JSX.Element => {
  const mount: HTMLElement = document.getElementById("portal-root")!;
  const el = document.createElement("div");

  useEffect(() => {
    mount && mount.appendChild(el);
    return () => {
      mount && mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;

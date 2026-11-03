import { useEffect, useState } from "react";

import { safeURL } from "../../utils/urls.js";
export function Image({ src, alt = "", ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const url = safeURL(src);
  return !url || failed ? null : (
    <img
      {...props}
      src={url}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

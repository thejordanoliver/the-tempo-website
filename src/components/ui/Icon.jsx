import ArrowBackOutline from "react-ionicons/lib/ArrowBackOutline.js";
import ArrowDownOutline from "react-ionicons/lib/ArrowDownOutline.js";
import ArrowForwardOutline from "react-ionicons/lib/ArrowForwardOutline.js";
import BookmarkOutline from "react-ionicons/lib/BookmarkOutline.js";
import ChatbubblesOutline from "react-ionicons/lib/ChatbubblesOutline.js";
import ChevronBackOutline from "react-ionicons/lib/ChevronBackOutline.js";
import ChevronForwardOutline from "react-ionicons/lib/ChevronForwardOutline.js";
import CloseOutline from "react-ionicons/lib/CloseOutline.js";
import Ellipse from "react-ionicons/lib/Ellipse.js";
import HeartOutline from "react-ionicons/lib/HeartOutline.js";
import LocationOutline from "react-ionicons/lib/LocationOutline.js";
import MenuOutline from "react-ionicons/lib/MenuOutline.js";
import MoonOutline from "react-ionicons/lib/MoonOutline.js";
import OpenOutline from "react-ionicons/lib/OpenOutline.js";
import ShareSocialOutline from "react-ionicons/lib/ShareSocialOutline.js";
import StarOutline from "react-ionicons/lib/StarOutline.js";
import SunnyOutline from "react-ionicons/lib/SunnyOutline.js";
import TrendingUpOutline from "react-ionicons/lib/TrendingUpOutline.js";
import "./Icon.css";

// Import individual icons to avoid bundling the package's entire icon catalog.
const icons = {
  menu: MenuOutline,
  close: CloseOutline,
  sun: SunnyOutline,
  moon: MoonOutline,
  heart: HeartOutline,
  share: ShareSocialOutline,
  bookmark: BookmarkOutline,
  "arrow-back": ArrowBackOutline,
  "arrow-down": ArrowDownOutline,
  "arrow-forward": ArrowForwardOutline,
  chatbubbles: ChatbubblesOutline,
  "chevron-back": ChevronBackOutline,
  "chevron-forward": ChevronForwardOutline,
  ellipse: Ellipse,
  location: LocationOutline,
  open: OpenOutline,
  star: StarOutline,
  "trending-up": TrendingUpOutline,
};

// Decorative icons inherit their parent's theme color. Buttons and links own
// the accessible label, so screen readers don't announce the SVG separately.
export default function Icon({ name, size = 22, className = "" }) {
  if (!Object.hasOwn(icons, name)) return null;
  const Component = icons[name];
  return (
    <span className={`tempo-icon ${className}`.trim()} aria-hidden="true">
      <Component
        color="currentColor"
        width={`${size}px`}
        height={`${size}px`}
      />
    </span>
  );
}

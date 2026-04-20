import { platformMeta } from "../lib/platform";

const PlatformIcon = ({ platform, className = "" }) => {
    const { Icon, color } = platformMeta(platform);
    return <Icon className={`${color} ${className}`} aria-hidden="true" />;
};

export default PlatformIcon;

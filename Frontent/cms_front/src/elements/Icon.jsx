import React from "react";
// Usage: <Icon icon={FaUser} size={20} color="#198754" />
export default function Icon({ icon: IconComponent, ...props }) {
  return IconComponent ? <IconComponent {...props} /> : null;
}

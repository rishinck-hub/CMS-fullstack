import React from "react";
export default function Avatar({ src, alt = "Avatar", size = 40, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-circle ${className}`}
    />
  );
}

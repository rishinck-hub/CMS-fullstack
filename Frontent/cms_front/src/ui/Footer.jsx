import React from "react";
export default function Footer() {
  return (
    <footer className="bg-light text-center py-2 mt-auto border-top">
      <span className="text-muted">&copy; {new Date().getFullYear()} Clinic Management System</span>
    </footer>
  );
}

import { useContext } from "react";
import { RoleContext } from "../context/RoleContext";

export default function useRole() {
  return useContext(RoleContext);
}

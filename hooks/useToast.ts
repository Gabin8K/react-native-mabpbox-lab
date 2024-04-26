import { ToastContext } from "@/providers/ToastProvider";
import { useContext } from "react";

export default function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return toast;
}
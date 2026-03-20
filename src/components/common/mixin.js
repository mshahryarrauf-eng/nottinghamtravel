"use client";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#1e293b",
  color: "#fff",
  customClass: {
    popup: "rounded-xl shadow-lg",
  },
});

export const showAlert = (type = "success", message = "Done!") => {
  Toast.fire({
    icon: type,
    title: message,
  });
};

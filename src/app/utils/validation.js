
export function validateRegisterInput({ name, email, password, phone }) {
  if (!name || !email || !password || !phone) {
    return { valid: false, error: "All fields are required" };
  }

  if (name.length < 3) {
    return { valid: false, error: "Name must be at least 3 characters long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long" };
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: "Invalid phone number format" };
  }

  return { valid: true };
}

export const validateSignup = ({ name, email, phone, password }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Full name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Valid email is required.";
  if (!phone || !/^[0-9]{10,15}$/.test(phone))
    errors.phone = "Enter a valid phone number (10–15 digits).";
  if (!password || password.length < 6)
    errors.password = "Password must be at least 6 characters long.";

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
export const validateContact = ({ name, email, phone , subject , message }) => {
  if (!name || !email || !subject || !phone || !message) {
    return { valid: false, error: "All fields are required" };
  }

  if (name.length < 3) {
    return { valid: false, error: "Name must be at least 3 characters long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}
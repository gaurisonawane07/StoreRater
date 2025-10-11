// validators/validators.js
export function validateName(name) {
  if (!name) return { valid: false, msg: 'Name required' };
  if (name.length < 20) return { valid: false, msg: 'Name must be at least 20 characters' };
  if (name.length > 60) return { valid: false, msg: 'Name must be at most 60 characters' };
  return { valid: true };
}

export function validateAddress(address) {
  if (!address) return { valid: true }; // optional in some flows
  if (address.length > 400) return { valid: false, msg: 'Address must be at most 400 characters' };
  return { valid: true };
}

export function validatePassword(password) {
  if (!password) return { valid: false, msg: 'Password required' };
  if (password.length < 8 || password.length > 16) return { valid: false, msg: 'Password must be 8-16 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, msg: 'Password must include at least one uppercase letter' };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, msg: 'Password must include at least one special character' };
  return { valid: true };
}

export function validateEmail(email) {
  if (!email) return { valid: false, msg: 'Email required' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false, msg: 'Email is invalid' };
  return { valid: true };
}

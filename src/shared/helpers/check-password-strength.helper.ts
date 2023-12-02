export enum StrengthPassword {
  strong,
  medium,
  weak,
}

export function checkPasswordStrength(password: string): StrengthPassword {
  const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;

  if (strongRegex.test(password)) {
    return StrengthPassword.strong;
  } else if (mediumRegex.test(password)) {
    return StrengthPassword.medium;
  } else {
    return StrengthPassword.weak;
  }
}

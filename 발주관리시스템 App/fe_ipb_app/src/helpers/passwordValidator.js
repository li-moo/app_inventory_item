export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 4) return '암호는 5자 이상이어야 합니다.'
  return ''
}

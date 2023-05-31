export function identifierValidator(number) {
  const re = /^\d+$/
  if (!number) return "ID를 입력해주세요."
  if (!re.test(number)) return '숫자로만 구성된 ID를 입력해주세요.'
  return ''
}
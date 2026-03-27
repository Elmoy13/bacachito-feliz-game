const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXZ';
const DIGITS = '0123456789';

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
  }
  for (let i = 0; i < 2; i++) {
    code += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return code;
}

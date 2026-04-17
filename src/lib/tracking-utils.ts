/**
 * Gera um código de rastreio aleatório no formato padrão (2 letras + 9 números + BR).
 * Ex: AB123456789BR
 */
export function generateMockTrackingCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                 letters.charAt(Math.floor(Math.random() * letters.length));
  const numbers = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${numbers}BR`;
}
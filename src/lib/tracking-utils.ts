/**
 * Gera um código de rastreio seguindo o padrão:
 * BR + 4 números + 1 letra + 3 números + BR
 * Ex: BR1234A567BR
 */
export function generateMockTrackingCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  const num4 = Math.floor(1000 + Math.random() * 9000).toString(); // 4 números
  const char = letters.charAt(Math.floor(Math.random() * letters.length)); // 1 letra
  const num3 = Math.floor(100 + Math.random() * 900).toString(); // 3 números
  
  return `BR${num4}${char}${num3}BR`;
}
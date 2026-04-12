/**
 * Retratos tipo “foto de perfil” (sem selfie em espelho), género alinhado ao nome.
 * Índices fixos → mesma pessoa por review em cada build; podes trocar por ficheiros em
 * `public/images/testimonials/profiles/` quando tiveres fotos reais.
 */
export function reviewPortraitMan(seed: number) {
  return `https://randomuser.me/api/portraits/men/${seed}.jpg`;
}

export function reviewPortraitWoman(seed: number) {
  return `https://randomuser.me/api/portraits/women/${seed}.jpg`;
}

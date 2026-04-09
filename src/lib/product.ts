export const PRODUCT = {
  id: "camisa-brasil-estilizada",
  name: "Camisa do Brasil Estilizada",
  shortName: "Brasil Estilizada",
  priceFormatted: "R$ 69,00",
  priceCents: 6900,
  currency: "BRL",
} as const;

/** Vídeo principal — agora no topo do site. */
export const HERO_VIDEO_WEBM = "/videos/camisa-galeria-detail.webm" as const;
export const HERO_VIDEO_MP4 = "/videos/camisa-galeria-detail.mp4" as const;

/** Imagem de poster / LCP enquanto o vídeo carrega. */
export const HERO_PRODUCT_POSTER_SRC =
  "/images/camisa-hero-produto-isolado.png" as const;

/** Hero agora configurado para mostrar a animação principal. */
export const HERO_PRODUCT_SLIDES = [
  {
    kind: "video" as const,
    webmSrc: HERO_VIDEO_WEBM,
    mp4Src: HERO_VIDEO_MP4,
    posterSrc: HERO_PRODUCT_POSTER_SRC,
    alt: "Camisa do Brasil em movimento — Edição Especial",
  },
] as const;

export const HERO_PRODUCT_IMAGE_SRC = HERO_PRODUCT_POSTER_SRC;

/** Key visual “Edição de Elite”. */
export const PRODUCT_IMAGE_MAIN_SRC =
  "/images/camisa-brasil-edicao-elite.png" as const;

/** Foto de estúdio / vista clássica da peça. */
export const PRODUCT_IMAGE_DETAIL_SRC =
  "/images/camisa-brasil-estilizada.png" as const;

/** Close macro premium — escudo, número 10 e textura. */
export const PRODUCT_IMAGE_GALLERY_MACRO_SRC =
  "/images/camisa-galeria-detalhe-macro.png" as const;

/** Nova foto de detalhes macro (v2). */
export const PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC =
  "/images/camisa-detalhes-macro-v2.png" as const;

/** Imagem limpa para o carrinho e resumo. */
export const PRODUCT_IMAGE_CLEAN_SRC = "/images/camisa-brasil-clean.png" as const;

/** Resumo do pedido. */
export const PRODUCT_IMAGE_SRC = PRODUCT_IMAGE_CLEAN_SRC;

export const SIZES = ["P", "M", "G", "GG"] as const;
export type Size = (typeof SIZES)[number];

export const GALLERY_IMAGES = [
  {
    src: PRODUCT_IMAGE_MAIN_SRC,
    alt: "Camisa Brasil Edição de Elite — visual cinematográfico",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_SRC,
    alt: "Close premium: escudo CBF em bordado dourado",
  },
  {
    src: PRODUCT_IMAGE_DETAIL_SRC,
    alt: "Vista frontal da peça com Cristo Redentor",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC,
    alt: "Detalhes ampliados da edição limitada",
  },
] as const;

/** Key visual do hero para meta. */
export const HERO_IMAGE = {
  src: HERO_PRODUCT_POSTER_SRC,
  alt: "Camisa do Brasil — vista frontal, iluminação dourada",
} as const;
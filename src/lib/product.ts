export const PRODUCT = {
  id: "camisa-brasil-estilizada",
  name: "Camisa do Brasil Estilizada",
  shortName: "Brasil Estilizada",
  priceFormatted: "R$ 67,90",
  priceCents: 6790,
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

/** Arte 1 web — close frontal nº 10, CBF e Cristo no Jacquard (`GALLERY_IMAGES`[2] e 3.ª miniatura da galeria premium). */
export const PRODUCT_IMAGE_DETAIL_SRC =
  "/images/gallery-premium-frontal-detalhe.png" as const;

/** Costas da camisa — NOME + número 10 (2.ª miniatura da galeria premium). */
export const PRODUCT_IMAGE_GALLERY_BACK_SRC =
  "/images/gallery-camisa-costas.png" as const;

/** Close macro premium — nº 10, escudo CBF e Cristo no Jacquard (secção “Arte da Redenção” + `GALLERY_IMAGES`[1]). */
export const PRODUCT_IMAGE_GALLERY_MACRO_SRC =
  "/images/arte-redencao-detalhe-jacquard.png" as const;

/** Detalhes costa / gola — edição limitada (arte web). */
export const PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC =
  "/images/detalhes-costa-web.png" as const;

/** Imagem limpa para o carrinho e resumo. */
export const PRODUCT_IMAGE_CLEAN_SRC = "/images/camisa-brasil-clean.png" as const;

/** Resumo do pedido. */
export const PRODUCT_IMAGE_SRC = PRODUCT_IMAGE_CLEAN_SRC;

export const SIZES = ["P", "M", "G", "GG", "G1", "G2"] as const;
export type Size = (typeof SIZES)[number];

export const GALLERY_IMAGES = [
  {
    src: PRODUCT_IMAGE_MAIN_SRC,
    alt: "Camisa Brasil Edição de Elite — visual cinematográfico",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_SRC,
    alt: "Detalhe frontal: número 10, escudo CBF e textura Jacquard com Cristo Redentor",
  },
  {
    src: PRODUCT_IMAGE_DETAIL_SRC,
    alt: "Close frontal: número 10, escudo CBF e Cristo Redentor na textura Jacquard",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC,
    alt: "Detalhes da costa e gola: escudo CBF, etiqueta Edição Limitada Rio de Janeiro e acabamento da manga",
  },
] as const;

/** Galeria premium: 1.ª frontal; 2.ª costas; 3.ª Arte 1 web (close frontal); 4.ª detalhe gola/costa. */
export const PREMIUM_GALLERY_IMAGES = [
  GALLERY_IMAGES[0],
  {
    src: PRODUCT_IMAGE_GALLERY_BACK_SRC,
    alt: "Costas da camisa — NOME e número 10, estrelas e acabamento premium",
  },
  GALLERY_IMAGES[2],
  GALLERY_IMAGES[3],
] as const;

/** Key visual do hero para meta. */
export const HERO_IMAGE = {
  src: HERO_PRODUCT_POSTER_SRC,
  alt: "Camisa do Brasil — vista frontal, iluminação dourada",
} as const;
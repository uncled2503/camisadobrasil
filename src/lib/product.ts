export const PRODUCT = {
  id: "camisa-brasil-estilizada",
  name: "Camisa do Brasil Estilizada",
  shortName: "Brasil Estilizada",
  priceFormatted: "R$ 69,00",
  priceCents: 6900,
  currency: "BRL",
} as const;

/** GIF do hero — coloque o ficheiro em `public/videos/`. */
export const HERO_PRODUCT_GIF_SRC = "/videos/camisa-hero-360.gif" as const;

/** Imagem de poster / LCP enquanto o vídeo carrega (e para OG). */
export const HERO_PRODUCT_POSTER_SRC =
  "/images/camisa-hero-produto-isolado.png" as const;

/** Hero do card — só GIF em loop (sem slides de imagem). */
export const HERO_PRODUCT_SLIDES = [
  {
    src: HERO_PRODUCT_GIF_SRC,
    alt: "Camisa do Brasil em GIF animado",
    media: "image" as const, // Tratar GIF como imagem para o componente
    posterSrc: HERO_PRODUCT_POSTER_SRC,
  },
] as const;

export const HERO_PRODUCT_IMAGE_SRC = HERO_PRODUCT_POSTER_SRC;

/** Key visual “Edição de Elite” (1ª da galeria, modal de compra). */
export const PRODUCT_IMAGE_MAIN_SRC =
  "/images/camisa-brasil-edicao-elite.png" as const;

/** Foto de estúdio / vista clássica da peça. */
export const PRODUCT_IMAGE_DETAIL_SRC =
  "/images/camisa-brasil-estilizada.png" as const;

/** Close macro premium — escudo, número 10 e textura (galeria). */
export const PRODUCT_IMAGE_GALLERY_MACRO_SRC =
  "/images/camisa-galeria-detalhe-macro.png" as const;

/** Nova foto de detalhes macro (v2). */
export const PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC =
  "/images/camisa-detalhes-macro-v2.png" as const;

/** Imagem limpa para o carrinho e resumo. */
export const PRODUCT_IMAGE_CLEAN_SRC = "/images/camisa-brasil-clean.png" as const;

/** Resumo do pedido — agora usa a versão com fundo limpo. */
export const PRODUCT_IMAGE_SRC = PRODUCT_IMAGE_CLEAN_SRC;

export const SIZES = ["P", "M", "G", "GG"] as const;
export type Size = (typeof SIZES)[number];

/** Vídeo na 4.ª miniatura da galeria — coloque o teu `.webm` em `public/videos/` com este nome. */
export const GALLERY_DETAIL_VIDEO_WEBM_SRC =
  "/videos/camisa-galeria-detail.webm" as const;
/** Fallback enquanto não há `.webm` (ou se o browser não suportar). */
export const GALLERY_DETAIL_VIDEO_MP4_SRC =
  "/videos/camisa-galeria-detail.mp4" as const;

export const GALLERY_IMAGES = [
  {
    src: PRODUCT_IMAGE_MAIN_SRC,
    alt: "Camisa Brasil Edição de Elite — visual cinematográfico com aura dourada e névoa; texto Edição de Elite e Reserve agora",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_SRC,
    alt: "Close premium: escudo CBF em bordado dourado, número 10 em relevo e textura jacquard com Cristo Redentor",
  },
  {
    kind: "video" as const,
    webmSrc: GALLERY_DETAIL_VIDEO_WEBM_SRC,
    mp4Src: GALLERY_DETAIL_VIDEO_MP4_SRC,
    posterSrc: PRODUCT_IMAGE_DETAIL_SRC,
    alt: "Camisa do Brasil estilizada — vídeo da peça; vista frontal com Cristo Redentor em navy e número 10",
  },
  {
    src: PRODUCT_IMAGE_GALLERY_MACRO_V2_SRC,
    alt: "Detalhes ampliados da edição limitada: gola com selo Rio de Janeiro e bordados de alta precisão",
  },
] as const;

/** Key visual do hero para meta / compat (poster, não o ficheiro de vídeo). */
export const HERO_IMAGE = {
  src: HERO_PRODUCT_POSTER_SRC,
  alt: "Camisa do Brasil — vista frontal, iluminação dourada, número 10, escudo e textura navy",
} as const;
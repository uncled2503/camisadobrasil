"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { reviewPortraitMan, reviewPortraitWoman } from "@/lib/review-portrait-urls";
import { cn } from "@/lib/utils";

/** Embaralha de forma estável (mesma ordem em cada build / hidratação). */
function shuffleDeterministic<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type ReviewPhotoEntry = {
  name: string;
  text: string;
  rating: 5;
  profileImageSrc: string;
  imageSrc: string;
};

/** Fotos reais de clientes (UGC) — mesmo cartão que o restante do carrossel. */
const ugcReviewPhotos: ReviewPhotoEntry[] = [
  {
    name: "Ricardo H.",
    text: "Igual às fotos do site — no espelho ficou ainda melhor. Recomendo!",
    rating: 5,
    profileImageSrc: "/images/testimonials/profiles/ricardo-h.png",
    imageSrc: "/images/testimonials/ugc/ugc-1.png",
  },
  {
    name: "Bruno T.",
    text: "Montei o kit completo: presença absurda e tecido leve. Nota máxima.",
    rating: 5,
    profileImageSrc: "/images/testimonials/profiles/bruno-t.png",
    imageSrc: "/images/testimonials/ugc/ugc-2.png",
  },
  {
    name: "Letícia M.",
    text: "O Cristo no tecido é lindo ao vivo. Caimento e cores na medida certa!",
    rating: 5,
    profileImageSrc: "/images/testimonials/profiles/leticia-m.png",
    imageSrc: "/images/testimonials/ugc/ugc-3.png",
  },
  {
    name: "Camila R.",
    text: "Chegou certinho e veste super bem. Já quero pedir outra.",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(59),
    imageSrc: "/images/testimonials/ugc/ugc-4.png",
  },
  {
    name: "Vinícius K.",
    text: "Foto real do pedido — bate com o anúncio. Material de primeira linha.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(63),
    imageSrc: "/images/testimonials/ugc/ugc-5.png",
  },
];

const stockReviewPhotos: ReviewPhotoEntry[] = [
  {
    name: "Rafael M.",
    text: "Acabamento impecável. Parece peça de coleção.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(11),
    imageSrc: "/images/testimonials/1.png",
  },
  {
    name: "Juliana C.",
    text: "O caimento valoriza demais. Cor vibrante na medida.",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(14),
    imageSrc: "/images/testimonials/2.png",
  },
  {
    name: "Diego A.",
    text: "Leve, confortável e com presença. Virou minha favorita.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(18),
    imageSrc: "/images/testimonials/3.png",
  },
  {
    name: "Beatriz L.",
    text: "Qualidade surpreendente pelo preço. Recomendo!",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(22),
    imageSrc: "/images/testimonials/4.png",
  },
  {
    name: "Lucas S.",
    text: "Design moderno, foge do óbvio. Chegou rápido.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(25),
    imageSrc: "/images/testimonials/5.png",
  },
  {
    name: "Fernanda O.",
    text: "A estampa é muito mais bonita ao vivo. Amei!",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(28),
    imageSrc: "/images/testimonials/6.png",
  },
  {
    name: "Carlos E.",
    text: "Material de primeira, não esquenta. Ótima compra.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(31),
    imageSrc: "/images/testimonials/7.png",
  },
  {
    name: "Isabela P.",
    text: "Veste super bem, modelagem perfeita. Comprarei de novo.",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(35),
    imageSrc: "/images/testimonials/8.png",
  },
  {
    name: "Gustavo F.",
    text: "Chegou antes do prazo e a qualidade é surreal. Top!",
    rating: 5,
    profileImageSrc: reviewPortraitMan(38),
    imageSrc: "/images/testimonials/9.png",
  },
  {
    name: "Ana B.",
    text: "A camisa é linda, o tecido é muito bom. Comprarei mais vezes.",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(42),
    imageSrc: "/images/testimonials/10.png",
  },
  {
    name: "Thiago R.",
    text: "Impressionado com os detalhes. Vale cada centavo.",
    rating: 5,
    profileImageSrc: reviewPortraitMan(45),
    imageSrc: "/images/testimonials/11.png",
  },
  {
    name: "Catarina V.",
    text: "Perfeita para usar nos jogos e no dia a dia. Estilosa demais.",
    rating: 5,
    profileImageSrc: reviewPortraitWoman(49),
    imageSrc: "/images/testimonials/12.png",
  },
];

/** Intercala stock + UGC antes do shuffle para não agrupar várias selfies seguidas (efeito “grelha repetida”). */
function interleaveStockAndUgc(
  stock: readonly ReviewPhotoEntry[],
  ugc: readonly ReviewPhotoEntry[]
): ReviewPhotoEntry[] {
  const out: ReviewPhotoEntry[] = [];
  const n = Math.max(stock.length, ugc.length);
  for (let i = 0; i < n; i++) {
    if (i < stock.length) out.push(stock[i]);
    if (i < ugc.length) out.push(ugc[i]);
  }
  return out;
}

function dedupeByImageSrc(entries: readonly ReviewPhotoEntry[]): ReviewPhotoEntry[] {
  const seen = new Set<string>();
  const out: ReviewPhotoEntry[] = [];
  for (const e of entries) {
    if (seen.has(e.imageSrc)) continue;
    seen.add(e.imageSrc);
    out.push(e);
  }
  return out;
}

/** Ordem estável entre builds; sem `imageSrc` repetido. */
const reviews = shuffleDeterministic(
  dedupeByImageSrc(interleaveStockAndUgc(stockReviewPhotos, ugcReviewPhotos)),
  0x414c5048 /* "ALPH" */
);

type ReviewEntry = (typeof reviews)[number];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < n ? "fill-gold text-gold" : "fill-white/[0.06] text-white/[0.06]"
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

function ReviewMarquee({
  reviews,
  reverse = false,
}: {
  reviews: ReviewEntry[];
  reverse?: boolean;
}) {
  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className={cn(
          "flex min-w-max gap-6 group-hover:[animation-play-state:paused] md:gap-8",
          reverse ? "animate-scroll-x-reverse" : "animate-scroll-x"
        )}
      >
        {[...reviews, ...reviews].map((r, i) => (
          <figure
            key={`${r.name}-${i}`}
            className="glass-dark w-[300px] shrink-0 overflow-hidden rounded-2xl transition-all duration-300 hover:!border-white/[0.12] hover:!shadow-luxe-hover md:w-[340px]"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={r.imageSrc}
                alt={`Foto do produto enviada por ${r.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 340px"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={r.profileImageSrc}
                    alt={`Foto de perfil de ${r.name}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold tracking-tight">{r.name}</p>
                  <div className="mt-1">
                    <Stars n={r.rating} />
                  </div>
                </div>
              </div>
              <blockquote className="relative z-10 mt-4 text-[15px] leading-relaxed text-foreground/95">
                {r.text}
              </blockquote>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function SocialProof() {
  return (
    <SectionShell aria-labelledby="reviews-heading" variant="default" grain="low">
      <SectionReveal className="max-w-3xl">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
          Confiança
        </p>
        <h2
          id="reviews-heading"
          className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-tight"
        >
          Quem vestiu,{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            aprovou
          </span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Depoimentos de quem busca estética, caimento e presença acima da média.
        </p>
      </SectionReveal>

      <div className="mt-16 flex flex-col gap-6 md:gap-8">
        <ReviewMarquee reviews={firstRow} />
        <ReviewMarquee reviews={secondRow} reverse />
      </div>
    </SectionShell>
  );
}
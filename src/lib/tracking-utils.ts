export type TrackingEvent = {
  id: string;
  date: string;
  status: string;
  location: string;
  destination?: string;
  icon: "package" | "truck" | "check";
  done: boolean;
};

// 📦 LISTA DE CIDADES (Capitais e Cidades Grandes/Médias fornecidas)
const CIDADES = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador", "Fortaleza", "Recife", "Curitiba", "Porto Alegre", "Goiânia",
  "Belém", "Manaus", "São Luís", "Maceió", "Natal", "João Pessoa", "Aracaju", "Teresina", "Campo Grande", "Cuiabá",
  "Palmas", "Rio Branco", "Macapá", "Boa Vista", "Vitória", "Florianópolis", "Campinas", "Santos", "Ribeirão Preto", "Uberlândia",
  "Contagem", "Juiz de Fora", "Londrina", "Maringá", "Joinville", "Caxias do Sul", "Pelotas", "Feira de Santana", "Caruaru", "Petrolina",
  "Anápolis", "Aparecida de Goiânia", "São José dos Campos", "Sorocaba", "Piracicaba", "Bauru", "Montes Claros", "Governador Valadares", "Ipatinga", "Betim",
  "Uberaba", "São João del-Rei", "Tiradentes", "Barbacena", "Lavras", "Divinópolis", "Conselheiro Lafaiete", "Ouro Preto", "Mariana", "Sete Lagoas",
  "Pará de Minas", "Varginha", "Poços de Caldas", "Pouso Alegre", "Itajubá"
];

// 🏪 AGÊNCIAS FRANQUEADAS E COMUNITÁRIAS
const FRANQUIAS = [
  "Expresso Correios", "Rápido Centro", "Postal Brasil", "Minas Express", "Log Express",
  "Envio Fácil", "Entrega Já", "Prime Correios", "Brasil Encomendas", "Fácil Post",
  "São Sebastião", "Santo Antônio", "Santa Rita", "Bom Jesus", "São José"
];

// 📍 BAIRROS COMUNS
const BAIRROS = [
  "Centro", "Centro Histórico", "Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste",
  "Industrial", "Distrito Industrial", "Vila Nova", "Jardim América", "Jardim Europa",
  "Bela Vista", "Boa Vista", "Copacabana", "Ipanema", "Barra da Tijuca", "Savassi", "Funcionários", "Pampulha"
];

/**
 * Gera um código de rastreio seguindo o padrão:
 * BR + 4 números + 1 letra + 3 números + BR
 */
export function generateMockTrackingCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const num4 = Math.floor(1000 + Math.random() * 9000).toString();
  const char = letters.charAt(Math.floor(Math.random() * letters.length));
  const num3 = Math.floor(100 + Math.random() * 900).toString();
  return `BR${num4}${char}${num3}BR`;
}

/**
 * Gera o itinerário dinâmico baseado na data da compra e no destino, 
 * com trânsito entre CTEs e CDs (simulando cidades próximas).
 */
export function generateTimeline(code: string, destCity: string, destState: string, startDateIso: string): TrackingEvent[] {
  // Gerador determinístico para que o mesmo código dê sempre a mesma rota
  let seedValue = 0;
  for (let i = 0; i < code.length; i++) {
    seedValue = (Math.imul(31, seedValue) + code.charCodeAt(i)) | 0;
  }
  
  const rnd = () => {
    seedValue = (seedValue + 0x6D2B79F5) | 0;
    let t = Math.imul(seedValue ^ (seedValue >>> 15), 1 | seedValue);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296);
  };

  const start = new Date(startDateIso);
  const now = new Date();

  // Escolhe cidades de trânsito (rotas intermediárias)
  const city1 = CIDADES[Math.floor(rnd() * CIDADES.length)];
  const city2 = CIDADES[Math.floor(rnd() * CIDADES.length)];
  const franquia = FRANQUIAS[Math.floor(rnd() * FRANQUIAS.length)];
  const bairro = BAIRROS[Math.floor(rnd() * BAIRROS.length)];

  const addDays = (date: Date, days: number, hours: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(d.getHours() + hours);
    return d;
  };

  const events: TrackingEvent[] = [];
  let currentDate = new Date(start);

  // 1. Postado (Imediato)
  currentDate = addDays(currentDate, 0, 0);
  events.push({
    id: "ev1",
    date: currentDate.toISOString(),
    status: "Objeto postado",
    location: `ACF ${franquia} - São Paulo / SP`,
    icon: "package",
    done: true // Sempre concluído se já foi gerado
  });

  // 2. Encaminhado origem -> CTE São Paulo
  currentDate = addDays(currentDate, 0, Math.floor(rnd() * 4) + 1);
  events.push({
    id: "ev2",
    date: currentDate.toISOString(),
    status: "Objeto encaminhado",
    location: `ACF ${franquia} - São Paulo / SP`,
    destination: `CTE São Paulo - São Paulo / SP`,
    icon: "truck",
    done: currentDate <= now
  });

  // 3. Chegou CTE Origem
  currentDate = addDays(currentDate, 0, Math.floor(rnd() * 8) + 4);
  events.push({
    id: "ev3",
    date: currentDate.toISOString(),
    status: "Objeto chegou na unidade",
    location: `CTE São Paulo - São Paulo / SP`,
    icon: "truck",
    done: currentDate <= now
  });

  // 4. Encaminhado Cidade Trânsito 1
  currentDate = addDays(currentDate, 1, Math.floor(rnd() * 5));
  events.push({
    id: "ev4",
    date: currentDate.toISOString(),
    status: "Objeto encaminhado",
    location: `CTE São Paulo - São Paulo / SP`,
    destination: `CTE ${city1}`,
    icon: "truck",
    done: currentDate <= now
  });

  // 5. Chegou Cidade Trânsito 1
  currentDate = addDays(currentDate, 1, Math.floor(rnd() * 12));
  events.push({
    id: "ev5",
    date: currentDate.toISOString(),
    status: "Objeto chegou na unidade",
    location: `CTE ${city1}`,
    icon: "truck",
    done: currentDate <= now
  });

  // 6. Encaminhado CDD Destino
  currentDate = addDays(currentDate, 0, Math.floor(rnd() * 6) + 2);
  events.push({
    id: "ev6",
    date: currentDate.toISOString(),
    status: "Objeto encaminhado",
    location: `CTE ${city1}`,
    destination: `CDD ${destCity} / ${destState}`,
    icon: "truck",
    done: currentDate <= now
  });

  // 7. Chegou CDD Destino
  currentDate = addDays(currentDate, 1, Math.floor(rnd() * 12));
  events.push({
    id: "ev7",
    date: currentDate.toISOString(),
    status: "Objeto chegou na unidade",
    location: `CDD ${destCity} / ${destState}`,
    icon: "truck",
    done: currentDate <= now
  });

  // 8. Saiu para entrega
  currentDate = addDays(currentDate, 0, 0);
  currentDate.setHours(Math.floor(rnd() * 4) + 8, Math.floor(rnd() * 60)); // Entre 8h e 11h
  events.push({
    id: "ev8",
    date: currentDate.toISOString(),
    status: "Objeto saiu para entrega ao destinatário",
    location: `CDD ${bairro} - ${destCity} / ${destState}`,
    icon: "truck",
    done: currentDate <= now
  });

  // 9. Entregue
  currentDate = addDays(currentDate, 0, 0);
  currentDate.setHours(currentDate.getHours() + Math.floor(rnd() * 6) + 2);
  events.push({
    id: "ev9",
    date: currentDate.toISOString(),
    status: "Objeto entregue ao destinatário",
    location: `${destCity} / ${destState}`,
    icon: "check",
    done: currentDate <= now
  });

  // Filtra apenas os eventos que já aconteceram e reverte (mais recentes no topo)
  return events.filter(e => e.done).reverse();
}
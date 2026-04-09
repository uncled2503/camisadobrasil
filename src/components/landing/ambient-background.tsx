/**
 * Fundo cinematográfico fixo — uma única camada de grain; as secções só acrescentam lavagens suaves.
 */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #04070D 0%, #07111F 42%, #0A1322 78%, #07111F 100%)",
        }}
      />
      {/* Glow azul profundo */}
      <div
        className="absolute -left-[20%] top-[-10%] h-[65%] w-[85%] rounded-full opacity-90 blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at 40% 35%, rgba(32, 76, 180, 0.16), transparent 62%)",
        }}
      />
      <div
        className="absolute -right-[15%] bottom-[5%] h-[50%] w-[70%] rounded-full opacity-80 blur-[90px]"
        style={{
          background:
            "radial-gradient(ellipse at 60% 60%, rgba(20, 48, 120, 0.1), transparent 65%)",
        }}
      />
      {/* Glow dourado residual */}
      <div
        className="absolute left-1/2 top-[18%] h-[45vh] w-[min(140%,900px)] -translate-x-1/2 opacity-70 blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08), transparent 58%)",
        }}
      />
      {/* Vinheta bordas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 40%, rgba(4, 7, 13, 0.55) 100%)",
        }}
      />
      {/* Grain único — baixa opacidade */}
      <div className="absolute inset-0 bg-grain opacity-[0.035]" />
    </div>
  );
}
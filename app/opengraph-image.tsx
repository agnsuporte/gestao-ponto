import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at top, rgba(59,130,246,0.35), transparent 32%), linear-gradient(180deg, #07111f 0%, #0f172a 46%, #111827 100%)',
          color: '#ffffff',
          padding: '56px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              fontSize: '34px',
              fontWeight: 700,
            }}
          >
            PI
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '30px', fontWeight: 700 }}>Ponto Inteligente</div>
            <div style={{ marginTop: '8px', fontSize: '18px', color: '#cbd5e1' }}>alegomes.eu</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '900px' }}>
          <div style={{ fontSize: '68px', lineHeight: 1.08, fontWeight: 700 }}>
            Controlo de ponto simples para pequenas equipas em Portugal.
          </div>
          <div style={{ fontSize: '28px', lineHeight: 1.4, color: '#dbeafe' }}>
            Registe entradas e saídas, consulte o histórico e acompanhe o resumo mensal sem complicação.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '22px',
            color: '#d1fae5',
          }}
        >
          <div style={{ display: 'flex' }}>Registo rápido</div>
          <div style={{ display: 'flex' }}>Histórico claro</div>
          <div style={{ display: 'flex' }}>Preços simples</div>
        </div>
      </div>
    ),
    size
  );
}

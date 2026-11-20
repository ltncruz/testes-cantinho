import { useEffect, useState } from 'react'
import logo from './assets/Logo.png'
import whatsappLogo from './assets/whatsapp-logo.png'

const CARDAPIO_URL = 'https://app.cardapioweb.com/cantinhobaiano'
const WHATSAPP_URL = 'https://wa.me/5524999343582'
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Rua%20Manchester%2C%20722%2C%20Ponte%20Alta%2C%20Volta%20Redonda%20-%20RJ%2C%2027267-150'
const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.3323321562334!2d-44.13433842575737!3d-22.529220324484406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9e98fe7d57571b%3A0x7f247f37fc0f8217!2sR.%20Manchester%2C%20722%20-%20Pte.%20Alta%2C%20Volta%20Redonda%20-%20RJ%2C%2027265-105!5e0!3m2!1spt-BR!2sbr!4v1790190179244!5m2!1spt-BR!2sbr'

const HORARIOS = [
  { dia: 'Segunda-feira', horario: 'Fechado' },
  { dia: 'Terça-feira', horario: '17h às 21h' },
  { dia: 'Quarta-feira', horario: '17h às 21h' },
  { dia: 'Quinta-feira', horario: '17h às 21h' },
  { dia: 'Sexta-feira', horario: '17h às 21h' },
  { dia: 'Sábado', horario: '17h às 21h' },
  { dia: 'Domingo', horario: 'Fechado' },
]

const DIAS_SEMANA = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function obterStatusFuncionamento() {
  const agora = new Date()
  const diaFormatado = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
  }).format(agora)

  const partesHorario = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(agora)

  const hora = Number(partesHorario.find((parte) => parte.type === 'hour')?.value ?? 0)
  const minuto = Number(partesHorario.find((parte) => parte.type === 'minute')?.value ?? 0)
  const dia = DIAS_SEMANA[diaFormatado]
  const minutosDoDia = hora * 60 + minuto

  const abreHoje = dia >= 2 && dia <= 6
  const estaNoHorario = minutosDoDia >= 17 * 60 && minutosDoDia < 21 * 60

  return {
    aberto: abreHoje && estaNoHorario,
    dia,
  }
}

function App() {
  const [status, setStatus] = useState(obterStatusFuncionamento)

  useEffect(() => {
    const atualizarStatus = () => setStatus(obterStatusFuncionamento())
    const intervalo = window.setInterval(atualizarStatus, 60_000)

    return () => window.clearInterval(intervalo)
  }, [])

  return (
    <main className="page">
      <div className="content-shell">
        <img
          src={logo}
          alt="Cantinho Baiano"
          className="logo"
          width="1600"
          height="1600"
          fetchPriority="high"
        />

        <div className="action-buttons" aria-label="Ações principais">
          <a
            href={CARDAPIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            IR ATÉ O CARDÁPIO
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
            aria-label="Falar com o Cantinho Baiano pelo WhatsApp"
          >
            <img src={whatsappLogo} alt="" aria-hidden="true" />
            <span>FALAR NO WHATSAPP</span>
          </a>
        </div>

        <section className="info-card hours-section" aria-labelledby="horarios-title">
          <h2 id="horarios-title">Horários</h2>

          <div
            className={`opening-status ${status.aberto ? 'is-open' : 'is-closed'}`}
            role="status"
            aria-live="polite"
          >
            <span className="status-dot" aria-hidden="true" />
            {status.aberto ? 'ABERTO AGORA' : 'FECHADO AGORA'}
          </div>

          <ul className="hours-list">
            {HORARIOS.map((item, indice) => (
              <li key={item.dia} className={status.dia === indice + 1 || (indice === 6 && status.dia === 0) ? 'today' : ''}>
                <span>{item.dia}</span>
                <strong>{item.horario}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="info-card location-section" aria-labelledby="local-title">
          <h2 id="local-title">Localização</h2>

          <p className="address">
            Rua Manchester, 722, Ponte Alta, Volta Redonda - RJ, CEP 27267-150.
          </p>

          <div className="map-preview">
            <iframe
              src={MAP_EMBED_URL}
              title="Prévia da localização do Cantinho Baiano"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex="-1"
            />
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="map-click-layer"
              aria-label="Abrir a localização do Cantinho Baiano no Google Maps"
            >
              <span>Abrir no Google Maps</span>
            </a>
          </div>

          <p className="map-hint">Toque ou clique no mapa para abrir no Google Maps.</p>
        </section>

        <footer className="site-footer">
          Cantinho Baiano - 2026 - Todos direitos reservados.
        </footer>
      </div>
    </main>
  )
}

export default App

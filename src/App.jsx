import { useState } from 'react'
import CorrectScore from './CorrectScore.jsx'

export default function App() {
  // Read API key from env var (set VITE_ANTHROPIC_API_KEY in your .env file)
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
  const [apiKey, setApiKey] = useState(envKey)
  const [submitted, setSubmitted] = useState(!!envKey)
  const [input, setInput] = useState('')

  if (submitted && apiKey) {
    return <MatchAnalyst apiKey={apiKey} />
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24, background: '#0a0a12'
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#0e0e1a', border: '1px solid #1e1e2e',
        borderRadius: 20, padding: '36px 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, background: '#00e5a0', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>⚡</div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 3, color: '#fff' }}>
            CORRECT SCORE
          </span>
        </div>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
          Enter your Anthropic API key to get started. Your key is never stored — it lives only in your browser session.
        </p>

        <label style={{
          display: 'block', fontSize: 11, color: '#555',
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8
        }}>Anthropic API Key</label>

        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && input.startsWith('sk-') && (setApiKey(input), setSubmitted(true))}
          placeholder="sk-ant-..."
          style={{
            width: '100%', background: '#13131f', border: '1px solid #2a2a3e',
            borderRadius: 8, color: '#e8e8f0', fontSize: 14, padding: '11px 13px',
            outline: 'none', marginBottom: 12
          }}
        />

        <button
          onClick={() => { if (input.startsWith('sk-')) { setApiKey(input); setSubmitted(true) } }}
          disabled={!input.startsWith('sk-')}
          style={{
            width: '100%', padding: 13,
            background: input.startsWith('sk-') ? '#00e5a0' : '#1e1e2e',
            color: input.startsWith('sk-') ? '#0a0a12' : '#555',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
            fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2,
            textTransform: 'uppercase', cursor: input.startsWith('sk-') ? 'pointer' : 'not-allowed',
            transition: 'all .2s'
          }}
        >
          Continue →
        </button>

        <p style={{ color: '#333', fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
          Get a key at{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
            style={{ color: '#00e5a060' }}>console.anthropic.com</a>.
          Or set <code style={{ color: '#555' }}>VITE_ANTHROPIC_API_KEY</code> in your <code style={{ color: '#555' }}>.env</code> file to skip this screen.
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'

const SPORT_OPTIONS = [
  'Football (Soccer)', 'Basketball', 'American Football',
  'Tennis', 'Cricket', 'Rugby', 'Baseball', 'Hockey'
]

const labelStyle = {
  display: 'block', fontSize: 11, color: '#555',
  fontFamily: "'Barlow Condensed', sans-serif",
  letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: '#13131f', border: '1px solid #2a2a3e', borderRadius: 8,
  color: '#e8e8f0', fontSize: 14, padding: '10px 12px',
  outline: 'none', fontFamily: "'Barlow', sans-serif", transition: 'border-color .2s'
}

const cardStyle = {
  background: '#0e0e1a', border: '1px solid #1e1e2e',
  borderRadius: 14, padding: '22px 22px 18px'
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, color: '#555', fontFamily: "'Barlow Condensed', sans-serif",
      letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14
    }}>{children}</div>
  )
}

function MiniLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, color: '#444', fontFamily: "'Barlow Condensed', sans-serif",
      letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6
    }}>{children}</div>
  )
}

function Tag({ text, color, textColor }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 12, color: textColor,
      background: color, padding: '3px 9px', borderRadius: 4,
      marginRight: 6, marginBottom: 6
    }}>{text}</span>
  )
}

function PctBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{
          fontSize: 13, color: '#aaa', fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 1, textTransform: 'uppercase'
        }}>{label}</span>
        <span style={{
          fontSize: 18, fontWeight: 700, color,
          fontFamily: "'Bebas Neue', sans-serif"
        }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: '#1e1e2e', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 3, animation: 'barFill 1.2s cubic-bezier(.4,0,.2,1) forwards'
        }} />
      </div>
    </div>
  )
}

export default function CorrectScore({ apiKey }) {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [matchTime, setMatchTime] = useState('')
  const [sport, setSport] = useState('Football (Soccer)')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  const getConfidenceColor = (c) =>
    c === 'high' ? '#00e5a0' : c === 'medium' ? '#f5c400' : '#ff6b6b'

  const handleAnalyze = async () => {
    if (!team1.trim() || !team2.trim() || !matchDate || !matchTime) {
      setError('Please fill in all fields before analyzing.')
      return
    }
    setError('')
    setLoading(true)
    setAnalysis(null)

    const prompt = `You are an expert sports analyst with deep knowledge of teams worldwide. Analyze the upcoming ${sport} match between ${team1} and ${team2} scheduled for ${matchDate} at ${matchTime}.

Use web search to find the latest information about both teams, including recent form, injuries, and head-to-head record.

Provide a detailed structured analysis in this JSON format only (no markdown, no extra text, no code fences):
{
  "summary": "2-3 sentence overall match preview",
  "team1": {
    "name": "${team1}",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "recentForm": "Brief description of recent form and results",
    "keyPlayers": ["Player 1", "Player 2", "Player 3"],
    "tactics": "Expected tactical approach"
  },
  "team2": {
    "name": "${team2}",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "recentForm": "Brief description of recent form and results",
    "keyPlayers": ["Player 1", "Player 2", "Player 3"],
    "tactics": "Expected tactical approach"
  },
  "headToHead": "Historical head-to-head record and context",
  "venueAndConditions": "Relevant notes about venue, home advantage, or conditions",
  "keyFactors": ["Key factor 1", "Key factor 2", "Key factor 3"],
  "prediction": {
    "team1WinPct": <integer 0-100>,
    "drawPct": <integer 0-100, use 0 if sport has no draws>,
    "team2WinPct": <integer 0-100>,
    "verdict": "Predicted winner and expected scoreline or outcome",
    "confidence": "low OR medium OR high",
    "reasoning": "2-3 sentence explanation of the prediction"
  }
}`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API error')
      }

      const data = await response.json()
      const text = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAnalysis(parsed)
    } catch (err) {
      setError(`Analysis failed: ${err.message}. Please check your API key and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1e1e2e', padding: '28px 24px 20px',
        background: 'linear-gradient(180deg, #0e0e1a 0%, #0a0a12 100%)',
        position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)'
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, background: '#00e5a0', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
          }}>⚡</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 3, color: '#fff' }}>
                MATCH ANALYST
              </span>
              <span style={{
                background: '#00e5a020', border: '1px solid #00e5a040', color: '#00e5a0',
                fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 2, padding: '2px 8px', borderRadius: 4, fontWeight: 600
              }}>AI POWERED</span>
            </div>
            <p style={{ color: '#444', fontSize: 13, margin: 0 }}>
              Deep AI analysis &amp; win probability for any upcoming fixture
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 760, margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ ...cardStyle }}>

          {/* Teams */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 44px 1fr',
            gap: 12, alignItems: 'end', marginBottom: 16
          }}>
            <div>
              <label style={labelStyle}>Home Team</label>
              <input
                value={team1} onChange={e => setTeam1(e.target.value)}
                placeholder="e.g. Manchester City"
                style={inputStyle}
              />
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#2a2a3e',
              textAlign: 'center', paddingBottom: 10
            }}>VS</div>
            <div>
              <label style={labelStyle}>Away Team</label>
              <input
                value={team2} onChange={e => setTeam2(e.target.value)}
                placeholder="e.g. Real Madrid"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Date / Time / Sport */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12, marginBottom: 20
          }}>
            <div>
              <label style={labelStyle}>Match Date</label>
              <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kick-off Time</label>
              <input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sport</label>
              <select value={sport} onChange={e => setSport(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {SPORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#ff6b6b', fontSize: 13, marginBottom: 14,
              padding: '10px 14px', background: '#ff6b6b10',
              borderRadius: 8, border: '1px solid #ff6b6b30'
            }}>{error}</div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: '100%', padding: 14,
              background: loading ? '#1e1e2e' : '#00e5a0',
              color: loading ? '#555' : '#0a0a12',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2,
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all .2s'
            }}
          >
            {loading ? '⚡ Analyzing Match…' : '⚡ Analyze Match'}
          </button>
        </div>

        {/* Loading dots */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '52px 0' }}>
            <div style={{ display: 'inline-flex', gap: 8, marginBottom: 16 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%', background: '#00e5a0',
                  animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`
                }} />
              ))}
            </div>
            <p style={{ color: '#444', fontSize: 14 }}>
              Searching for team data and running analysis…
            </p>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}
            className="fade-up">

            {/* Summary */}
            <div style={cardStyle}>
              <SectionLabel>Match Preview</SectionLabel>
              <p style={{ color: '#ccc', lineHeight: 1.75, margin: 0, fontSize: 15 }}>
                {analysis.summary}
              </p>
            </div>

            {/* Win Probability */}
            <div style={cardStyle}>
              <SectionLabel>Win Probability</SectionLabel>
              <PctBar label={team1} pct={analysis.prediction.team1WinPct} color="#00e5a0" />
              {analysis.prediction.drawPct > 0 && (
                <PctBar label="Draw" pct={analysis.prediction.drawPct} color="#f5c400" />
              )}
              <PctBar label={team2} pct={analysis.prediction.team2WinPct} color="#4d9fff" />

              <div style={{
                marginTop: 20, padding: '16px 18px', background: '#13131f',
                borderRadius: 10, borderLeft: '3px solid #00e5a0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{
                      fontSize: 10, color: '#444', letterSpacing: 2, textTransform: 'uppercase',
                      fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4
                    }}>Prediction</div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', letterSpacing: 1
                    }}>{analysis.prediction.verdict}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: 10, color: '#444', letterSpacing: 2, textTransform: 'uppercase',
                      fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 6
                    }}>Confidence</div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: 1, textTransform: 'uppercase',
                      color: getConfidenceColor(analysis.prediction.confidence),
                      background: getConfidenceColor(analysis.prediction.confidence) + '20',
                      padding: '4px 12px', borderRadius: 4
                    }}>{analysis.prediction.confidence}</span>
                  </div>
                </div>
                <p style={{ color: '#777', fontSize: 13, margin: '12px 0 0', lineHeight: 1.7 }}>
                  {analysis.prediction.reasoning}
                </p>
              </div>
            </div>

            {/* Team Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { team: analysis.team1, color: '#00e5a0' },
                { team: analysis.team2, color: '#4d9fff' }
              ].map(({ team, color }) => (
                <div key={team.name} style={{ ...cardStyle, borderTop: `3px solid ${color}` }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
                    color, letterSpacing: 1, marginBottom: 16
                  }}>{team.name}</div>

                  <div style={{ marginBottom: 14 }}>
                    <MiniLabel>Recent Form</MiniLabel>
                    <p style={{ color: '#bbb', fontSize: 13, margin: 0, lineHeight: 1.65 }}>
                      {team.recentForm}
                    </p>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <MiniLabel>Strengths</MiniLabel>
                    {team.strengths.map((s, i) => (
                      <Tag key={i} text={s} color="#00e5a018" textColor="#00e5a0" />
                    ))}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <MiniLabel>Weaknesses</MiniLabel>
                    {team.weaknesses.map((w, i) => (
                      <Tag key={i} text={w} color="#ff6b6b18" textColor="#ff6b6b" />
                    ))}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <MiniLabel>Key Players</MiniLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {team.keyPlayers.map((p, i) => (
                        <span key={i} style={{
                          fontSize: 12, color: '#aaa', background: '#1e1e2e',
                          padding: '3px 9px', borderRadius: 4
                        }}>{p}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <MiniLabel>Expected Tactics</MiniLabel>
                    <p style={{ color: '#bbb', fontSize: 13, margin: 0, lineHeight: 1.65 }}>
                      {team.tactics}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Factors + Context */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={cardStyle}>
                <SectionLabel>Key Match Factors</SectionLabel>
                {analysis.keyFactors.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ color: '#00e5a0', marginTop: 2, fontSize: 12, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 13, color: '#bbb', lineHeight: 1.65 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={cardStyle}>
                <SectionLabel>Head to Head</SectionLabel>
                <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                  {analysis.headToHead}
                </p>
                <SectionLabel>Venue &amp; Conditions</SectionLabel>
                <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  {analysis.venueAndConditions}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{ color: '#333', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
              AI analysis is for entertainment purposes only. Always gamble responsibly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

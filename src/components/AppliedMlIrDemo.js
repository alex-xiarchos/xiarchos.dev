import React, { useEffect, useMemo, useRef, useState } from 'react'

const classifierMetrics = [
  {
    name: 'MLP',
    accuracy: 0.9197,
    precision: 0.7644,
    recall: 0.6807,
    f1: 0.6977,
    color: '#2f71b4',
  },
  {
    name: 'Random Forest',
    accuracy: 0.9317,
    precision: 0.8323,
    recall: 0.7074,
    f1: 0.7384,
    color: '#2d922d',
  },
  {
    name: 'Gaussian NB',
    accuracy: 0.8404,
    precision: 0.5568,
    recall: 0.546,
    f1: 0.5208,
    color: '#d33682',
  },
]

const activityPresets = {
  walking: { back: 54, thigh: 58, stability: 46 },
  running: { back: 86, thigh: 92, stability: 18 },
  cycling: { back: 30, thigh: 82, stability: 52 },
  standing: { back: 12, thigh: 14, stability: 88 },
}

const documents = [
  {
    id: '00001',
    title: 'Pseudomonas aeruginosa infection in cystic fibrosis',
    text: 'Occurrence of precipitating antibodies against pseudomonas aeruginosa in relation to serum proteins and clinical radiographical status of the lungs.',
  },
  {
    id: '00008',
    title: 'Respiratory tract bacteriology in cystic fibrosis',
    text: 'Epidemiological investigations of respiratory tract bacteriology in patients with cystic fibrosis treated as outpatients during one year.',
  },
  {
    id: '00034',
    title: 'Cystic fibrosis and coeliac disease',
    text: 'The coexistence of cystic fibrosis and coeliac disease has been reported with attention to gastrointestinal symptoms and diagnosis.',
  },
  {
    id: '00261',
    title: 'Electrode measurements in children',
    text: 'The source of sodium and chloride activities on the skin surface experiences with electrode measurements in children.',
  },
  {
    id: '01088',
    title: 'Amino acid transport in cystic fibrosis',
    text: 'Abnormalities of amino acid transport have been described in epithelial tissue and small bowel studies of cystic fibrosis patients.',
  },
  {
    id: '01228',
    title: 'Proteins in bronchial secretion',
    text: 'Bronchial secretions from children with chronic pulmonary diseases were tested for immunoglobulins lactoferrin lysozyme and inflammatory response.',
  },
  {
    id: '01234',
    title: 'Cystic fibrosis diagnosis treatment and prognosis',
    text: 'A review of diagnosis treatment prognosis pancreatic function pulmonary function enzyme replacement therapy and general clinical practice.',
  },
  {
    id: '01239',
    title: 'Vitamin E and essential fatty acids',
    text: 'Deficiencies of essential fatty acids and vitamin E in cystic fibrosis children are demonstrated compared to matched controls.',
  },
]

const stopwords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'be',
  'between',
  'by',
  'can',
  'for',
  'from',
  'has',
  'have',
  'how',
  'in',
  'is',
  'of',
  'on',
  'or',
  'patients',
  'the',
  'those',
  'to',
  'what',
  'with',
])

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 2 && !stopwords.has(term))
    .map((term) => term.replace(/ies$/, 'y').replace(/s$/, ''))
}

function classifyActivity({ back, thigh, stability }) {
  if (stability > 72 && back < 34 && thigh < 36) {
    return 'Standing'
  }

  if (back > 72 && thigh > 72 && stability < 38) {
    return 'Running'
  }

  if (thigh - back > 32 && thigh > 58) {
    return 'Cycling'
  }

  return 'Walking'
}

function rankDocuments(query) {
  const terms = tokenize(query)
  const docTokens = documents.map((doc) => ({
    ...doc,
    tokens: tokenize(`${doc.title} ${doc.text}`),
  }))

  const docFrequency = terms.reduce((frequency, term) => {
    return {
      ...frequency,
      [term]: docTokens.filter((doc) => doc.tokens.includes(term)).length || 1,
    }
  }, {})

  const ranked = docTokens
    .map((doc) => {
      const score = terms.reduce((sum, term) => {
        const tf = doc.tokens.filter((token) => token === term).length
        const idf = Math.log((documents.length + 1) / (docFrequency[term] + 1)) + 1

        return sum + tf * idf
      }, 0)

      return {
        ...doc,
        score: score / Math.sqrt(doc.tokens.length || 1),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  return { terms, ranked }
}

function HighlightedText({ text, terms }) {
  if (!terms.length) {
    return text
  }

  const pattern = new RegExp(`\\b(${terms.join('|')})[a-z]*\\b`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    const normalized = tokenize(part)[0]
    const isMatch = normalized && terms.includes(normalized)

    return isMatch ? <mark key={`${part}-${index}`}>{part}</mark> : part
  })
}

export function AppliedMlIrDemo() {
  const chartRef = useRef(null)
  const [activeTab, setActiveTab] = useState('activity')
  const [sensorValues, setSensorValues] = useState(activityPresets.walking)
  const [query, setQuery] = useState(
    'What is the role of Vitamin E in the therapy of patients with CF'
  )

  const prediction = classifyActivity(sensorValues)
  const retrieval = useMemo(() => rankDocuments(query), [query])

  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    const ctx = chart.getContext('2d')
    const width = chart.width
    const height = chart.height
    const padding = { top: 28, right: 24, bottom: 48, left: 54 }
    const metrics = ['accuracy', 'precision', 'recall', 'f1']
    const groupWidth = (width - padding.left - padding.right) / metrics.length
    const barWidth = 28

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = '#d8dfda'
    ctx.lineWidth = 1
    ctx.font = '13px system-ui, sans-serif'
    ctx.fillStyle = '#5f6f6b'

    for (let tick = 0; tick <= 1; tick += 0.25) {
      const y =
        height -
        padding.bottom -
        tick * (height - padding.top - padding.bottom)

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      ctx.fillText(tick.toFixed(2), 12, y + 4)
    }

    metrics.forEach((metric, groupIndex) => {
      const groupX = padding.left + groupIndex * groupWidth + groupWidth / 2

      classifierMetrics.forEach((model, modelIndex) => {
        const value = model[metric]
        const barHeight = value * (height - padding.top - padding.bottom)
        const x = groupX + (modelIndex - 1) * (barWidth + 8) - barWidth / 2
        const y = height - padding.bottom - barHeight

        ctx.fillStyle = model.color
        ctx.fillRect(x, y, barWidth, barHeight)
      })

      ctx.fillStyle = '#17211f'
      ctx.textAlign = 'center'
      ctx.fillText(metric.toUpperCase(), groupX, height - 18)
    })

    ctx.textAlign = 'start'
  }, [])

  const handlePresetChange = (event) => {
    setSensorValues(activityPresets[event.target.value])
  }

  const handleSensorChange = (key) => (event) => {
    setSensorValues((current) => ({
      ...current,
      [key]: Number(event.target.value),
    }))
  }

  return (
    <section
      id="interactive-demo"
      className="ml-ir-demo"
      aria-label="Interactive project demo"
    >
      <div className="ml-ir-demo-summary">
        <div>
          <p className="ml-ir-demo-eyebrow">Interactive demo</p>
          <h2>Applied ML and Information Retrieval Pipelines</h2>
          <p>
            Explore a compact version of the two modules: activity recognition
            from sensor-like inputs and TF-IDF-style ranking over document
            snippets.
          </p>
        </div>
        <div className="ml-ir-demo-stats" aria-label="Project summary">
          <div>
            <strong>2</strong>
            <span>data modalities</span>
          </div>
          <div>
            <strong>5</strong>
            <span>model families</span>
          </div>
          <div>
            <strong>19</strong>
            <span>retrieval queries</span>
          </div>
        </div>
      </div>

      <div className="ml-ir-demo-workspace">
        <div className="ml-ir-demo-tabs" role="tablist" aria-label="Demo modes">
          <button
            className={activeTab === 'activity' ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          >
            Activity recognition
          </button>
          <button
            className={activeTab === 'retrieval' ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={activeTab === 'retrieval'}
            onClick={() => setActiveTab('retrieval')}
          >
            Text retrieval
          </button>
        </div>

        {activeTab === 'activity' ? (
          <div className="ml-ir-demo-panel" role="tabpanel">
            <div className="ml-ir-demo-controls">
              <div className="ml-ir-demo-heading">
                <p className="ml-ir-demo-eyebrow">Sensor sample</p>
                <h3>Classify an activity pattern</h3>
              </div>

              <label className="ml-ir-demo-field" htmlFor="activityPreset">
                <span>Preset</span>
                <select id="activityPreset" onChange={handlePresetChange}>
                  <option value="walking">Walking</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="standing">Standing</option>
                </select>
              </label>

              <label className="ml-ir-demo-field" htmlFor="backMovement">
                <span>Back movement</span>
                <input
                  id="backMovement"
                  type="range"
                  min="0"
                  max="100"
                  value={sensorValues.back}
                  onChange={handleSensorChange('back')}
                />
              </label>

              <label className="ml-ir-demo-field" htmlFor="thighMovement">
                <span>Thigh movement</span>
                <input
                  id="thighMovement"
                  type="range"
                  min="0"
                  max="100"
                  value={sensorValues.thigh}
                  onChange={handleSensorChange('thigh')}
                />
              </label>

              <label className="ml-ir-demo-field" htmlFor="stability">
                <span>Posture stability</span>
                <input
                  id="stability"
                  type="range"
                  min="0"
                  max="100"
                  value={sensorValues.stability}
                  onChange={handleSensorChange('stability')}
                />
              </label>

              <div className="ml-ir-demo-prediction" aria-live="polite">
                <span>Predicted pattern</span>
                <strong>{prediction}</strong>
              </div>
            </div>

            <div className="ml-ir-demo-results">
              <div className="ml-ir-demo-heading">
                <p className="ml-ir-demo-eyebrow">Model comparison</p>
                <h3>Reported mean scores</h3>
              </div>
              <canvas
                ref={chartRef}
                width="640"
                height="320"
                aria-label="Classifier metric chart"
              />
              <div className="ml-ir-demo-legend">
                {classifierMetrics.map((model) => (
                  <span
                    key={model.name}
                    style={{ borderColor: model.color, color: model.color }}
                  >
                    {model.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ml-ir-demo-panel" role="tabpanel">
            <div className="ml-ir-demo-controls">
              <div className="ml-ir-demo-heading">
                <p className="ml-ir-demo-eyebrow">Mini retrieval engine</p>
                <h3>Search a sample text collection</h3>
              </div>

              <label className="ml-ir-demo-field" htmlFor="searchQuery">
                <span>Query</span>
                <textarea
                  id="searchQuery"
                  rows="4"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <div className="ml-ir-demo-terms" aria-label="Processed query terms">
                {retrieval.terms.map((term) => (
                  <span key={term}>{term}</span>
                ))}
              </div>
            </div>

            <div className="ml-ir-demo-results">
              <div className="ml-ir-demo-heading">
                <p className="ml-ir-demo-eyebrow">TF-IDF cosine ranking</p>
                <h3>Top matching documents</h3>
              </div>

              <div className="ml-ir-demo-result-list" aria-live="polite">
                {retrieval.ranked.map((doc) => (
                  <article className="ml-ir-demo-result" key={doc.id}>
                    <div>
                      <strong>
                        {doc.id} - {doc.title}
                      </strong>
                      <span>{doc.score.toFixed(3)}</span>
                    </div>
                    <p>
                      <HighlightedText text={doc.text} terms={retrieval.terms} />
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

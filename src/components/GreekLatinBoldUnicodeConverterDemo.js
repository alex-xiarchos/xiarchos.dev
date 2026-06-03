import React, { useMemo, useState } from 'react'

const buildGreekMap = (sourceLetters, targetLetters) =>
  Array.from(sourceLetters).reduce((map, letter, index) => {
    map[letter] = targetLetters[index]
    return map
  }, {})

const styles = {
  sans: {
    name: 'Sans-serif bold',
    greekUpper: buildGreekMap(
      'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
      Array.from('𝝖𝝗𝝘𝝙𝝚𝝛𝝜𝝝𝝞𝝟𝝠𝝡𝝢𝝣𝝤𝝥𝝦𝝨𝝩𝝪𝝫𝝬𝝭𝝮')
    ),
    greekLower: buildGreekMap(
      'αβγδεζηθικλμνξοπρστυφχψω',
      Array.from('𝝰𝝱𝝲𝝳𝝴𝝵𝝶𝝷𝝸𝝹𝝺𝝻𝝼𝝽𝝾𝝿𝞀𝞂𝞃𝞄𝞅𝞆𝞇𝞈')
    ),
    finalSigma: '𝞁',
    latinUpperStart: 0x1d5d4,
    latinLowerStart: 0x1d5ee,
    digitStart: 0x1d7ec,
  },
  serif: {
    name: 'Serif bold',
    greekUpper: buildGreekMap(
      'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
      Array.from('𝚨𝚩𝚪𝚫𝚬𝚭𝚮𝚯𝚰𝚱𝚲𝚳𝚴𝚵𝚶𝚷𝚸𝚺𝚻𝚼𝚽𝚾𝚿𝛀')
    ),
    greekLower: buildGreekMap(
      'αβγδεζηθικλμνξοπρστυφχψω',
      Array.from('𝛂𝛃𝛄𝛅𝛆𝛇𝛈𝛉𝛊𝛋𝛌𝛍𝛎𝛏𝛐𝛑𝛒𝛔𝛕𝛖𝛗𝛘𝛙𝛚')
    ),
    finalSigma: '𝛓',
    latinUpperStart: 0x1d400,
    latinLowerStart: 0x1d41a,
    digitStart: 0x1d7ce,
  },
}

const greekAccentMap = {
  Ά: 'Α',
  Έ: 'Ε',
  Ή: 'Η',
  Ί: 'Ι',
  Ϊ: 'Ι',
  Ό: 'Ο',
  Ύ: 'Υ',
  Ϋ: 'Υ',
  Ώ: 'Ω',
  ά: 'α',
  έ: 'ε',
  ή: 'η',
  ί: 'ι',
  ϊ: 'ι',
  ΐ: 'ι',
  ό: 'ο',
  ύ: 'υ',
  ϋ: 'υ',
  ΰ: 'υ',
  ώ: 'ω',
}

const normalizeChar = (char, stripGreekAccents, forceUppercase) => {
  let normalized = char

  if (stripGreekAccents && greekAccentMap[normalized]) {
    normalized = greekAccentMap[normalized]
  }

  if (forceUppercase) {
    normalized = normalized.toLocaleUpperCase('el-GR')

    if (stripGreekAccents && greekAccentMap[normalized]) {
      normalized = greekAccentMap[normalized]
    }
  }

  return normalized
}

const convertLatin = (char, style) => {
  const code = char.codePointAt(0)

  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(style.latinUpperStart + (code - 65))
  }

  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(style.latinLowerStart + (code - 97))
  }

  if (code >= 48 && code <= 57) {
    return String.fromCodePoint(style.digitStart + (code - 48))
  }

  return null
}

const convertChar = (char, style, stripGreekAccents, forceUppercase) => {
  const normalized = normalizeChar(char, stripGreekAccents, forceUppercase)

  if (normalized === 'ς') {
    return style.finalSigma
  }

  if (style.greekUpper[normalized]) {
    return style.greekUpper[normalized]
  }

  if (style.greekLower[normalized]) {
    return style.greekLower[normalized]
  }

  return convertLatin(normalized, style) ?? char
}

const convertText = (text, selectedStyle, stripGreekAccents, forceUppercase) => {
  const style = styles[selectedStyle]

  return Array.from(text)
    .map((char) => convertChar(char, style, stripGreekAccents, forceUppercase))
    .join('')
}

export function GreekLatinBoldUnicodeConverterDemo({ standalone = true }) {
  const [inputText, setInputText] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('sans')
  const [stripGreekAccents, setStripGreekAccents] = useState(true)
  const [forceUppercase, setForceUppercase] = useState(false)
  const [status, setStatus] = useState('')

  const outputText = useMemo(
    () =>
      convertText(
        inputText,
        selectedStyle,
        stripGreekAccents,
        forceUppercase
      ),
    [forceUppercase, inputText, selectedStyle, stripGreekAccents]
  )

  const currentStatus = outputText
    ? `${Array.from(outputText).length} χαρακτήρες · ${styles[selectedStyle].name} · έτοιμο για copy-paste.`
    : ''

  const handleCopy = async () => {
    if (!outputText) {
      setStatus('Δεν υπάρχει output για αντιγραφή.')
      return
    }

    try {
      await navigator.clipboard.writeText(outputText)
      setStatus('Αντιγράφηκε. Το κείμενο μόλις φόρεσε το καλό του σακάκι.')
    } catch (error) {
      setStatus('Δεν μπόρεσα να αντιγράψω αυτόματα. Κάνε manual επιλογή/copy.')
    }
  }

  const handleSample = () => {
    setInputText(
      'Καλημέρα κόσμε! Hello world 2026. Αυτό είναι bold ελληνικό + English text.'
    )
    setStatus('')
  }

  const handleClear = () => {
    setInputText('')
    setStatus('')
  }

  return (
    <>
      <style>{converterStyles}</style>
      <div
        className={`unicode-converter-page${standalone ? '' : ' is-embedded'}`}
      >
        <section className="unicode-converter" aria-labelledby="title">
          <header className="converter-header">
            <div className="masthead">
              <span className="eyebrow">Unicode tool</span>
              <h1 id="title">Greek & Latin Bold</h1>
              <p className="subtitle">
                Μετατροπή ελληνικών, λατινικών και αριθμών σε bold μαθηματικούς
                Unicode χαρακτήρες.
              </p>
            </div>

            <div className="style-preview">
              <div className="preview-card">
                <div className="preview-title">
                  <span>Sans-serif bold</span>
                  <span className="preview-pill">default</span>
                </div>
                <div className="alphabet">
                  𝝖 𝝗 𝝘 𝝙 𝝚 𝝛 𝝜 𝝝 𝝞 𝝟 𝝠 𝝡 𝝢 𝝣 𝝤 𝝥 𝝦 𝝨 𝝩
                  𝝪 𝝫 𝝬 𝝭 𝝮
                  <br />
                  𝝰 𝝱 𝝲 𝝳 𝝴 𝝵 𝝶 𝝷 𝝸 𝝹 𝝺 𝝻 𝝼 𝝽 𝝾 𝝿 𝞀 𝞂 𝞃 𝞄 𝞅 𝞆
                  𝞇 𝞈
                  <br />
                  𝗔𝗕𝗖 · 𝗮𝗯𝗰 · 𝟬𝟭𝟮
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-title">
                  <span>Serif bold</span>
                  <span className="preview-pill">classic</span>
                </div>
                <div className="alphabet">
                  𝚨 𝚩 𝚪 𝚫 𝚬 𝚭 𝚮 𝚯 𝚰 𝚱 𝚲 𝚳 𝚴 𝚵 𝚶 𝚷 𝚸 𝚺 𝚻
                  𝚼 𝚽 𝚾 𝚿 𝛀
                  <br />
                  𝛂 𝛃 𝛄 𝛅 𝛆 𝛇 𝛈 𝛉 𝛊 𝛋 𝛌 𝛍 𝛎 𝛏 𝛐 𝛑 𝛒 𝛔 𝛕 𝛖 𝛗 𝛘
                  𝛙 𝛚
                  <br />
                  𝐀𝐁𝐂 · 𝐚𝐛𝐜 · 𝟎𝟏𝟐
                </div>
              </div>
            </div>
          </header>

          <main className="converter-main">
            <div className="controls">
              <div className="top-controls">
                <div
                  className="style-options"
                  role="radiogroup"
                  aria-label="Unicode style"
                >
                  <label className="radio-card">
                    <input
                      type="radio"
                      name="style"
                      value="sans"
                      checked={selectedStyle === 'sans'}
                      onChange={(event) => setSelectedStyle(event.target.value)}
                    />
                    Sans-serif bold
                  </label>

                  <label className="radio-card">
                    <input
                      type="radio"
                      name="style"
                      value="serif"
                      checked={selectedStyle === 'serif'}
                      onChange={(event) => setSelectedStyle(event.target.value)}
                    />
                    Serif bold
                  </label>
                </div>

                <div className="buttons">
                  <button className="primary" type="button" onClick={handleCopy}>
                    Αντιγραφή output
                  </button>
                  <button
                    className="secondary"
                    type="button"
                    onClick={handleSample}
                  >
                    Βάλε παράδειγμα
                  </button>
                  <button className="danger" type="button" onClick={handleClear}>
                    Καθάρισμα
                  </button>
                </div>
              </div>

              <div className="switches">
                <label className="switch" htmlFor="stripGreekAccents">
                  <input
                    id="stripGreekAccents"
                    type="checkbox"
                    checked={stripGreekAccents}
                    onChange={(event) =>
                      setStripGreekAccents(event.target.checked)
                    }
                  />
                  Αφαίρεση ελληνικών τόνων
                </label>

                <label className="switch" htmlFor="forceUppercase">
                  <input
                    id="forceUppercase"
                    type="checkbox"
                    checked={forceUppercase}
                    onChange={(event) => setForceUppercase(event.target.checked)}
                  />
                  Μετατροπή όλων σε κεφαλαία
                </label>
              </div>
            </div>

            <div className="converter-grid">
              <section className="pane">
                <label className="main-label" htmlFor="inputText">
                  Input κείμενο
                </label>
                <textarea
                  id="inputText"
                  placeholder="Π.χ. Καλημέρα κόσμε! Hello world 2026."
                  value={inputText}
                  onChange={(event) => {
                    setInputText(event.target.value)
                    setStatus('')
                  }}
                />
                <p className="hint">
                  Οι τόνοι στα ελληνικά δεν υπάρχουν ως ξεχωριστά bold μαθηματικά
                  Unicode γράμματα, οπότε αφαιρούνται προαιρετικά.
                </p>
              </section>

              <section className="pane">
                <label className="main-label" htmlFor="outputText">
                  Bold Unicode output
                </label>
                <div id="outputText" className="output" aria-live="polite">
                  {outputText}
                </div>
                <div id="status" className="status">
                  {status || currentStatus}
                </div>
              </section>
            </div>
          </main>

          <footer className="converter-footer">
            <div className="mapping-title">Reference</div>
            <div className="mapping-list" aria-label="Παράδειγμα mapping">
              <code>Α → 𝝖 / 𝚨</code>
              <code>α → 𝝰 / 𝛂</code>
              <code>A → 𝗔 / 𝐀</code>
              <code>a → 𝗮 / 𝐚</code>
              <code>ς → 𝞁 / 𝛓</code>
            </div>
          </footer>
        </section>
      </div>
    </>
  )
}

const converterStyles = `
  .unicode-converter-page {
    min-height: 100vh;
    margin: 0;
    padding: 34px 18px;
    background:
      linear-gradient(90deg, rgba(124, 114, 76, .12) 1px, transparent 1px),
      linear-gradient(180deg, rgba(124, 114, 76, .08) 1px, transparent 1px),
      #fdf9ee;
    background-size: 42px 42px;
    color: #25252b;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .unicode-converter-page * {
    box-sizing: border-box;
  }

  .unicode-converter-page.is-embedded {
    min-height: 0;
    margin-bottom: 2rem;
    padding: 0;
    background: transparent;
  }

  .unicode-converter {
    width: min(1180px, 100%);
    margin: 0 auto;
    background: #fbfbfb;
    border: 1px solid #7c724c;
    border-radius: 6px;
    box-shadow: 0 18px 40px rgba(124, 114, 76, .14);
    overflow: hidden;
  }

  .unicode-converter-page.is-embedded .unicode-converter {
    width: 100%;
  }

  .converter-header {
    display: grid;
    grid-template-columns: minmax(260px, .78fr) minmax(420px, 1.22fr);
    gap: 28px;
    align-items: end;
    padding: 26px 28px 24px;
    border-bottom: 1px solid #7c724c;
    background: #fbfbfb;
  }

  .masthead {
    display: grid;
    gap: 18px;
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    border: 1px solid #7c724c;
    border-radius: 999px;
    padding: 5px 10px;
    color: #8a6414;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .78rem;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .unicode-converter h1 {
    max-width: 9ch;
    margin: 0;
    color: #25252b;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.15rem, 5vw, 4.8rem);
    font-weight: 700;
    line-height: .92;
    letter-spacing: 0;
  }

  .unicode-converter-page.is-embedded .unicode-converter h1 {
    font-size: clamp(2rem, 4vw, 3.4rem);
  }

  .subtitle {
    margin: 0;
    color: #4e4e55;
    font-size: .98rem;
    line-height: 1.55;
    max-width: 40rem;
  }

  .style-preview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid #7c724c;
    border-radius: 6px;
    overflow: hidden;
  }

  .preview-card {
    min-width: 0;
    padding: 14px 15px 15px;
    background: #f6f0df;
  }

  .preview-card + .preview-card {
    border-left: 1px solid #7c724c;
  }

  .preview-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    color: #25252b;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .76rem;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .preview-pill {
    color: #2d922d;
    background: #eef5e8;
    border: 1px solid rgba(45, 146, 45, .28);
    border-radius: 999px;
    padding: 3px 8px;
    font-size: .68rem;
    white-space: nowrap;
  }

  .alphabet {
    color: #25252b;
    font-size: clamp(.98rem, 1.6vw, 1.18rem);
    line-height: 1.72;
    overflow-wrap: anywhere;
  }

  .converter-main {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: start;
  }

  .controls {
    display: grid;
    gap: 22px;
    min-height: 100%;
    padding: 22px 20px;
    border-right: 1px solid #7c724c;
    background: #f6f0df;
  }

  .top-controls,
  .style-options {
    display: grid;
  }

  .top-controls {
    gap: 22px;
  }

  .style-options {
    gap: 8px;
  }

  .radio-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ded4b2;
    background: #fbfbfb;
    cursor: pointer;
    user-select: none;
    color: #25252b;
    font-weight: 750;
  }

  .radio-card:has(input:checked) {
    border-color: #8a6414;
    background: #eee8d5;
    box-shadow: inset 4px 0 0 #8a6414;
  }

  .radio-card input,
  .switch input {
    accent-color: #8a6414;
  }

  .switches {
    display: grid;
    gap: 9px;
    color: #4e4e55;
    font-size: .94rem;
  }

  .switch {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    user-select: none;
    cursor: pointer;
    line-height: 1.35;
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .unicode-converter button {
    min-height: 43px;
    border: 1px solid #7c724c;
    border-radius: 6px;
    padding: 10px 12px;
    font-weight: 800;
    cursor: pointer;
    font: inherit;
    transition: transform .12s ease, background .12s ease, color .12s ease;
  }

  .unicode-converter button:hover {
    transform: translateY(-1px);
  }

  .unicode-converter button:active {
    transform: translateY(0);
  }

  .primary {
    background: #8a6414;
    color: #fff;
  }

  .secondary {
    background: #fbfbfb;
    color: #2f71b4;
  }

  .danger {
    background: #fbfbfb;
    color: #7b4f2a;
  }

  .converter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    min-height: 470px;
  }

  .pane {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-width: 0;
    padding: 22px;
  }

  .pane + .pane {
    border-left: 1px solid #7c724c;
  }

  .main-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .82rem;
    font-weight: 850;
    letter-spacing: .05em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .unicode-converter textarea {
    width: 100%;
    min-height: 320px;
    resize: vertical;
    border: 1px solid #ded4b2;
    outline: none;
    border-radius: 6px;
    background: #fbfbfb;
    color: #25252b;
    font: inherit;
    line-height: 1.58;
    padding: 16px;
    transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
  }

  .unicode-converter textarea:focus {
    border-color: #2f71b4;
    box-shadow: 0 0 0 3px rgba(31, 93, 143, .14);
    background: #fdfbf5;
  }

  .output {
    min-height: 320px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    border: 1px solid #ded4b2;
    border-radius: 6px;
    background:
      linear-gradient(#fbfbfb 31px, rgba(222, 212, 178, .65) 32px);
    background-size: 100% 32px;
    padding: 16px;
    line-height: 1.58;
    color: #25252b;
    font-size: 1.06rem;
  }

  .status {
    color: #4e4e55;
    min-height: 1.5em;
    font-size: .9rem;
    margin-top: 9px;
  }

  .hint {
    color: #4e4e55;
    font-size: .88rem;
    line-height: 1.5;
    margin: 9px 0 0;
  }

  .converter-footer {
    display: grid;
    gap: 10px;
    padding: 16px 28px 18px;
    border-top: 1px solid #7c724c;
    background: #f6f0df;
    color: #4e4e55;
    font-size: .86rem;
    line-height: 1.55;
  }

  .mapping-title {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .76rem;
    font-weight: 850;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #25252b;
  }

  .mapping-list {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .unicode-converter code {
    color: #25252b;
    background: #fdf9ee;
    border: 1px solid #ded4b2;
    border-radius: 4px;
    padding: 1px 5px;
  }

  @media (max-width: 860px) {
    .unicode-converter-page {
      padding: 14px;
    }

    .converter-header {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 22px 18px;
    }

    .unicode-converter h1 {
      max-width: 12ch;
    }

    .converter-main {
      grid-template-columns: 1fr;
    }

    .controls {
      border-right: 0;
      border-bottom: 1px solid #7c724c;
    }

    .converter-grid {
      grid-template-columns: 1fr;
      min-height: 0;
    }

    .pane + .pane {
      border-left: 0;
      border-top: 1px solid #7c724c;
    }

    .style-preview {
      grid-template-columns: 1fr;
    }

    .preview-card + .preview-card {
      border-left: 0;
      border-top: 1px solid #7c724c;
    }
  }
`

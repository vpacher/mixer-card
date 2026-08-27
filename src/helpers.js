import { computeStateDisplay, computeStateDomain } from 'custom-card-helpers'
import { html } from 'lit'

export function getConfigDefaults (config) {
  return {
    borderRadius: config && config.borderRadius ? config.borderRadius : '12px',
    // Leaving these unset (null) puts the card in fluid mode: it sizes
    // itself from CSS (see :host in styles.js) to fit whatever width/height
    // Home Assistant's layout gives it, instead of a fixed pixel size that
    // overflows on narrow viewports. Set them explicitly to opt back into
    // the old fixed-size behavior.
    faderWidth: config && config.faderWidth ? config.faderWidth : null,
    faderHeight: config && config.faderHeight ? config.faderHeight : null,
    faderInactiveColor: config && config.faderInactiveColor ? config.faderInactiveColor : '#f00',
    faderThumbColor: config && config.faderThumbColor ? config.faderThumbColor : '#ddd',
    faderTrackColor: config && config.faderTrackColor ? config.faderTrackColor : '#ddd',
    faderActiveColor: config && config.faderActiveColor ? config.faderActiveColor : '#22ba00',
    faderTheme: config && config.faderTheme ? config.faderTheme : 'modern',
    updateWhileMoving: config && config.updateWhileMoving ? config.updateWhileMoving : false,
    alwaysShowFaderValue: config && config.alwaysShowFaderValue ? config.alwaysShowFaderValue : false,
    showActiveButton: config && config.showActiveButton !== undefined ? config.showActiveButton : true,
    haCard: config && config.haCard !== undefined ? config.haCard : true,
    description: config && config.description ? config.description : '',
    title: config && config.title ? config.title : '',
    faderKnobImage: config && config.faderKnobImage ? config.faderKnobImage : '',
    orientation: config && config.orientation ? config.orientation : 'vertical'
  }
}

// Decorative dB scale matching the look of a Behringer X32/M32 channel
// strip's printed fader scale. Positions (0% = top of travel, 100% =
// bottom) are hand-picked to visually resemble the real hardware's tick
// spacing — they are NOT derived from the mixer's actual non-linear fader
// law, since that conversion isn't exposed to this card. Purely cosmetic.
export const X32_DB_SCALE_TICKS = [
  { label: '+10', top: 0 },
  { label: '5', top: 8 },
  { label: '0', top: 18 },
  { label: '-5', top: 28 },
  { label: '-10', top: 38 },
  { label: '-15', top: 46 },
  { label: '-20', top: 53 },
  { label: '-25', top: 60 },
  { label: '-30', top: 66 },
  { label: '-40', top: 78 },
  { label: '-50', top: 87 },
  { label: '-60', top: 94 },
  { label: '-∞', top: 100 }
]

export function renderDbScale () {
  return html`
    <div class="fader-db-scale">
      ${X32_DB_SCALE_TICKS.map(tick => html`<span class="db-tick" style="top: ${tick.top}%">${tick.label}</span>`)}
    </div>
  `
}

export function generateHeader (cfg) {
  const header = cfg.title ? html`<h1 class='card-header'><div class='name'>${cfg.title}</div></div>` : ''
  const desc = cfg.description ? html`<p class='mixer-description'>${cfg.description}</p>` : ''
  return html`${header}${desc}`
}

export function getFaderStyle (faderColors, cfg, activeState) {
  let style = `--fader-border-radius: ${cfg.borderRadius}; `
  if (cfg.faderWidth) style += `--fader-width: ${cfg.faderWidth}; `
  if (cfg.faderHeight) style += `--fader-height: ${cfg.faderHeight}; `
  style += `--fader-color: ${activeState === 'on' ? faderColors.active : faderColors.inactive}; `
  style += `--fader-thumb-color: ${faderColors.thumb}; --fader-track-color: ${faderColors.track}; --fader-track-inactive-color: ${faderColors.inactive};`
  if (cfg.faderKnobImage) {
    style += ` --fader-knob-image: url("${cfg.faderKnobImage}");`
  }
  return style
}

export function getFaderColor (faderRow, cfg) {
  return {
    track: faderRow.track_color || cfg.faderTrackColor,
    active: faderRow.active_color || cfg.faderActiveColor,
    inactive: faderRow.inactive_color || cfg.faderInactiveColor,
    thumb: faderRow.thumb_color || cfg.faderThumbColor
  }
}

export function getFaderIcon (faderRow, stateObj, activeState) {
  return activeState === 'on' ? 'mdi:volume-high' : 'mdi:volume-mute'
}

export function getFaderValue (faderRow, stateObj, hass) {
  const maxValue = (typeof faderRow.max === 'number') ? faderRow.max : stateObj.attributes.max || 1
  const minValue = (typeof faderRow.min === 'number') ? faderRow.min : stateObj.attributes.min || 0
  let rawValue = 0
  const domain = computeStateDomain(stateObj)
  if (domain === 'media_player') {
    rawValue = stateObj.attributes.volume_level || 0
  } else {
    rawValue = stateObj.state
  }
  const inputValue = Math.round((rawValue - minValue) / (maxValue - minValue) * 100)
  let displayValue = inputValue + '%'
  if (faderRow.value_entity_id && Object.prototype.hasOwnProperty.call(hass.states, faderRow.value_entity_id)) {
    displayValue = computeStateDisplay(hass.localize, hass.states[faderRow.value_entity_id], hass.language)
  } else if (faderRow.value_attribute && Object.prototype.hasOwnProperty.call(stateObj.attributes, faderRow.value_attribute)) {
    displayValue = stateObj.attributes[faderRow.value_attribute]
  }
  const suffix = faderRow.value_suffix || ''
  if (suffix) {
    displayValue += ` ${suffix}`
  }
  return { displayValue, inputValue }
}

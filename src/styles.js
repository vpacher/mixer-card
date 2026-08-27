import { css } from 'lit'

export const mixerCardStyles = css`
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        /* Fluid fader dimensions: used whenever a fader/card config doesn't
           set an explicit faderWidth/faderHeight (see getConfigDefaults).
           Deliberately fixed, not vw/vh-based: this card can end up in a
           section column far narrower than the browser viewport (HA's
           sections view splits the page into several such columns), and
           viewport units have no way to know that — they size against the
           whole window, not the space actually given to the card, which
           reintroduces the original overflow/wrap bug one level up. A
           modest fixed default plus .fader-holder's flex-wrap is what
           actually makes this responsive: faders wrap onto a new row once
           the card's *own* width runs out, regardless of viewport size. */
        --fader-width: 84px;
        --fader-height: 220px;
    }

    h4 {
        color: #00F;
        display: block;
        font-weight: 300;
        margin-bottom: 30px;
        text-align: center;
        font-size:20px;
        margin-top:0;
        text-transform: capitalize;
    }
    h4.brightness:after {
      content: attr(data-value);
      padding-left: 1px;
    }
    .mixer-card {
        /* padding (not margin) matches ha-card's own .card-content
           convention, so this card lines up with sibling cards without
           needing a card_mod offset hack. */
        padding: 16px;
        box-sizing: border-box;
    }
    .fader-holder {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      width: 100%;
      overflow-x: auto; /* Fallback if a single row still can't fit */
      -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    }


    .active-button span {
      pointer-events: none;
    }
    .active-button ha-icon {
      pointer-events: none;
    }
    p.mixer-description {
        margin: 16px;
        margin-top: 0px;
    }
    .fader-unavailable, .button-disabled {
        opacity: 20%;
        pointer-events: none;
    }

    /* Orientation  - Vertical */

    .fader-orientation-vertical .fader {
        padding: 6px 10px;
        /* Fixed to the slider's own thickness rather than sized from the
           name/value text below it — otherwise a longer fader name (e.g.
           "Office Speaker") silently widens the whole column, and a couple
           of those can be just enough to tip flex-wrap into wrapping faders
           that would otherwise fit side by side. Text wraps within this
           width instead (see .fader-name/.fader-value below). */
        width: var(--fader-width);
        flex: 0 0 auto;
        box-sizing: content-box;
    }
    .fader-orientation-vertical .fader-value {
        margin-top: 10px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .fader-orientation-vertical .fader-name {
        margin-top: 30px;
        text-align: center;
        display: block;
        font-weight: 300;
        text-align: center;
        font-size:14px;
        text-transform: capitalize;
        /* Truncate rather than wrap/grow: a longer name (e.g. "Office
           Speaker") should never widen the fader column — that's the
           slider's job to define (--fader-width), not the label's. This
           matches how HA's own cards handle overflowing text (tile, entity
           rows, etc: ellipsis, not reflow). */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .fader-orientation-vertical .active-button {
        margin:20px;
        margin-top: 30px;
        line-height:20px;
        border: 1px solid #bbb;
        box-shadow: 1px 1px 1px #bbb;
        display:block;
        padding: 5px;
        cursor:pointer;
        vertical-align: center;
        text-align: center;
        border-radius: 5px;
    }
    .fader-orientation-vertical .range-holder {
        height: var(--fader-height);
        width: var(--fader-width);
        position:relative;
        display: block;
        margin-right: auto;
        margin-left: auto;
    }

    .fader-orientation-vertical .range-holder input[type="range"] {
        margin: 0;
        outline: 0;
        border: 0;
        -webkit-transform:rotate(270deg);
        -moz-transform:rotate(270deg);
        -o-transform:rotate(270deg);
        -ms-transform:rotate(270deg);
        transform:rotate(270deg);
        position: absolute;
        top: calc(50% - (var(--fader-width) / 2));
        right: calc(50% - (var(--fader-height) / 2));
        background-color: var(--fader-track-color);
        transition: box-shadow 0.2s ease-in-out;
        -webkit-appearance: none;
        appearance: none;
        border-radius: var(--fader-border-radius, 12px);
    }

    /* Orientation  - Horizontal */

    .fader-orientation-horizontal .fader-holder {
        display: contents;
    }
    .fader-orientation-horizontal .fader {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0;
        margin-bottom: 0px;
        gap: 15px;
    }
    .fader-orientation-horizontal .fader-holder,
    .fader-orientation-horizontal .fader-data {
        display: contents;
    }
    .fader-orientation-horizontal .fader-value {
        text-align: center;
        display:inline-block;
        order: 3;
        min-width: 50px;
    }
    .fader-orientation-horizontal .fader-name {
        display:inline-block;
        text-align: center;
        font-weight: 300;
        text-align: left;
        font-size:14px;
        text-transform: capitalize;
        order: 4;
    }
    .fader-orientation-horizontal .active-button-holder {
        display:inline-block;
        order: 1;
    }
    .fader-orientation-horizontal .active-button {
        line-height:20px;
        border: 1px solid #bbb;
        box-shadow: 1px 1px 1px #bbb;
        display: inline-block;
        padding: 5px;
        cursor:pointer;
        vertical-align: center;
        text-align: center;
        border-radius: 5px;
    }

    .fader-orientation-horizontal .range-holder {
        order: 2;
        height: var(--fader-width);
        /* Fill whatever width the row has left, rather than a fixed
           --fader-height, so horizontal faders track the card's actual
           width instead of overflowing/underflowing it. */
        flex: 1 1 auto;
        width: auto;
        min-width: 80px;
        position:relative;
        display: flex;
        align-items: center;
        margin: 0;
    }

    .fader-orientation-horizontal .range-holder input[type="range"] {
        margin: 0;
        outline: 0;
        border: 0;
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
        left: 0;
        width: 100%;
        height: var(--fader-width);
        background-color: var(--fader-track-color);
        transition: box-shadow 0.2s ease-in-out;
        -webkit-appearance: none;
        appearance: none;
        border-radius: var(--fader-border-radius, 12px);
    }

    /* Theme Physical */
    .fader-theme-physical .range-holder input[type="range"] {
        top: 50%;
        width: var(--fader-height);
        height: 5px;
        background-color: var(--fader-track-color);
    }
    .fader-theme-physical .range-holder input[type="range"].fader-inactive {
        background-color: var(--fader-track-inactive-color);
    }
    .fader-theme-physical .range-holder input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        /* Scaled from --fader-width (thickness) rather than a fixed 40x85px,
           so the knob shrinks/grows with the track instead of overflowing
           it at small fluid sizes. Ratio matches the old fixed values
           exactly at the legacy 150px default, so background-size: cover
           crops the SVG the same way as before at any scale. */
        height: calc(var(--fader-width) * 0.26667);
        width: calc(var(--fader-width) * 0.56667);
        cursor: pointer;
        transition: box-shadow 0.2s ease-in-out;
        background-image: var(--fader-knob-image, url("/hacsfiles/mixer-card/fader.svg"));
        background-size: cover;
        border-radius: 7px;
    }

    /* Theme Modern */
    .fader-theme-modern .range-holder input[type="range"] {
        width: var(--fader-height);
        height: var(--fader-width);
        -webkit-appearance: none;
        background-color: var(--fader-track-color);
        overflow: hidden;
    }
    .fader-theme-modern .range-holder input[type="range"]::-webkit-slider-runnable-track {
        height: var(--fader-width);
        -webkit-appearance: none;
        background-color: var(--fader-track-color);
        margin-top: -1px;
        transition: box-shadow 0.2s ease-in-out;
    }
    .fader-theme-modern .range-holder input[type="range"]::-webkit-slider-thumb {
        width: 25px;
        border-right:10px solid var(--fader-color);
        border-left:10px solid var(--fader-color);
        border-top:20px solid var(--fader-color);
        border-bottom:20px solid var(--fader-color);
        -webkit-appearance: none;
        height: 80px;
        cursor: pointer;
        background: #fff;
        box-shadow: -350px 0 0 350px var(--fader-color), inset 0 0 0 80px var(--fader-thumb-color);
        border-radius: 0;
        transition: box-shadow 0.2s ease-in-out;
        position: relative;
        top: calc((var(--fader-width) - 80px) / 2);
    }

    /* Both themes above set an explicit width on the range input (driven
       by --fader-height, meant as the vertical-orientation "length" after
       rotation). In horizontal orientation that same input is never
       rotated, so pin its width back to 100% of the flexed range-holder
       (higher specificity than the theme rules so it wins regardless of
       theme). */
    .fader-orientation-horizontal .fader-theme-modern .range-holder input[type="range"],
    .fader-orientation-horizontal .fader-theme-physical .range-holder input[type="range"] {
        width: 100%;
    }
`

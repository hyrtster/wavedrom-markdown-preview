import JSON5 from 'json5';
import { renderAny, waveSkin, onml } from 'wavedrom';
import darkSkinObj from './skins/dark.js';
import narrowSkinObj from './skins/narrow.js';
import lowkeySkinObj from './skins/lowkey.js';

type SkinObj = Record<string, any[]>;

function getConfig(): { darkSkin: string; lightSkin: string; isDark: boolean } {
    const span = document.getElementById('markdown-wavedrom');
    const isDark = document.body.classList.contains('vscode-dark') ||
                   document.body.classList.contains('vscode-high-contrast');
    return {
        darkSkin: span?.getAttribute('data-dark-skin') ?? 'dark',
        lightSkin: span?.getAttribute('data-light-skin') ?? 'default',
        isDark
    };
}

function getMergedSkins(config: ReturnType<typeof getConfig>): SkinObj {
    const activeSkinName = config.isDark ? config.darkSkin : config.lightSkin;

    const merged: SkinObj = {};
    const lightSrc = (waveSkin as SkinObj).default ? waveSkin as SkinObj : {};

    Object.assign(merged, lightSrc, darkSkinObj, narrowSkinObj, lowkeySkinObj);

    if (merged[activeSkinName]) {
        merged.default = merged[activeSkinName];
    } else if (merged.default) {
    } else {
        const keys = Object.keys(merged);
        if (keys.length > 0) {
            merged.default = merged[keys[0]];
        }
    }

    return merged;
}

function init() {
    const config = getConfig();
    const mergedSkins = getMergedSkins(config);

    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.wavedrom'));
    for (const block of blocks) {
        const text = (block.textContent ?? '').trim();
        if (!text) continue;

        try {
            const source = JSON5.parse(text);
            const onmlResult = renderAny(0, source, mergedSkins);
            const svgStr = onml.stringify(onmlResult);
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
            const svgEl = svgDoc.documentElement;
            if (svgEl instanceof SVGElement) {
                block.innerHTML = '';
                block.appendChild(svgEl);
            } else {
                throw new Error('Rendering produced invalid SVG');
            }
        } catch (e: any) {
            block.innerHTML = `<pre class="wavedrom-error" style="color: var(--vscode-errorForeground, red); background: var(--vscode-inputValidation-errorBackground, #fdd); padding: 8px; border-radius: 4px; overflow-x: auto;"><strong>WaveDrom Error:</strong> ${escapeHtml(e?.message ?? String(e))}</pre>`;
        }
    }
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.addEventListener('vscode.markdown.updateContent', init);
init();

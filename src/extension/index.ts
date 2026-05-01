import * as vscode from 'vscode';

const configSection = 'wavedrom-markdown';

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configSection) || e.affectsConfiguration('workbench.colorTheme')) {
            vscode.commands.executeCommand('markdown.preview.refresh');
        }
    }));

    return {
        extendMarkdownIt(md: any) {
            const highlight = md.options.highlight;
            md.options.highlight = (code: string, lang: string, attrs: string) => {
                if (lang && lang.toLowerCase() === 'wavedrom') {
                    return `<div class="wavedrom">${preProcess(code)}</div>`;
                }
                return highlight?.(code, lang, attrs) ?? '';
            };

            const render = md.renderer.render;
            md.renderer.render = function (...args: any[]) {
                const darkSkin = vscode.workspace.getConfiguration(configSection).get<string>('darkSkin', 'dark');
                const lightSkin = vscode.workspace.getConfiguration(configSection).get<string>('lightSkin', 'default');
                return `<span id="markdown-wavedrom" aria-hidden="true"
                            data-dark-skin="${darkSkin}"
                            data-light-skin="${lightSkin}"></span>
                        ${render.apply((md as any).renderer, args)}`;
            };

            return md;
        }
    };
}

function preProcess(source: string): string {
    return source
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n+$/, '')
        .trimStart();
}

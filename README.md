# Markdown Preview Wavedrom Support

Adds [Wavedrom](https://wavedrom.com/) timing diagram and register field rendering to VS Code's built-in markdown preview.

## Features

- Render Wavedrom timing diagrams from ````wavedrom` fenced code blocks in Markdown files
- Supports all three WaveJSON diagram types: **signal** (timing diagrams), **assign** (logic assignments), **reg** (register/bit fields)
- Dark/light theme auto-detection with appropriate skins
- Configurable skins: `default`, `dark`, `narrow`, `lowkey`, `narrower`, `narrowerer`
- Supports JSON5 syntax (unquoted keys, trailing commas, comments)
- Error messages displayed inline for invalid WaveJSON

## Usage

In any Markdown file, create a fenced code block with the language `wavedrom`:

````markdown
```wavedrom
{signal: [
  {name: 'clk',  wave: 'p.....|...'},
  {name: 'data', wave: 'x.3..4.x', data: ['a', 'b', 'c']},
  {name: 'req',  wave: '0...1...0'}
]}
```
````

Open the markdown preview with `Ctrl+Shift+V` to see the rendered diagram.

### Register/bit-field diagrams

````markdown
```wavedrom
{reg: [
  {name: 'CTRL', bits: 8},
  {bits: 2, name: 'MODE',  attr: 'RW'},
  {bits: 1, name: 'EN',    attr: 'RW'},
  {bits: 5, name: 'RSVD',  attr: 'RO', type: 1}
]}
```
````

### Assignment diagrams

````markdown
```wavedrom
{assign: [
  {name: 'a',  wave: '01.01'},
  {name: 'b',  wave: '01.01'},
  {name: 'c',  wave: '0101.'}
]}
```
````

## Extension Settings

This extension contributes the following settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `wavedrom-markdown.darkSkin` | Wavedrom skin to use when VS Code is in dark mode | `dark` |
| `wavedrom-markdown.lightSkin` | Wavedrom skin to use when VS Code is in light mode | `default` |

Available skins: `default`, `dark`, `narrow`, `lowkey`, `narrower`, `narrowerer`

You can also override the skin per-diagram by adding `config.skin` to your WaveJSON:

````markdown
```wavedrom
{signal: [
  {name: 'clk', wave: 'p.....'}
],
config: {skin: 'narrow'}}
```
````

## About This Project

This extension is an experimental **VibeCoding** project. Developed using the **DeepSeek V4** model, the entire project was completed at a cost of **less than 2 RMB** — with almost zero human intervention throughout the entire process. The author has no knowledge of JavaScript syntax whatsoever.

> 本项目是一次 **VibeCoding** 的实验性尝试。全程使用 **DeepSeek V4** 模型开发，总花费不足 **2 元人民币**，几乎零人工干预。作者本人完全不懂 JavaScript 语法。

## License

MIT

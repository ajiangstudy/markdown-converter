# Markdown 转纯文本 / Markdown Converter

一个基于 React + Vite 的小工具，用于将 Markdown 实时转换为“纯文本 + 编号列表”格式，便于粘贴到不支持 Markdown 的场景。

A small React + Vite tool that converts Markdown into plain text with numbered lists, suitable for environments that don’t support Markdown.

## 演示 / Demo
- 在线演示 / Live demo: https://ajiangstudy.github.io/markdown-converter/

![image-20260122101733013](https://res.cloudinary.com/dbzlj1fxh/image/upload/v1769048264/2026/01/cc2feb9e9ed6858f70664d643829085a.png)

## 功能 / Features
- 实时转换 Markdown 为纯文本 / Real-time conversion to plain text
- 无序列表自动编号 / Auto-number unordered lists
  - 一级列表 → `1. 2. 3. ...`
  - 二级列表（有缩进）→ `(1)(2)(3)...`
- 自动去除 Markdown 标记 / Remove Markdown markers
  - 标题、粗体、斜体、行内代码
  - Headings, bold, italic, inline code
- 链接保留文本，移除 URL / Keep link text, remove URL
- 一键清空 / 一键复制 / Clear & copy

## 技术栈 / Tech Stack
- React
- Vite
- Tailwind CSS
- lucide-react

## 本地运行 / Run Locally
```bash
npm install
npm run dev
```

## 构建与预览 / Build & Preview
```bash
npm run build
npm run preview
```

## 使用说明 / Usage
1. 将 Markdown 内容粘贴到左侧输入框。
2. 右侧会实时输出转换后的纯文本。
3. 点击“复制”可将结果复制到剪贴板。

Paste Markdown into the left input. The converted plain text appears on the right in real time. Click “Copy” to copy the output.

## 规则说明 / Rules
- 标题（`#` 到 `######`）会被移除，只保留标题文本。
- 无序列表（`*` / `-` / `+`）会被编号：
  - 缩进为 0 或 ≤2 个空格视为一级列表
  - 缩进更深视为二级列表
- 粗体、斜体、行内代码标记会被移除。
- 链接保留可读文本，移除 URL。

Headings are stripped, unordered lists are numbered (top-level vs nested by indent), and inline formatting markers are removed. Links keep readable text only.

## 目录结构 / Structure
```
src/
  App.jsx
  MarkdownConverter.jsx
  index.css
  main.jsx
```

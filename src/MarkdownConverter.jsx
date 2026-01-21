import React, { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'

export default function MarkdownConverter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const convertMarkdown = (text) => {
    if (!text.trim()) return ''
    let result = text

    // 移除标题标记 (# ## ###)
    result = result.replace(/^#{1,6}\s+/gm, '')

    // 处理无序列表 (* - +)
    const lines = result.split('\n')
    const processedLines = []
    let level1Count = 0
    let level2Count = 0
    let lastIndent = 0

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i]

      // 检测缩进级别
      let indent = 0
      const match = line.match(/^(\s*)[*\-+]\s+/)

      if (match) {
        indent = match[1].length
        const content = line.replace(/^\s*[*\-+]\s+/, '')

        // 判断是一级还是二级
        if (indent === 0 || indent <= 2) {
          // 一级列表
          level1Count += 1
          level2Count = 0
          processedLines.push(`${level1Count}. ${content}`)
          lastIndent = 0
        } else {
          // 二级列表
          level2Count += 1
          processedLines.push(`(${level2Count})${content}`)
          lastIndent = indent
        }
      } else {
        // 不是列表项,重置计数
        if (line.trim() === '') {
          processedLines.push(line)
          // 空行后重置二级计数
          if (lastIndent > 0) {
            level2Count = 0
          }
        } else {
          processedLines.push(line)
        }
      }
    }

    result = processedLines.join('\n')

    // 移除粗体和斜体标记
    result = result.replace(/\*\*(.+?)\*\*/g, '$1')
    result = result.replace(/\*(.+?)\*/g, '$1')
    result = result.replace(/__(.+?)__/g, '$1')
    result = result.replace(/_(.+?)_/g, '$1')

    // 移除行内代码标记
    result = result.replace(/`(.+?)`/g, '$1')

    // 移除链接但保留文本
    result = result.replace(/\[(.+?)\]\(.+?\)/g, '$1')

    // 清理多余空行
    result = result.replace(/\n{3,}/g, '\n\n')

    return result.trim()
  }

  // 实时转换
  const output = convertMarkdown(input)

  const handleCopy = () => {
    if (!output) return

    // 创建临时textarea元素
    const textarea = document.createElement('textarea')
    textarea.value = output
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      // 降级方案：使用现代API
      navigator.clipboard
        .writeText(output)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(() => {
          alert('复制失败，请手动复制')
        })
    } finally {
      document.body.removeChild(textarea)
    }
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Markdown转纯文本</h1>
          </div>
          <p className="text-gray-600">
            自动实时转换为带编号的纯文本格式：1、2、3和（1）、（2）、（3）
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">输入 Markdown</h2>
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                清空
              </button>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="在此粘贴你的Markdown内容..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* 输出区 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">输出纯文本</h2>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  output
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="转换后的内容将显示在这里..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">使用说明</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• 一级列表（无缩进或少量缩进）转换为：1. 2. 3. ...</li>
            <li>• 二级列表（有缩进）转换为：(1) (2) (3) ...</li>
            <li>• 自动移除Markdown标记：标题(#)、粗体(**)、斜体(*)、代码(`)等</li>
            <li>• 保留链接文本，移除URL</li>
            <li>• 空行会重置二级列表计数</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

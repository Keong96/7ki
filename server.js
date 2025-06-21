import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')

// ✅ 测试用
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' })
})

// ✅ 游戏厂商请求用户余额
app.post('/Cash/Get', (req, res) => {
  const { AppID, AppSecret, UserID } = req.body

  // 检查字段
  if (!AppID || !AppSecret || !UserID) {
    return res.status(400).json({
      code: 1,
      error: 'Missing required fields',
      data: null
    })
  }


  // 模拟查用户余额（你可接数据库或缓存）
  const mockBalance = 12000
  const gameBalance = mockBalance / 1000

  return res.json({
    code: 0,
    error: '',
    data: {
      Balance: gameBalance
    }
  })
})

// ✅ 托管前端页面
app.use(express.static(distPath))

// ✅ 前端 history fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`)
})

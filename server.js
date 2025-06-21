import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')

// ✅ 接收厂商回调接口
app.post('/Cash/Get', (req, res) => {
  console.log('🔔 Received callback:', req.body)
  res.json({
    code: 0,
    error: '',
    data: { Balance: 12 }
  })
})

// ✅ 提供 API 测试
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' })
})

// ✅ 前端资源服务
app.use(express.static(distPath))


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`)
})

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')

// ✅ mock 用户余额（以最小单位计，例如：分）
const mockUsers = {
  test: 100 
}

// ✅ 查询余额
app.post('/Cash/Get', (req, res) => {
  const { UserID } = req.body
  console.log('🔔 /Cash/Get:', req.body)

  if (!UserID || !(UserID in mockUsers)) {
    return res.status(400).json({ code: 1, error: 'User not found', data: null })
  }

  const balance = mockUsers[UserID]
  return res.json({
    code: 0,
    error: '',
    data: {
      Balance: balance
    }
  })
})

// ✅ 修改余额
app.post('/Cash/TransferInOut', (req, res) => {
  const { UserID, Amount } = req.body
  console.log('🔔 /Cash/TransferInOut:', req.body)

  if (!UserID || typeof Amount !== 'number') {
    return res.status(400).json({ code: 1, error: 'Missing or invalid required fields' })
  }

  if (!(UserID in mockUsers)) {
    return res.status(400).json({ code: 1, error: 'User not found' })
  }

  // const expectedReal = Amount * 1000
  // if (RealAmount !== expectedReal) {
  //   return res.status(400).json({ code: 1, error: 'RealAmount mismatch' })
  // }

  const delta = Amount
  const currentBalance = mockUsers[UserID]

  if (delta < 0 && currentBalance < Math.abs(delta)) {
    return res.status(400).json({ code: 1, error: 'Insufficient balance' })
  }

  mockUsers[UserID] += delta

  return res.json({
    code: 0,
    error: '',
    data: {
      Balance: mockUsers[UserID]
    }
  })
})

// ✅ 测试 API
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' })
})

// ✅ 静态文件
app.use(express.static(distPath))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`)
})

import axios from 'axios'

export interface GameItem {
  ID: string
  Name: string
  Type: number // 目前只有 0 = slot
  IconUrl: string
  WebIconUrl: string
}

interface GameListResponse {
  code: number
  error: string
  data: {
    List: GameItem[]
  }
}

interface LaunchResponse {
  code: number
  error: string
  data: {
    Url: string
  }
}

interface BalanceResponse {
  code: number
  error: string
  data: {
    Balance: number
  }
}

const instance = axios.create({
  baseURL: 'https://gamecenter.popapi.cc/api/v1/',
  headers: {
    'AppID': 'test213_BRL',
    'AppSecret': '34bed26b-4cbe-4418-8af3-8f0ead90427e',
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

export const fetchGameList = async (): Promise<GameItem[]> => {
  try {
    const res = await instance.post<GameListResponse>('game/list', {})
    if (res.data.code === 0) {
      return res.data.data.List.filter(game => game.Type === 0)
    } else {
      console.error('API error:', res.data.error)
      return []
    }
  } catch (err) {
    console.error('Request failed:', err)
    return []
  }
}

export const launchGame = async (gameId: string, userId: string): Promise<string | null> => {
  try {
    const res = await instance.post<LaunchResponse>('game/launch', {
      GameID: gameId,
      UserID: userId,
    })
    if (res.data.code === 0) {
      return res.data.data.Url
    } else {
      console.error('Launch API error:', res.data.error)
      return null
    }
  } catch (err) {
    console.error('Launch request failed:', err)
    return null
  }
}

export const getUserBalance = async (userId: string): Promise<number | null> => {
  try {
    const res = await instance.post<BalanceResponse>('Cash/Get', {
      UserID: userId
    })
    if (res.data.code === 0) {
      return res.data.data.Balance
    } else {
      console.error('Balance API error:', res.data.error)
      return 0;
    }
  } catch (err) {
    console.error('Balance request failed:', err)
    return null
  }
}
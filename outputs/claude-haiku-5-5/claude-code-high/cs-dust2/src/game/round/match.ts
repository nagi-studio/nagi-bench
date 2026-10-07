import type { BombState, Team } from '../types.ts'

export interface RoundInput {
  aliveT: number
  aliveCT: number
  bombState: BombState
  roundTimeLeft: number
}

export interface RoundResult {
  winner: Team
  reason: string
}

/**
 * 回合胜负判定（纯函数）：
 *  - CT 全灭 → T 胜（无论是否下包）
 *  - 炸弹爆炸 → T 胜；成功拆除 → CT 胜
 *  - T 全灭且未下包 → CT 胜
 *  - 未下包且时间耗尽 → CT 胜
 *  - 已下包时 T 全灭不结束回合，等待拆包或爆炸
 */
export function evaluateRound(input: RoundInput): RoundResult | null {
  const { aliveT, aliveCT, bombState, roundTimeLeft } = input
  if (aliveCT === 0) return { winner: 'T', reason: '全部 CT 阵亡' }
  if (bombState === 'exploded') return { winner: 'T', reason: 'C4 爆炸' }
  if (bombState === 'defused') return { winner: 'CT', reason: 'C4 已拆除' }
  if (bombState !== 'planted') {
    if (aliveT === 0) return { winner: 'CT', reason: '全部 T 阵亡' }
    if (roundTimeLeft <= 0) return { winner: 'CT', reason: '时间耗尽' }
  }
  return null
}

/** 比赛是否结束：先达到 winScore 的一方获胜 */
export function matchWinner(scores: Record<Team, number>, winScore: number): Team | null {
  if (scores.T >= winScore) return 'T'
  if (scores.CT >= winScore) return 'CT'
  return null
}

export type TopPoint = { lat: number; lon: number; value: number }
export type ScoreResponse = { top3: TopPoint[]; heatmap: number[][] }

export async function scoreGrid(p: {
  lat: number; lon: number; date: string; grid_size?: number; step_deg?: number;
}): Promise<ScoreResponse> {
  const res = await fetch('/api/ml/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listDates(): Promise<{ summary: { count: number; min_date: string; max_date: string }, dates: string[] }> {
  const res = await fetch('/api/ml/dates')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}



import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'training-progress'

function readFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function writeToStorage(ids: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.)
  }
}

export function useTrainingProgress() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompletedIds(readFromStorage())
  }, [])

  const markComplete = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      writeToStorage(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setCompletedIds(new Set())
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { completedIds, markComplete, reset }
}

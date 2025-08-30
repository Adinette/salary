import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    counter.increment()
    expect(counter.count).toBe(1)
  })
})

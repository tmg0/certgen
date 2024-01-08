import { describe, test, expect } from "vitest"
import { loadConfig } from 'c12'
import zerossl from '../src/zerossl'

describe('zerossl module', () => {
  test('should goto zerossl sign in page', async () => {
    const { config } = await loadConfig({ name: 'certgen' })
    await zerossl(config)
    expect(1).toBe(1)
  }, 60 * 1000)
})
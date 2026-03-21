import type { ProviderConfig, ProviderDefinition } from '@/server/providers/types'

const DEFAULT_SEARXNG_URL = 'http://localhost:8080'

export const searxngProvider: ProviderDefinition = {
  type: 'searxng',

  async testConnection(config: ProviderConfig) {
    try {
      const baseUrl = config.baseUrl || DEFAULT_SEARXNG_URL
      const url = baseUrl.replace(/\/$/, '')

      const response = await fetch(`${url}/search?q=test&format=json`, {
        method: 'GET',
      })

      if (!response.ok) {
        const text = await response.text()
        return { valid: false, error: `SearxNG API error (${response.status}): ${text.substring(0, 100)}` }
      }

      const data = await response.json()
      // SearxNG json response should have a results array
      if (!data || !Array.isArray(data.results)) {
        return { valid: false, error: 'Invalid SearxNG response format' }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Connection failed' }
    }
  },

  async listModels() {
    // Search providers don't have selectable models
    return []
  },
}

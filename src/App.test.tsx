import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./lib/config', () => ({
  loadConfig: vi.fn(),
  _clearCache: vi.fn(),
}))

import { loadConfig } from './lib/config'
const mockLoadConfig = vi.mocked(loadConfig)

describe('App (compose)', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('shows not-configured message when isConfigured is false and deploymentId is not local', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('This app is not yet configured. Deploy it from Jobgraph to get started.')).toBeInTheDocument()
    })
  })

  it('renders compose form when configured', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Describe the document you'd like to create...")).toBeInTheDocument()
    })
  })

  it('renders compose form when local and not configured', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'local', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Describe the document you'd like to create...")).toBeInTheDocument()
    })
  })
})

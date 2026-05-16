import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./config', () => ({
  loadConfig: vi.fn(),
}))

import { loadConfig } from './config'
const mockLoadConfig = vi.mocked(loadConfig)

describe('App (compose)', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('shows not-configured message when isConfigured is false', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('This app is not configured. Deploy it from Jobgraph to get started.')).toBeInTheDocument()
    })
  })

  it('renders form with disabled button when empty', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('What do you need written?')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Generate' })).toBeDisabled()
  })

  it('shows generated output after successful API call', async () => {
    mockLoadConfig.mockResolvedValue({
      deploymentId: 'test-id', appName: 'Compose', orgName: 'Test', brandColour: '#6366f1',
      logoUrl: null, systemPrompt: '', capabilities: [], isConfigured: true,
    })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output: 'Generated document content here' }),
    }) as any

    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('What do you need written?')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByPlaceholderText('What do you need written?'), { target: { value: 'Write an email' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    await waitFor(() => {
      expect(screen.getByText('Generated document content here')).toBeInTheDocument()
    })
  })
})

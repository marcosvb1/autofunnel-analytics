import { MOCK_MODE, MOCK_USER } from './config'
import { mockProjects, mockFunnelMap, mockMetaAdsAccounts, mockCampaigns, mockSyncResult } from './data'
import { NextResponse } from 'next/server'

export function getMockUser() {
  if (!MOCK_MODE) return null
  return MOCK_USER
}

export function mockGetProjects() {
  if (!MOCK_MODE) return null
  return mockProjects
}

export function mockGetFunnelMap(id: string) {
  if (!MOCK_MODE) return null
  if (id === 'fm-001') return mockFunnelMap
  return null
}

export function mockGetMetaAdsAccounts() {
  if (!MOCK_MODE) return null
  return mockMetaAdsAccounts
}

export function mockSyncMetaAds() {
  if (!MOCK_MODE) return null
  return mockSyncResult
}



export function withMockAuth<T>(
  handler: (userId: string) => T,
  mockHandler: () => T
): T | Promise<T> {
  if (MOCK_MODE) {
    return mockHandler()
  }
  return handler(MOCK_USER.id)
}

export function mockResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}
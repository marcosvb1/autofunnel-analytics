'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { MetaAdAccount } from '@/types/meta-ads'

interface AdAccountSelectorProps {
  projectId: string
  onSelect: (accountId: string) => Promise<void>
}

export default function AdAccountSelector({ projectId, onSelect }: AdAccountSelectorProps) {
  const [accounts, setAccounts] = useState<MetaAdAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/integrations/meta-ads/accounts', {
          headers: { 'x-project-id': projectId },
        })
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch accounts')
        }
        
        setAccounts(data.accounts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAccounts()
  }, [projectId])

  const handleSelect = async () => {
    if (!selectedAccount) return
    setIsSaving(true)
    setError(null)
    
    try {
      await onSelect(selectedAccount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select account')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-gray-500">Loading ad accounts...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (accounts.length === 0) {
    return <div className="text-gray-500">No ad accounts found.</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Ad Account</h3>
      
      <div className="space-y-2">
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setSelectedAccount(account.id)}
            className={`p-4 border rounded cursor-pointer ${
              selectedAccount === account.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-gray-600">
              {account.business_name} | Spent: ${parseFloat(account.amount_spent) / 100}
            </p>
          </div>
        ))}
      </div>

      <Button 
        onClick={handleSelect} 
        disabled={!selectedAccount || isSaving}
      >
        {isSaving ? 'Saving...' : 'Select Account'}
      </Button>
    </div>
  )
}
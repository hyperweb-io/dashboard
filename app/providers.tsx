'use client'

import { KubernetesProvider } from '../k8s/context'
import { NamespaceProvider } from '@/contexts/NamespaceContext'
import { AppProvider } from '@/contexts/AppContext'
import { PlaygroundProvider } from '@/contexts/PlaygroundContext'
import { ConfirmProvider } from '@/hooks/useConfirm'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <PlaygroundProvider>
        <KubernetesProvider initialConfig={{
          restEndpoint: '/api/k8s'
        }}>
          <NamespaceProvider>
            <ConfirmProvider>
              {children}
            </ConfirmProvider>
          </NamespaceProvider>
        </KubernetesProvider>
      </PlaygroundProvider>
    </AppProvider>
  )
}
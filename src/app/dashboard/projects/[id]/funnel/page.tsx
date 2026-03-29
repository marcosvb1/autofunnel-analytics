import FunnelPageClient from './FunnelPageClient'

interface FunnelPageProps {
  params: Promise<{ id: string }>
}

export default async function FunnelPage({ params }: FunnelPageProps) {
  const { id: projectId } = await params
  
  return <FunnelPageClient projectId={projectId} />
}

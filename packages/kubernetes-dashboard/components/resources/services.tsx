'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Globe,
  Shield,
  Server,
  AlertCircle
} from 'lucide-react'
import { KubernetesClient, type Service as K8sService, type ServiceList } from 'kubernetesjs'

// Create APIClient instance
const k8sClient = new KubernetesClient({ restEndpoint: '/api/k8s' })

interface Service {
  name: string
  namespace: string
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
  clusterIP: string
  ports: { name?: string; port: number; targetPort: number | string; protocol: string; nodePort?: number }[]
  selector: Record<string, string>
  createdAt: string
  externalIPs?: string[]
  loadBalancerIP?: string
  k8sData?: K8sService
}

export function ServicesView() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await k8sClient.listCoreV1NamespacedService({
        path: { namespace: 'default' },
        query: {},
      })
      const formattedServices: Service[] = data.items.map(item => {
        const loadBalancerIngress = item.status?.loadBalancer?.ingress?.[0]
        return {
          name: item.metadata!.name!,
          namespace: item.metadata!.namespace!,
          type: item.spec!.type as Service['type'],
          clusterIP: item.spec!.clusterIP || 'None',
          ports: (item.spec!.ports || []).map(p => ({
            name: p.name,
            port: p.port,
            targetPort: p.targetPort ?? p.port,
            protocol: p.protocol || 'TCP',
            nodePort: p.nodePort,
          })),
          selector: (item.spec!.selector ?? {}) as Record<string, string>,
          createdAt: item.metadata!.creationTimestamp!,
          externalIPs: item.spec!.externalIPs,
          loadBalancerIP: loadBalancerIngress?.ip || loadBalancerIngress?.hostname,
          k8sData: item,
        }
      })
      setServices(formattedServices)
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleRefresh = () => {
    fetchServices()
  }

  const handleDelete = async (service: Service) => {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      try {
        await k8sClient.deleteCoreV1NamespacedService({
          path: { namespace: service.namespace, name: service.name },
          query: {},
        })
        setServices(services.filter(s => s.name !== service.name))
      } catch (err) {
        console.error('Failed to delete service:', err)
        alert(`Failed to delete service: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'LoadBalancer':
        return <Badge variant="success" className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {type}
        </Badge>
      case 'NodePort':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Server className="w-3 h-3" />
          {type}
        </Badge>
      case 'ClusterIP':
        return <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {type}
        </Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const formatPorts = (ports: Service['ports']) => {
    return ports.map(p => {
      let portStr = `${p.port}`
      if (p.targetPort !== p.port) {
        portStr += `:${p.targetPort}`
      }
      if (p.nodePort) {
        portStr += `:${p.nodePort}`
      }
      return `${portStr}/${p.protocol}`
    }).join(', ')
  }

  const formatSelector = (selector: Record<string, string>) => {
    return Object.entries(selector).map(([k, v]) => `${k}=${v}`).join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes services and networking
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              LoadBalancer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.type === 'LoadBalancer').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NodePort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.type === 'NodePort').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ClusterIP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.type === 'ClusterIP').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            A list of all services in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No services found in the default namespace</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Cluster IP</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>Selector</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.name}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.namespace}</TableCell>
                    <TableCell>{getTypeBadge(service.type)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {service.clusterIP}
                      {service.loadBalancerIP && (
                        <div className="text-xs text-muted-foreground mt-1">
                          LB: {service.loadBalancerIP}
                        </div>
                      )}
                      {service.externalIPs && service.externalIPs.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Ext: {service.externalIPs.join(', ')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{formatPorts(service.ports)}</TableCell>
                    <TableCell className="text-sm">{formatSelector(service.selector)}</TableCell>
                    <TableCell>
                      {new Date(service.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => console.log('Edit', service.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(service)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
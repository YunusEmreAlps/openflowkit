import type { Node } from '@/lib/reactflowCompat';
import type { NodeData } from '@/lib/types';

export type DomainLibraryCategory = 'aws' | 'azure' | 'gcp' | 'cncf' | 'network' | 'security' | 'icons';

export interface DomainLibraryItem {
    id: string;
    category: DomainLibraryCategory;
    label: string;
    description: string;
    icon: string;
    color: string;
    shape?: NodeData['shape'];
    nodeType?: 'process' | 'architecture' | 'custom';
    previewUrl?: string;
    providerShapeCategory?: string;
    archIconPackId?: string;
    archIconShapeId?: string;
    assetPresentation?: 'icon';
}

export const DOMAIN_LIBRARY_ITEMS: DomainLibraryItem[] = [
    { id: 'azure-vm', category: 'azure', label: 'Azure VM', description: 'Virtual machine compute', icon: 'Server', color: 'blue' },
    { id: 'azure-functions', category: 'azure', label: 'Azure Functions', description: 'Serverless function runtime', icon: 'FunctionSquare', color: 'blue' },
    { id: 'azure-storage', category: 'azure', label: 'Storage Account', description: 'Blob and file storage', icon: 'Database', color: 'blue', shape: 'cylinder' },
    { id: 'azure-sql', category: 'azure', label: 'Azure SQL', description: 'Managed SQL database', icon: 'Database', color: 'blue', shape: 'cylinder' },
    { id: 'azure-apim', category: 'azure', label: 'API Management', description: 'Managed API gateway', icon: 'Waypoints', color: 'blue' },
    { id: 'azure-frontdoor', category: 'azure', label: 'Front Door', description: 'Global traffic entrypoint', icon: 'Globe', color: 'blue' },

    { id: 'gcp-compute', category: 'gcp', label: 'Compute Engine', description: 'Virtual machine compute', icon: 'Server', color: 'emerald' },
    { id: 'gcp-functions', category: 'gcp', label: 'Cloud Functions', description: 'Serverless function runtime', icon: 'FunctionSquare', color: 'emerald' },
    { id: 'gcp-storage', category: 'gcp', label: 'Cloud Storage', description: 'Object storage buckets', icon: 'Database', color: 'emerald', shape: 'cylinder' },
    { id: 'gcp-sql', category: 'gcp', label: 'Cloud SQL', description: 'Managed SQL database', icon: 'Database', color: 'emerald', shape: 'cylinder' },
    { id: 'gcp-lb', category: 'gcp', label: 'Cloud Load Balancer', description: 'Global traffic balancing', icon: 'Network', color: 'emerald' },
    { id: 'gcp-run', category: 'gcp', label: 'Cloud Run', description: 'Serverless container runtime', icon: 'Container', color: 'emerald' },

    { id: 'k8s-cluster', category: 'cncf', label: 'Cluster', description: 'Kubernetes control plane', icon: 'ShipWheel', color: 'cyan' },
    { id: 'k8s-node', category: 'cncf', label: 'Node Pool', description: 'Worker node group', icon: 'ServerCog', color: 'cyan' },
    { id: 'k8s-pod', category: 'cncf', label: 'Pod', description: 'Deployable workload unit', icon: 'Box', color: 'cyan' },
    { id: 'k8s-service', category: 'cncf', label: 'Service', description: 'Stable internal endpoint', icon: 'Network', color: 'cyan' },
    { id: 'k8s-ingress', category: 'cncf', label: 'Ingress', description: 'HTTP edge routing', icon: 'Route', color: 'cyan' },
    { id: 'k8s-configmap', category: 'cncf', label: 'ConfigMap', description: 'Runtime configuration', icon: 'SlidersHorizontal', color: 'cyan' },

    { id: 'net-lb', category: 'network', label: 'Load Balancer', description: 'Traffic distribution', icon: 'Network', color: 'violet' },
    { id: 'net-router', category: 'network', label: 'Router', description: 'Layer 3 routing', icon: 'Route', color: 'violet' },
    { id: 'net-switch', category: 'network', label: 'Switch', description: 'Layer 2 switching', icon: 'GitFork', color: 'violet' },
    { id: 'net-vpn', category: 'network', label: 'VPN Gateway', description: 'Private tunnel gateway', icon: 'Cable', color: 'violet' },
    { id: 'net-cdn', category: 'network', label: 'CDN Edge', description: 'Content delivery edge', icon: 'Globe', color: 'violet' },
    { id: 'net-dns', category: 'network', label: 'DNS Service', description: 'Domain name resolution', icon: 'Network', color: 'violet' },

    { id: 'sec-firewall', category: 'security', label: 'Firewall', description: 'Ingress/egress filtering', icon: 'Shield', color: 'red' },
    { id: 'sec-waf', category: 'security', label: 'WAF', description: 'Web application firewall', icon: 'ShieldCheck', color: 'red' },
    { id: 'sec-iam', category: 'security', label: 'IAM Service', description: 'Identity and access control', icon: 'Users', color: 'red' },
    { id: 'sec-kms', category: 'security', label: 'KMS', description: 'Encryption key management', icon: 'KeyRound', color: 'red' },
    { id: 'sec-secrets', category: 'security', label: 'Secrets Manager', description: 'Secret storage and rotation', icon: 'LockKeyhole', color: 'red' },
    { id: 'sec-siem', category: 'security', label: 'SIEM', description: 'Security event analytics', icon: 'Radar', color: 'red' },
];

export function createDomainLibraryNode(
    item: DomainLibraryItem,
    id: string,
    position: { x: number; y: number },
    layerId: string
): Node<NodeData> {
    if (item.assetPresentation === 'icon' && (item.previewUrl || item.icon)) {
        return {
            id,
            type: 'custom',
            position,
            data: {
                label: item.label,
                subLabel: '',
                color: 'custom',
                customColor: '#ffffff',
                ...(item.previewUrl ? { customIconUrl: item.previewUrl } : {}),
                ...(item.icon ? { icon: item.icon } : {}),
                assetPresentation: 'icon',
                assetProvider: item.category,
                assetCategory: item.providerShapeCategory,
                archIconPackId: item.archIconPackId,
                archIconShapeId: item.archIconShapeId,
                layerId,
            },
            style: { width: 96 },
        };
    }

    if (item.nodeType === 'architecture' && item.archIconPackId && item.archIconShapeId) {
        return {
            id,
            type: 'architecture',
            position,
            data: {
                label: item.label,
                subLabel: item.providerShapeCategory || item.description,
                color: item.color,
                shape: item.shape || 'rectangle',
                icon: item.icon,
                archProvider: item.category,
                archResourceType: 'service',
                archEnvironment: 'default',
                archIconPackId: item.archIconPackId,
                archIconShapeId: item.archIconShapeId,
                layerId,
            },
        };
    }

    return {
        id,
        type: 'process',
        position,
        data: {
            label: item.label,
            subLabel: item.description,
            icon: item.icon,
            color: item.color,
            shape: item.shape,
            layerId,
        },
    };
}

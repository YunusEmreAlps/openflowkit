import { describe, expect, it } from 'vitest';
import {
    createDomainLibraryNode,
    DOMAIN_LIBRARY_ITEMS,
} from './domainLibrary';

describe('domainLibrary', () => {
    it('contains all required categories', () => {
        const categories = new Set(DOMAIN_LIBRARY_ITEMS.map((item) => item.category));
        expect(categories.has('aws')).toBe(true);
        expect(categories.has('azure')).toBe(true);
        expect(categories.has('gcp')).toBe(true);
        expect(categories.has('kubernetes')).toBe(true);
        expect(categories.has('network')).toBe(true);
        expect(categories.has('security')).toBe(true);
    });

    it('creates process nodes from library items', () => {
        const item = DOMAIN_LIBRARY_ITEMS.find((entry) => entry.id === 'sec-firewall');
        expect(item).toBeDefined();
        const node = createDomainLibraryNode(
            item!,
            'lib-1',
            { x: 120, y: 200 },
            'default'
        );
        expect(node.type).toBe('process');
        expect(node.data.label).toBe('Firewall');
        expect(node.data.color).toBe('red');
        expect(node.data.layerId).toBe('default');
    });
});

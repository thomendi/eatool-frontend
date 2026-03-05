import type { Node, Edge } from '@xyflow/react';

const unescapeXml = (safe: string): string => {
    return safe.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&apos;/g, '\'')
        .replace(/&quot;/g, '"');
};

const parseXmlAttributes = (xmlString: string, attributes: string[]) => {
    const result: Record<string, string> = {};
    attributes.forEach(attr => {
        const regex = new RegExp(`${attr}="([^"]*)"`);
        const match = xmlString.match(regex);
        if (match) {
            result[attr] = unescapeXml(match[1]);
        }
    });
    return result;
};

const extractTagContent = (xmlString: string, tagName: string): string | null => {
    const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 's');
    const match = xmlString.match(regex);
    return match ? unescapeXml(match[1]) : null;
};

export const importFromXML = (xmlContent: string): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Simple parser for the specific format we export
    // Find all <node> blocks
    const nodeRegex = /<node\s+([^>]*)>(.*?)<\/node>/gs;
    let nodeMatch;

    while ((nodeMatch = nodeRegex.exec(xmlContent)) !== null) {
        const attributesStr = nodeMatch[1];
        const contentStr = nodeMatch[2];

        const attrs = parseXmlAttributes(attributesStr, ['id', 'type', 'parentId', 'positionX', 'positionY']);

        const label = extractTagContent(contentStr, 'label') || '';
        const description = extractTagContent(contentStr, 'description') || '';
        const mission = extractTagContent(contentStr, 'mission') || '';
        const objective = extractTagContent(contentStr, 'objective') || '';
        const styleStr = extractTagContent(contentStr, 'style');

        // Parse style if present
        let style = {};
        try {
            if (styleStr) {
                style = JSON.parse(styleStr);
            }
        } catch (e) {
            console.warn('Failed to parse node style', e);
        }

        const node: Node = {
            id: attrs.id,
            type: attrs.type,
            position: {
                x: parseFloat(attrs.positionX || '0'),
                y: parseFloat(attrs.positionY || '0')
            },
            data: {
                label,
                description,
                mission,
                objective
            },
            style
        };

        if (attrs.parentId) {
            node.parentId = attrs.parentId;
            node.extent = 'parent';
        }

        // Restore class for macroprocess
        if (node.type === 'macroprocess') {
            node.className = 'light';
        }

        nodes.push(node);
    }

    // Find all <edge> blocks
    const edgeRegex = /<edge\s+([^>]*)\s*\/>/g;
    let edgeMatch;

    while ((edgeMatch = edgeRegex.exec(xmlContent)) !== null) {
        const attributesStr = edgeMatch[1];
        const attrs = parseXmlAttributes(attributesStr, ['id', 'source', 'target']);

        if (attrs.id && attrs.source && attrs.target) {
            edges.push({
                id: attrs.id,
                source: attrs.source,
                target: attrs.target
            });
        }
    }

    return { nodes, edges };
};


const escapeXml = (unsafe: string | unknown): string => {
    if (typeof unsafe !== 'string') return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

export const exportToXML = (nodes: Node[], edges: Edge[]): string => {
    const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';

    const nodesXml = nodes.map(node => {
        const attributes = [
            `id="${escapeXml(node.id)}"`,
            `type="${escapeXml(node.type || '')}"`,
            `parentId="${escapeXml(node.parentId || '')}"`,
            `positionX="${node.position.x}"`,
            `positionY="${node.position.y}"`
        ].join(' ');

        const data = node.data as Record<string, unknown>;
        const style = JSON.stringify(node.style || {});

        return `                <node ${attributes}>
                    <data>
                        <label>${escapeXml(data.label)}</label>
                        <description>${escapeXml(data.description || '')}</description>
                        <mission>${escapeXml(data.mission || '')}</mission>
                        <objective>${escapeXml(data.objective || '')}</objective>
                    </data>
                    <style>${escapeXml(style)}</style>
                </node>`;
    }).join('\n');

    const edgesXml = edges.map(edge => {
        const attributes = [
            `id="${escapeXml(edge.id)}"`,
            `source="${escapeXml(edge.source)}"`,
            `target="${escapeXml(edge.target)}"`
        ].join(' ');

        return `                <edge ${attributes} />`;
    }).join('\n');

    return `${xmlHeader}
<valueChain>
    <nodes>
${nodesXml}
    </nodes>
    <edges>
${edgesXml}
    </edges>
</valueChain>`;
};

export const downloadXML = (xmlContent: string, filename: string = 'value-chain.xml') => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

import type { Node, Edge } from '@xyflow/react';

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

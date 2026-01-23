import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertiesPanel } from './PropertiesPanel';
import { Node } from '@xyflow/react';

describe('PropertiesPanel', () => {
    const mockNode: Node = {
        id: '1',
        type: 'process',
        position: { x: 0, y: 0 },
        data: {
            label: 'Test Node',
            description: 'Test Description',
            mission: 'Test Mission',
            objective: 'Test Objective',
        },
    };

    const mockOnUpdateNode = vi.fn();
    const mockOnClose = vi.fn();

    it('should render correctly when a node is selected', () => {
        render(
            <PropertiesPanel
                selectedNode={mockNode}
                onUpdateNode={mockOnUpdateNode}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Propiedades')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });

    it('should not render when no node is selected', () => {
        const { container } = render(
            <PropertiesPanel
                selectedNode={null}
                onUpdateNode={mockOnUpdateNode}
                onClose={mockOnClose}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should call onUpdateNode when converting input changes', () => {
        render(
            <PropertiesPanel
                selectedNode={mockNode}
                onUpdateNode={mockOnUpdateNode}
                onClose={mockOnClose}
            />
        );

        const labelInput = screen.getByDisplayValue('Test Node');
        fireEvent.change(labelInput, { target: { value: 'New Label' } });

        expect(mockOnUpdateNode).toHaveBeenCalledWith('1', expect.objectContaining({ label: 'New Label' }));
    });

    it('should call onClose when close button is clicked', () => {
        render(
            <PropertiesPanel
                selectedNode={mockNode}
                onUpdateNode={mockOnUpdateNode}
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});

import { NewRelic } from './NewRelic.node';

describe('NewRelic Node', () => {
    let node: NewRelic;

    beforeEach(() => {
        node = new NewRelic();
    });

    it('should have the correct node name and display name', () => {
        expect(node.description.name).toBe('newRelic');
        expect(node.description.displayName).toBe('New Relic');
    });

    it('should require the newRelicApi credential', () => {
        const hasCreds = node.description.credentials?.some(
            cred => cred.name === 'newRelicApi' && cred.required
        );
        expect(hasCreds).toBe(true);
    });

    it('should have defined inputs and outputs', () => {
        expect(node.description.inputs).toEqual(['main']);
        expect(node.description.outputs).toEqual(['main']);
    });

    it('should support Workflow Automation resource', () => {
        const resourceProperty = node.description.properties.find(p => p.name === 'resource');
        expect(resourceProperty).toBeDefined();
        
        const workflowOption = resourceProperty!.options?.find((opt: any) => opt.value === 'workflowAutomation');
        expect(workflowOption).toBeDefined();
    });
});

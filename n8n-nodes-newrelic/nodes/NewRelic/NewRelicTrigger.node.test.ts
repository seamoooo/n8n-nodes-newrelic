import { NewRelicTrigger } from './NewRelicTrigger.node';

describe('NewRelicTrigger Node', () => {
    let node: NewRelicTrigger;

    beforeEach(() => {
        node = new NewRelicTrigger();
    });

    it('should have the correct node name and display name', () => {
        expect(node.description.name).toBe('newRelicTrigger');
        expect(node.description.displayName).toBe('New Relic Trigger');
    });

    it('should require the newRelicSecretApi credential', () => {
        const hasCreds = node.description.credentials?.some(
            cred => cred.name === 'newRelicSecretApi' && cred.required
        );
        expect(hasCreds).toBe(true);
    });

    it('should define a default webhook', () => {
        expect(node.description.webhooks?.length).toBeGreaterThan(0);
        expect(node.description.webhooks?.[0].httpMethod).toBe('POST');
    });
});

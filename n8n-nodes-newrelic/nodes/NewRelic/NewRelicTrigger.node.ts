import {
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
} from 'n8n-workflow';

export class NewRelicTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'New Relic Trigger',
        name: 'newRelicTrigger',
        icon: 'file:newrelic.svg',
        group: ['trigger'],
        version: 1,
        description: 'Handle New Relic webhook events',
        defaults: {
            name: 'New Relic Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Secret Token',
                name: 'secretToken',
                type: 'string',
                default: '',
                placeholder: 'my-secret-token',
                description: 'The secret token (X-Secret-Token) to verify the request source',
            },
        ],
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject();
        const secretToken = this.getNodeParameter('secretToken') as string;

        // Signature Verification
        if (secretToken) {
            const headerToken = req.headers['x-secret-token'] || req.headers['X-Secret-Token'];
            if (headerToken !== secretToken) {
                return {
                    webhookResponse: 'Invalid signature',
                    workflowData: [this.helpers.returnJsonArray({ error: 'Invalid signature' })],
                };
            }
        }

        const body = req.body;

        return {
            webhookResponse: 'OK',
            workflowData: [this.helpers.returnJsonArray(body)],
        };
    }
}

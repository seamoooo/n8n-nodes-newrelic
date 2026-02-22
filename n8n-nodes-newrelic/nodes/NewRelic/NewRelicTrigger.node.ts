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
        icon: {
            light: 'file:../../icons/newrelic.svg',
            dark: 'file:../../icons/newrelic.dark.svg'
        },
        group: ['trigger'],
        version: 1,
        description: 'Handle New Relic webhook events',
        defaults: {
            name: 'New Relic Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'newRelicSecretApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [],
        usableAsTool: true,
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject();
        const credentials = await this.getCredentials('newRelicSecretApi');
        const secretToken = credentials.secretToken as string;

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

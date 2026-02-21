import {
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class NewRelicSecretApi implements ICredentialType {
    name = 'newRelicSecretApi';
    displayName = 'New Relic Secret API';

    icon = {
        light: 'file:../icons/newrelic.svg',
        dark: 'file:../icons/newrelic.dark.svg'
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.newrelic.com',
            url: '/',
        },
    };
    documentationUrl = 'https://docs.newrelic.com/';
    properties: INodeProperties[] = [
        {
            displayName: 'Secret Token',
            name: 'secretToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'The secret token (X-Secret-Token) to verify the request source',
        },
    ];
}

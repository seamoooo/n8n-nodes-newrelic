import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class NewRelicApi implements ICredentialType {
    name = 'newRelicApi';
    displayName = 'New Relic API';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon = 'file:newrelic.svg' as any;
    documentationUrl = 'https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/#user-api-key';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'The User API Key for New Relic (starts with NRAK-)',
        },
        {
            displayName: 'Region',
            name: 'region',
            type: 'options',
            options: [
                {
                    name: 'US',
                    value: 'us',
                },
                {
                    name: 'EU',
                    value: 'eu',
                },
            ],
            default: 'us',
            description: 'The New Relic region (US or EU)',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'API-Key': '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.region === "eu" ? "https://api.eu.newrelic.com" : "https://api.newrelic.com"}}',
            url: '/graphql',
            method: 'POST',
            body: {
                query: '{ actor { user { name } } }',
            },
        },
    };
}

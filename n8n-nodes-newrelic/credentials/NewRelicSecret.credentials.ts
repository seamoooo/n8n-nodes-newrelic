import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class NewRelicSecret implements ICredentialType {
    name = 'newRelicSecret';
    displayName = 'New Relic Secret';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon = {
        light: 'file:../icons/newrelic.svg',
        dark: 'file:../icons/newrelic.dark.svg'
    } as any;
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

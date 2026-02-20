import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class NewRelic implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'New Relic',
        name: 'newRelic',
        icon: {
            light: 'file:../../icons/newrelic.svg',
            dark: 'file:../../icons/newrelic.dark.svg'
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Execute NRQL queries via NerdGraph',
        defaults: {
            name: 'New Relic',
        },
        inputs: ['main'],
        outputs: ['main'],
        usableAsTool: true,
        credentials: [
            {
                name: 'newRelicApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'NRQL',
                        value: 'nrql',
                    },
                ],
                default: 'nrql',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['nrql'],
                    },
                },
                options: [
                    {
                        name: 'Query',
                        value: 'query',
                        description: 'Execute a NRQL query',
                        action: 'Execute a nrql query',
                    },
                ],
                default: 'query',
            },
            {
                displayName: 'Account ID',
                name: 'accountId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['nrql'],
                        operation: ['query'],
                    },
                },
                description: 'The New Relic Account ID to query against',
            },
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                default: 'SELECT count(*) FROM Transaction',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['nrql'],
                        operation: ['query'],
                    },
                },
                description: 'The NRQL query to execute',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;
        const credentials = await this.getCredentials('newRelicApi');

        let endpoint = 'https://api.newrelic.com/graphql';
        if (credentials.region === 'eu') {
            endpoint = 'https://api.eu.newrelic.com/graphql';
        }

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'nrql' && operation === 'query') {
                    const query = this.getNodeParameter('query', i) as string;
                    const accountId = this.getNodeParameter('accountId', i) as string;

                    const graphqlQuery = {
                        query: `
							{
								actor {
									account(id: ${accountId}) {
										nrql(query: "${query.replace(/"/g, '\\"')}", timeout: 5) {
											results
										}
									}
								}
							}
						`,
                    };

                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: endpoint,
                        body: graphqlQuery,
                        json: true,
                        headers: {
                            'API-Key': credentials.apiKey as string,
                        },
                    });

                    const nrqlResults = response?.data?.actor?.account?.nrql?.results;

                    if (Array.isArray(nrqlResults)) {
                        nrqlResults.forEach((result) => {
                            returnData.push({
                                json: result,
                            });
                        });
                    } else {
                        returnData.push({
                            json: response,
                        });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: (error as Error).message,
                        },
                    });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error as Error, {
                    itemIndex: i,
                });
            }
        }

        return [returnData];
    }
}

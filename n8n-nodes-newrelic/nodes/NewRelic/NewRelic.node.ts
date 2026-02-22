import {
    IDataObject,
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
                        name: 'Account',
                        value: 'account',
                    },
                    {
                        name: 'Entity',
                        value: 'entity',
                    },
                    {
                        name: 'NRQL',
                        value: 'nrql',
                    },
                    {
                        name: 'User Management',
                        value: 'userManagement',
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
                        resource: ['account'],
                    },
                },
                options: [
                    {
                        name: 'Get Account Structure',
                        value: 'structure',
                        description: 'Retrieve the parent-child account hierarchy',
                        action: 'Get account structure',
                    },
                    {
                        name: 'Get Consumption',
                        value: 'consumption',
                        description: 'Retrieve usage data (e.g., GB consumed)',
                        action: 'Get consumption',
                    },
                ],
                default: 'consumption',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['entity'],
                    },
                },
                options: [
                    {
                        name: 'Get Relationships',
                        value: 'relationships',
                        description: 'Retrieve related entities (dependencies)',
                        action: 'Get relationships for an entity',
                    },
                    {
                        name: 'Get Tags',
                        value: 'tags',
                        description: 'Retrieve tags assigned to an entity',
                        action: 'Get tags for an entity',
                    },
                    {
                        name: 'Search Catalog',
                        value: 'search',
                        description: 'Search the entity catalog',
                        action: 'Search the entity catalog',
                    },
                ],
                default: 'search',
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
                        name: 'Execute',
                        value: 'query',
                        description: 'Execute NRQL',
                        action: 'Execute NRQL',
                    },
                ],
                default: 'query',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['userManagement'],
                    },
                },
                options: [
                    {
                        name: 'Create User',
                        value: 'createUser',
                        description: 'Create a new user in a specific authentication domain. NOTE: Do not use this if the domain relies on SCIM (automated provisioning from an IdP).',
                        action: 'Create a user',
                    },
                    {
                        name: 'Get Authentication Domains',
                        value: 'getAuthDomains',
                        description: 'Retrieve the IDs of authentication domains in the organization',
                        action: 'Get authentication domains',
                    },
                ],
                default: 'getAuthDomains',
            },
            {
                displayName: 'Authentication Domain ID',
                name: 'authDomainId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['userManagement'],
                        operation: ['createUser'],
                    },
                },
                description: 'The ID of the Authentication Domain where the user will be created. You can retrieve this list via the \'Get Authentication Domains\' operation.',
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'new.user@example.com',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['userManagement'],
                        operation: ['createUser'],
                    },
                },
                description: 'The email address of the new user',
            },
            {
                displayName: 'User Type',
                name: 'userType',
                type: 'options',
                options: [
                    {
                        name: 'Basic User Tier',
                        value: 'BASIC_USER_TIER',
                    },
                    {
                        name: 'Core User Tier',
                        value: 'CORE_USER_TIER',
                    },
                    {
                        name: 'Full Platform User Tier',
                        value: 'FULL_USER_TIER',
                    },
                ],
                default: 'BASIC_USER_TIER',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['userManagement'],
                        operation: ['createUser'],
                    },
                },
                description: 'The type/license tier for the new user',
            },
            {
                displayName: 'Note: If the target Authentication Domain uses SCIM for automated provisioning (e.g. via Okta/Azure AD), you should NOT create users via this API. Please manage users directly in your Identity Provider.',
                name: 'scimNotice',
                type: 'notice',
                displayOptions: {
                    show: {
                        resource: ['userManagement'],
                        operation: ['createUser'],
                    },
                },
                default: '',
                description: 'More info: https://docs.newrelic.com/docs/accounts/accounts/automated-user-management/scim-support-automated-user-management/',
            },
            {
                displayName: 'Account ID',
                name: 'accountId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['nrql', 'account'],
                    },
                    hide: {
                        operation: ['structure']
                    }
                },
                description: 'The New Relic Account ID to query against',
            },
            {
                displayName: 'NRQL',
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
                description: 'The NRQL to execute. <a href="https://docs.newrelic.com/jp/docs/nrql/nrql-syntax-clauses-functions/" target="_blank">NRQL Syntax</a>.',
            },
            {
                displayName: 'Search Query',
                name: 'searchQuery',
                type: 'string',
                default: "domain IN ('APM')",
                required: true,
                displayOptions: {
                    show: {
                        resource: ['entity'],
                        operation: ['search'],
                    },
                },
                description: 'The entity search query string (e.g. domain IN (\'APM\') or name LIKE \'my-app\')',
            },
            {
                displayName: 'Entity GUID',
                name: 'entityGuid',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['entity'],
                        operation: ['relationships', 'tags'],
                    },
                },
                description: 'The GUID of the New Relic entity. <a href="https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-entities-api-tutorial/" target="_blank">How to find this</a>.',
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
                let graphqlQuery: IDataObject = {};

                if (resource === 'nrql' && operation === 'query') {
                    const query = this.getNodeParameter('query', i) as string;
                    const accountId = this.getNodeParameter('accountId', i) as string;

                    graphqlQuery = {
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
                } else if (resource === 'account') {
                    if (operation === 'consumption') {
                        const accountId = this.getNodeParameter('accountId', i) as string;
                        const nrql = "SELECT sum(GigabytesIngested) FROM NrConsumption FACET usageMetric SINCE 1 month ago LIMIT MAX";
                        graphqlQuery = {
                            query: `{ actor { account(id: ${accountId}) { nrql(query: "${nrql}") { results } } } }`
                        };
                    } else if (operation === 'structure') {
                        graphqlQuery = {
                            query: `{ actor { organization { accountManagement { managedAccounts { id name regionCode } } } } }`
                        };
                    }
                } else if (resource === 'entity') {
                    if (operation === 'search') {
                        const searchQuery = this.getNodeParameter('searchQuery', i) as string;
                        graphqlQuery = {
                            query: `{ actor { entitySearch(query: "${searchQuery.replace(/"/g, '\\"')}") { results { entities { name type guid domain } } } } }`
                        };
                    } else {
                        const entityGuid = this.getNodeParameter('entityGuid', i) as string;
                        if (operation === 'tags') {
                            graphqlQuery = {
                                query: `{ actor { entity(guid: "${entityGuid.replace(/"/g, '\\"')}") { name tags { key values } } } }`
                            };
                        } else if (operation === 'relationships') {
                            graphqlQuery = {
                                query: `{ actor { entity(guid: "${entityGuid.replace(/"/g, '\\"')}") { name relatedEntities { results { source { entity { name type guid } } target { entity { name type guid } } } } } } }`
                            };
                        }
                    }
                } else if (resource === 'userManagement') {
                    if (operation === 'getAuthDomains') {
                        graphqlQuery = {
                            query: `{ actor { organization { userManagement { authenticationDomains { authenticationDomains { id name } } } } } }`
                        };
                    } else if (operation === 'createUser') {
                        const authDomainId = this.getNodeParameter('authDomainId', i) as string;
                        const email = this.getNodeParameter('email', i) as string;
                        const userType = this.getNodeParameter('userType', i) as string;
                        graphqlQuery = {
                            query: `mutation { userManagementCreateUser(createUserOptions: { authenticationDomainId: "${authDomainId.replace(/"/g, '\\"')}", email: "${email.replace(/"/g, '\\"')}", userType: ${userType} }) { createdUser { id email } } }`
                        };
                    }
                }

                if (Object.keys(graphqlQuery).length > 0) {
                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: endpoint,
                        body: graphqlQuery,
                        json: true,
                        headers: {
                            'API-Key': credentials.apiKey as string,
                        },
                    });

                    // Parse responses to output lists of objects when possible
                    if (resource === 'nrql' && operation === 'query') {
                        const nrqlResults = response?.data?.actor?.account?.nrql?.results;
                        if (Array.isArray(nrqlResults)) {
                            nrqlResults.forEach((result) => {
                                returnData.push({ json: result });
                            });
                        } else {
                            returnData.push({ json: response });
                        }
                    } else if (resource === 'account') {
                        if (operation === 'consumption') {
                            const results = response?.data?.actor?.account?.nrql?.results;
                            if (Array.isArray(results)) {
                                results.forEach((r: IDataObject) => returnData.push({ json: r }));
                            } else {
                                returnData.push({ json: response });
                            }
                        } else {
                            returnData.push({ json: response?.data?.actor?.organization?.accountHierarchy || response });
                        }
                    } else if (resource === 'entity') {
                        if (operation === 'search') {
                            const entities = response?.data?.actor?.entitySearch?.results?.entities;
                            if (Array.isArray(entities)) {
                                entities.forEach((entity: IDataObject) => returnData.push({ json: entity }));
                            } else {
                                returnData.push({ json: response });
                            }
                        } else {
                            returnData.push({ json: response?.data?.actor?.entity || response });
                        }
                    } else if (resource === 'userManagement') {
                        if (operation === 'getAuthDomains') {
                            const domains = response?.data?.actor?.organization?.userManagement?.authenticationDomains?.authenticationDomains;
                            if (Array.isArray(domains)) {
                                domains.forEach((d: IDataObject) => returnData.push({ json: d }));
                            } else {
                                returnData.push({ json: response });
                            }
                        } else if (operation === 'createUser') {
                            returnData.push({ json: response?.data?.userManagementCreateUser?.createdUser || response });
                        }
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

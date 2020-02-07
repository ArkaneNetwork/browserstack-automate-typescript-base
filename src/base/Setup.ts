import settings from '../../package.json';

import { Utils } from './Utils';

export interface Config {
    userData: any,
    capabilities: any,
    browserStackBinaryPath: any,
}

export class Setup {
    public static async getConfig(): Promise<Config> {
        const env = Utils.env;

        const userData = {
            'browserstack': {
                'browserstack.user': env.BROWSERSTACK_USERNAME,
                'browserstack.key': env.BROWSERSTACK_ACCESS_KEY,
            },
        };

        // Input capabilities
        const capabilities = {
            'build': env.BROWSERSTACK_BUILD,
            'project': settings.name,
            'acceptSslCerts': 'true',
            'browserstack.networkLogs': 'true',
            'browserstack.local': env.BROWSERSTACK_LOCAL === 'true',
            'browserstack.console': 'errors',
        };

        return {
            userData,
            capabilities,
            browserStackBinaryPath: env.BROWSERSTACK_LOCAL_BINARY_PATH
        }
    }
}

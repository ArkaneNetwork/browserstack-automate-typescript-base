import settings from '../../package.json';

import { Env } from './Env';

export interface Config {
    userData: any,
    capabilities: any,
    browserStackBinaryPath: any,
}

export class Setup {
    public static async getConfig(): Promise<Config> {
        const config = Env.getInstance().config;

        const userData = {
            'browserstack': {
                'browserstack.user': config.BROWSERSTACK_USERNAME,
                'browserstack.key': config.BROWSERSTACK_ACCESS_KEY,
            },
        };

        // Input capabilities
        const capabilities = {
            'build': config.BROWSERSTACK_BUILD,
            'project': settings.name,
            'acceptSslCerts': 'true',
            'browserstack.networkLogs': 'true',
            'browserstack.local': config.BROWSERSTACK_LOCAL === 'true',
            'browserstack.console': 'errors',
        };

        return {
            userData,
            capabilities,
            browserStackBinaryPath: config.BROWSERSTACK_LOCAL_BINARY_PATH
        }
    }
}

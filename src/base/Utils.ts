import path from 'path';

export class Utils {
    public static get env() {
        const {
            BROWSERSTACK_USERNAME,
            BROWSERSTACK_BUILD,
            BROWSERSTACK_ACCESS_KEY,
            BROWSERSTACK_LOCAL,
            BROWSERSTACK_LOCAL_BINARY_PATH,
            BROWSER_CONFIG
        } = process.env;

        return {
            BROWSERSTACK_USERNAME,
            BROWSERSTACK_ACCESS_KEY,
            BROWSERSTACK_LOCAL: BROWSERSTACK_LOCAL || 'false',
            BROWSERSTACK_BUILD,
            BROWSER_CONFIG,
            BROWSERSTACK_LOCAL_BINARY_PATH: path.resolve(BROWSERSTACK_LOCAL_BINARY_PATH || '../../BrowserStackLocal'),
        }
    }

    public static getTestName(str: string) {
        const strParts = str.split('/');
        const filename = strParts[strParts.length - 1].split('.')[0];
        return filename.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toUpperCase();
    }
}

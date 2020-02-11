import iphone8          from './iphone-8.json';
import macChrome        from './mac-chrome.json';
import macSafari        from './mac-safari.json';
import windows10Firefox from './windows10-firefox.json';
import windows10Edge  from './windows10-edge.json';
import { Env } from '../../base/Env';

export interface BrowserConfig {
    browserName?: string;
    device?: string;
    realMobile?: string;
    os?: string;
    os_version?: string;
    browser_version?: string;
    resolution?: string;
    chromeOptions?: any;
    name: string
}

export class BrowserConfigs {

    private static CONFIGS: Array<BrowserConfig> = [
        Object.assign({}, windows10Firefox, {name: 'WINDOWS10_FIREFOX'}),
        Object.assign({}, windows10Edge, {name: 'WINDOWS10_EDGE'}),
        Object.assign({}, macChrome, {name: 'MAC_CHROME'}),
        Object.assign({}, iphone8, {name: 'IPHONE8'}),
        Object.assign({}, macSafari, {name: 'MAC_SAFARI'}),
    ];
    public static getCurrentConfig(): BrowserConfig {
        return BrowserConfigs.CONFIGS.find((c: BrowserConfig) => c.name === Env.getInstance().config.BROWSER_CONFIG) || BrowserConfigs.CONFIGS[0];
    }
}

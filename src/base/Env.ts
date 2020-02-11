import path   from 'path';
import dotenv from 'dotenv'

export class Env {
    private static instance: Env;

    public static getInstance(): Env {
        if (Env.instance) {
            dotenv.config();
            Env.instance = new Env(process.env);
        }
        return Env.instance;
    }

    private env: any;

    private constructor(env: any) {
        this.env = env;
    }

    public get config() {
        return {
            BROWSERSTACK_USERNAME: this.env.BROWSERSTACK_USERNAME,
            BROWSERSTACK_ACCESS_KEY: this.env.BROWSERSTACK_ACCESS_KEY,
            BROWSERSTACK_LOCAL: this.env.BROWSERSTACK_LOCAL || 'false',
            BROWSERSTACK_BUILD: this.env.BROWSERSTACK_BUILD,
            BROWSER_CONFIG: this.env.BROWSER_CONFIG,
            BROWSERSTACK_LOCAL_BINARY_PATH: path.resolve(this.env.BROWSERSTACK_LOCAL_BINARY_PATH || '../../BrowserStackLocal'),
        }
    }
}

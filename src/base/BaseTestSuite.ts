import './Env';
import axios         from 'axios';
import chai          from 'chai';
import { Test }      from 'mocha';
import { context }   from 'mocha-typescript';
import { WebDriver } from 'selenium-webdriver';

import { Config, Setup }  from './Setup';
import { Selenium }       from './Selenium';
import { Utils }          from './Utils';
import { BrowserConfigs } from '../config/browser-configs/all';

import '../config/FastSelenium';
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

export abstract class BaseTestSuite {
    @context
    public mocha!: any;

    protected static time: number;
    protected static selenium: Selenium;
    protected static staticDriver: WebDriver;
    protected static config: Config;
    protected static errors: any[] = [];

    protected static get assert(): Chai.AssertStatic {
        return chai.assert;
    }

    protected static get expect(): Chai.ExpectStatic {
        return chai.expect;
    }

    protected get assert(): Chai.AssertStatic {
        return BaseTestSuite.assert;
    }

    protected get expect(): Chai.ExpectStatic {
        return BaseTestSuite.expect;
    }

    protected get browser(): WebDriver {
        return BaseTestSuite.getBrowser();
    }


    protected get user(): { login: string, password: string, pincode: string } {
        return BaseTestSuite.getUser();
    }

    protected static getBrowser(): WebDriver {
        return BaseTestSuite.staticDriver as WebDriver;
    }

    protected static async before(): Promise<void> {
        BaseTestSuite.errors = [];
        BaseTestSuite.time = Date.now();
        BaseTestSuite.config = await Setup.getConfig();
        const bsConfig = Object.assign({}, BrowserConfigs.getCurrentConfig());
        if (this.name) {
            bsConfig.name = bsConfig.name + '_' + Utils.getTestName(this.name);
        }
        if (BaseTestSuite.config.capabilities['browserstack.local']) {
            BaseTestSuite.config.capabilities.build = 'local_' + (new Date()).toLocaleDateString();
        }
        BaseTestSuite.selenium = new Selenium(BaseTestSuite.config.capabilities, BaseTestSuite.config.userData.browserstack, BaseTestSuite.config.browserStackBinaryPath);
        await BaseTestSuite.selenium.start(bsConfig);
        BaseTestSuite.staticDriver = await BaseTestSuite.selenium.createDriver() as WebDriver;
        if (!BaseTestSuite.staticDriver) {
            throw new Error('Could not initialize Selenium');
        }
    }

    protected after(): void {
        try {
            const test = (this.mocha.currentTest as Test);
            if (test && test.state !== 'passed') {
                BaseTestSuite.errors.push({
                    suite: test.file ? Utils.getTestName(test.file) : '',
                    title: test.title,
                    err: test.err,
                });
            }
        } catch (e) {
            BaseTestSuite.errors.push({
                title: 'unknown',
                err: e,
            });
        }
    }

    protected static async after(): Promise<void> {
        const session = await BaseTestSuite.getBrowser().getSession();
        const sessionId = session.getId();

        try {
            if (BaseTestSuite.staticDriver) {
                await BaseTestSuite.staticDriver.quit();
            }

            if (BaseTestSuite.selenium) {
                await BaseTestSuite.selenium.stop()
            }
            await BaseTestSuite.markTestSuite(Utils.getTestName(this.name), sessionId);
        } catch (e) {
            await BaseTestSuite.markTestSuite(Utils.getTestName(this.name), sessionId, e);

        }
    }


    protected static getUser(): { login: string, password: string, pincode: string } {
        return BaseTestSuite.config && BaseTestSuite.config.userData && BaseTestSuite.config.userData.arkane;
    }

    private static async markTestSuite(testSuiteName: string,
                                       sessionId: string,
                                       catchE?: any): Promise<void> {
        const instance = axios.create({
            baseURL: `https://api.browserstack.com/automate/sessions/`,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                'username': BaseTestSuite.config.userData.browserstack['browserstack.user'],
                'password': BaseTestSuite.config.userData.browserstack['browserstack.key']
            }
        });
        const data: any = {status: 'passed'};
        if (catchE) {
            data.status = 'failed';
            data.reason = catchE;
        } else {
            if (testSuiteName) {
                const errors = BaseTestSuite.errors.filter((e: any) => e.suite === testSuiteName);
                if (errors && errors.length > 0) {
                    data.status = 'failed';
                    data.reason = errors.map((e: any) => `${e.title}: ${e.err && e.err.message}`);
                }
            } else if (BaseTestSuite.errors.length > 0) {
                data.status = 'failed';
                data.reason = BaseTestSuite.errors;
            }
        }
        console.log(`***BS*** Test marked as ${data.status.toUpperCase()}: https://automate.browserstack.com/dashboard/v2/sessions/${sessionId}  *`);
        const response = await instance.put(`${sessionId}.json`, data);
    }
}

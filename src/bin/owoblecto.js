#!/usr/bin/env node
import {promises as fs} from 'fs';

(async () => {
    let packageInfo = JSON.parse(await fs.readFile(__dirname + '/../../package.json'));
    let args = process.argv.slice(2);

    switch (args[0]) {
        case 'start':
            require('../core/index').default.start();
            break;
        case 'start-tui':
            require('../core/graphical').default.start();
            break;

        case 'init':
            await require('./scripts/init').default(args);

            break;

        case 'adduser':
            await require('./scripts/adduser').default(args);

            break;

        case 'changepassword':
            await require('./scripts/changepassword').default(args);
            break;

        case 'removepassword':
            await require('./scripts/removepassword').default(args);
            break;

        case 'deluser':
            await require('./scripts/deluser').default(args);

            break;

        default:
            console.log(`owoblecto ${packageInfo.version}`);
            console.log();
            console.log('First time setup:');
            console.log('owoblecto init');
            console.log('owoblecto init database');
            console.log();
            console.log('Start owoblecto without TUI:');
            console.log('owoblecto start');
            console.log('Start owoblecto with TUI:');
            console.log('owoblecto start-tui');
            console.log();
            console.log('User maintenance:');
            console.log('owoblecto adduser USERNAME PASSWORD REALNAME EMAIL');
            console.log('owoblecto deluser USERNAME');
            console.log('owoblecto changepassword USERNAME PASSWORD');
            console.log('owoblecto removepassword USERNAME');
            console.log();
            console.log('Server maintenance:');
            console.log('owoblecto init assets');

    }
})();

export default async (args) => {
    if (args.length === 1) args[1] = 'owoblecto';

    switch (args[1]) {
        case 'owoblecto':
            await require('./general').default(args);
            break;
        case 'database':
            await require('./database').default(args);
            break;
        case 'assets':
            await require('./assets').default(args);
            break;
    }
};

import {promises as fs} from "fs";
import bcrypt from 'bcrypt';
import databases from '../../submodules/database';

export default async (args) => {
    let config = JSON.parse(await fs.readFile('/etc/oblecto/config.json'));

    if (args.length < 5) {
        console.log('Invalid number of arguments');
        return;
    }

    let hash = await bcrypt.hash(args[2], config.authentication.saltRounds);

    let [user, inserted] = databases.user.findOrCreate({
        where: {
            username: args[1]
        },
        defaults: {
            name: args[3],
            email: args[4],
            password: hash
        }
    });

    if (inserted) console.log('User has been created');
    else console.log('A user that with username already exists!');


    databases.sequelize.close();
};

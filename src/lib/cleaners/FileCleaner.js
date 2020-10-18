import {promises as fs} from 'fs';
import {File} from '../../models/file';
import {Movie} from '../../models/movie';
import {Episode} from '../../models/episode';
import logger from '../../submodules/logger';

export default class FileCleaner{
    constructor(owoblecto) {
        this.owoblecto = owoblecto;
    }

    async removedDeletedFiled () {
        logger.log('INFO', 'Removing all non existent files from the database');
        let files = await File.findAll();

        for (let file of files) {
            try {
                await fs.stat(file.path);
            } catch (e) {
                logger.log('INFO', file.path, 'not found. Removing from database');

                await file.destroy();
            }
        }

    }

    async removeAssoclessFiles () {
        logger.log('INFO', 'Removing files from the database without any attached media items');
        let results = await File.findAll({
            include: [Movie, Episode]
        });

        results.forEach((item) => {
            if (item.Movies.length === 0 && item.Episodes.length === 0) {
                item.destroy();
            }
        });
    }
}

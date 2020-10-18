import sharp from 'sharp';
sharp.cache(false);

export default class ImageScaler {
    constructor(owoblecto) {
        this.owoblecto = owoblecto;

        this.owoblecto.queue.addJob('rescaleImage', async (job) => {
            await ImageScaler.rescaleImage(job.from, job.to, {
                width: job.width,
                height: job.height
            });
        });
    }

    static async rescaleImage(from, to, size) {
        await sharp(from)
            .resize(size.width, size.height)
            .toFile(to);
    }
}

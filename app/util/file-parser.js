/**
 * Utility methods to parse Unix style group and passwd files.
 */

const fs = require('fs');
const readline = require('readline');

const READLINE_EVENT_NAME = 'line';
const READLINE_EVENT_CLOSE_NAME = 'close';

/**
 * Gets a readline stream that reads a text file line by line.
 *
 * The {Promise<ReadableStream>>} will reject if the file doesn't exist.
 *
 * @param path The path to the file.
 * @returns {Promise<ReadableStream>} The readline stream to listen for 'line' events.
 */
function getReadStream(path) {
    return new Promise((resolve, reject) =>{
        const fileStream = fs.createReadStream(path);
        fileStream.on('error', reject);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        fileStream.on('open', () => resolve(rl));
    });
}

/**
 * Mapping function to map a line from a group file to a group object.
 *
 * @param line The line of text to map.
 * @returns {{gid: number, members: string[], name: string}} The mapped group object.
 */
function mapToGroup(line) {
    const fields = line.split(':');

    if (fields.length !== 4) throw new Error(`file-parser: invalid line to parse a group: ${line}`);

    return {
        name: fields[0],
        gid: parseInt(fields[2]),
        members: fields[3].split(',').filter(member => member !== '')
    }
}

/**
 * Mapping function to map a line from a passwd file to a user object.
 *
 * @param line The line of text to map.
 * @returns {{uid: number, gid: number, shell: string, name: string, comment: string, home: string}} The mapped user object.
 */
function mapToUser(line) {
    const fields = line.split(':');

    if (fields.length !== 7) throw new Error('file-parser: invalid file format');

    return {
        name: fields[0],
        uid: parseInt(fields[2]),
        gid: parseInt(fields[3]),
        comment: fields[4],
        home: fields[5],
        shell: fields[6]
    };
}

/**
 * Public function to parse a group file to a list of groups.
 *
 * @param path The path of the group file.
 * @returns {Promise<Object[]>} Represents a list of groups.
 */
module.exports.parseGroups = async (path) => {
    let readStream;
    try {
        readStream = await getReadStream(path);
    } catch (e) {
        throw e;
    }

    return mapReadStream(readStream, mapToGroup);
};

/**
 * Public function to parse a passwd file to a list of users.
 *
 * @param path The path of the passwd file.
 * @returns {Promise<Object[]>} Represents a list of users.
 */
module.exports.parseUsers = async (path) => {
    const readStream = await getReadStream(path);

    return await mapReadStream(readStream, mapToUser);
};

/**
 * Shared private function to listen to the readline stream and call the provided mapper function.
 * This function also supports filtering comments prior to mapping.
 *
 * @param readStream The readline stream to read the file line by line.
 * @param mapper The mapper to map the line of text to the correct object.
 * @returns {Promise<Object[]>} Represents a list of the mapper return type.
 */
function mapReadStream(readStream, mapper) {
    return new Promise((resolve, reject) => {
        const result = [];

        readStream.on(READLINE_EVENT_NAME, line => {
            if (line.startsWith('#')) return;
            try {
                result.push(mapper(line))
            } catch (e) {
                reject(e);
            }
        });

        readStream.on(READLINE_EVENT_CLOSE_NAME, () => resolve(result));
    });
}
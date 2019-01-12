const fs = require('fs');
const readline = require('readline');

const READLINE_EVENT_NAME = 'line';
const READLINE_EVENT_CLOSE_NAME = 'close';

function getReadStream(path) {
    const fileStream = fs.createReadStream(path);

    return readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
}

function mapToGroup(line) {
    const fields = line.split(':');

    if (fields.length !== 4) throw new Error(`file-parser: invalid line to parse a group: ${line}`);

    return {
        name: fields[0],
        gid: parseInt(fields[2]),
        members: fields[3].split(',').filter(member => member !== '')
    }
}

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

module.exports.parseGroups = async (path) => {
    const rl = getReadStream(path);

    return mapReadStream(rl, mapToGroup);
};

module.exports.parseUsers = async (path) => {
    const readStream = getReadStream(path);

    return await mapReadStream(readStream, mapToUser);
};

async function mapReadStream(readStream, mapper) {
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
        readStream.on('error', err => reject(err));

        readStream.on(READLINE_EVENT_CLOSE_NAME, () => resolve(result));
    });
}
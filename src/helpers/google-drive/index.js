const stream = require("stream");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const { STORAGE_FOLDER } = require("../../config")
const CREDENTIALS_PATH = path.join(process.cwd(), '/src/config/drive_credentials.json');
const SCOPES = 'https://www.googleapis.com/auth/drive';

const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
});

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: [STORAGE_FOLDER],
        },
        fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
};

const getFileName = async (fileId) => {
    const drive = google.drive({ version: 'v3', auth });
    try {
        const response = await drive.files.get({
            fileId,
            fields: 'name',
        });
        return response.data.name;
    } catch (err) {
        console.error('Error getting file name:', err);
        throw err;
    }
}

const downloadFile = async (fileId) => {
    const fileName = await getFileName(fileId);
    const destinationPath = `${process.cwd()}/test/${fileName}`;

    const drive = google.drive({ version: 'v3', auth });
    try {
        return await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        // const writer = fs.createWriteStream(destinationPath);
        // data
        //     .on('end', () => {
        //         console.log('File downloaded successfully.');
        //     })
        //     .on('error', (err) => {
        //         console.error('Error downloading file:', err);
        //         fs.unlinkSync(destinationPath); // Delete the file if there was an error
        //         throw err;
        //     })
        //     .pipe(writer);
    } catch (err) {
        console.error('Error downloading file:', err);
        throw err;
    }
}

const listFiles = async () => {
    const { data } = await google.drive({ version: "v3", auth }).files.list({
        q: `'${STORAGE_FOLDER}' in parents`
    });
    console.log(`List file ${data}`);
    return data;
}

module.exports = {
    uploadFile,
    downloadFile,
    listFiles
};

const stream = require("stream");
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

const listFiles = async () => {
    const { data } = await google.drive({ version: "v3", auth }).files.list({
        q: `'${STORAGE_FOLDER}' in parents`
    });
    console.log(`List file ${data}`);
    return data;
}

module.exports = {
    uploadFile,
    listFiles
};

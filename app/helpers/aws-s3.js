const AWS = require('aws-sdk')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')

const Help = require('./upload')

const config = path.join(__dirname, '../config/aws-config.json')

AWS.config.loadFromPath(config)

const s3 = new AWS.S3()

const UploadS3 = (base64, filename) =>  {
    const params = {
        Bucket: 'iuvo_club',
        Body: base64,
        Key: filename,
        ACL: 'public-read',
        ContentEncoding: 'base64' // required
    }
    return s3.upload(params).promise()
}

module.exports.uploadAwsRemove = avatar => {
    const params = {
        Bucket: 'iuvo_club',
        Delete: { Objects: [{ Key: avatar }] }
    }
    s3.deleteObjects(params).promise()
}

module.exports.uploadAws = object => new Promise(async (resolve, reject) => {
    try {
        const readFileAsync = promisify(fs.readFile)
        const data = await readFileAsync(object.path)
        const upload = await UploadS3(data, object.filename)
        Help.uploadRemove(object.filename)
        resolve(upload)
    } catch (err) {
        reject(err)
    }
})

module.exports.uploadAwsBase64 = (avatar, user) => new Promise(async (resolve, reject) => {
    try {
        const readFileAsync = promisify(fs.readFile)
        const locate = `${user}-image.png`
        const data = await readFileAsync(locate)
        const upload = await UploadS3(data, `${user}-${new Date().toISOString()}-image.png`)
        fs.unlink(locate)
        resolve(upload)
    } catch (err) {
        reject(err)
    }
})

module.exports.base64InArchiveUser = (avatar, user) => {
    const writeFile = promisify(fs.writeFile)
    return writeFile(`${user}-image.png`, avatar, { encoding: 'base64' })
}

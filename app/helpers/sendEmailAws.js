module.exports = (app) => {
    const AWS = require('aws-sdk')
    AWS.config.update({region: 'us-east-1', accessKeyId: 'AKIAJ6LT67KWBJXHFLTA', secretAccessKey: '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'});
    return {
        send: (User, Template, Description) => {
            // const ses = new AWS.SES()
            // const template = Template
            // const html = template(User)
            // const params = {
            //     Destination: {
            //       ToAddresses: [User.email]
            //     },
            //     Message: {
            //       Body: {
            //         Html: {
            //           Charset: 'UTF-8',
            //           Data: html
            //         },
            //       },
            //       Subject: {
            //         Charset: 'UTF-8',
            //         Data: Description
            //       }
            //     },
            //     ReturnPath: 'suporte@iuvoclub.com.co',
            //     Source: 'suporte@iuvoclub.com.co'
            //   }
            //   ses.sendEmail(params, (err, data) => {
            //     if (err) console.log(err, err.stack)
            //     else console.log(data)
            //   })
        }
    }
}

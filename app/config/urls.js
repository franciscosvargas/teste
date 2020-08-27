// module.exports = {
//     database: 'pedeae_delivery-20200123',
//     username: 'root',
//     password: '',
//     params: {
//         host: 'localhost',
//         port: 3306,
//         timezone: '-03:00',
//         dialect: 'mysql',
//         dialectOptions: {
//             useUTC: false
//         },
//         logging: false,
//         // logging: console.log,
//         pool: {
//             max: 5,
//             min: 0,
//             evict: 10000,
//             acquire: 10000,
//             maxIdleTime: 30,
//             handleDisconnects: true
//         },
//         define: {
//             underscored: true
//         },
//         retry: {
//             max: 5
//         }
//     },
//     url: '/api/v1',
//     mediaRootPath: '/root/WebWhatsapp-Wrapper/',
//     baseUrl: 'https://pedeae.delivery:3000'
// }


module.exports = {
    database: 'pededeliveryapp2',//pededeliveryapp2
    username: 'pededeliveryapp2',//pededeliveryapp2
    password: 'sCs-E;SOoA', //Wc1b5!QV_e08
    params: {
        host: 'den1.mysql5.gear.host', //167.172.158.239
        port: 3306,
        timezone: '-03:00',
        dialect: 'mysql',
        dialectOptions: {
            useUTC: false
        },
        logging: false,
        // logging: console.log,
        pool: {
            max: 5,
            min: 0,
            evict: 10000,
            acquire: 10000,
            maxIdleTime: 30,
            handleDisconnects: true
        },
        define: {
            underscored: true
        },
        retry: {
            max: 5
        }
    },
    url: '/api/v1',
    mediaRootPath: '/root/WebWhatsapp-Wrapper/',
    baseUrl: 'https://pedeae.delivery:3000'
}

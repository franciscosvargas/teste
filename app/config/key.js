module.exports = {
    token: '1a5H(qzO&1+!8M35tXvai3A*JF%Os]eOoG63/Oo+:1S(R[%x[js09UKDam0#853213213123123',
    googleKey: 'AIzaSyA3JCWk68Vxk8XzRxP2hoJUsNBwGlyIe98',
    // googleKey: 'AIzaSyC8fAkDoUGVCkWcxG770zERz6cpou4gYUo',
    twillo: {
        account: 'ACf4912767b42a20cb0fe24bb12282bdad',
        token: 'ea8755c91568d211501ac1570791c743'
    },
    cpf: 'http://186.202.45.156:8080/search-doc/service',
    cnpj: 'https://www.receitaws.com.br/v1/cnpj',
    socket: 'http://localhost:4000',
    oneSignal: {
        appId: '2ec87494-4896-48d7-9949-c4f80859004b',
        header: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Basic MmQ1MzVkMjUtY2JiNS00ZDdkLTljMWItMjhkOGE5M2Y5ZTIw`
        },
        urls: {
            notification: {
                url: '/api/v1/notifications',
                method: 'post'
            },
            base: 'https://onesignal.com'
        }
    },
    firebase: {
        key: 'AIzaSyApqVc5CAw3w0_xfBCI33pkl0_aB2oYAnE'
    },
    aws: {
        'accessKeyId': 'AKIAJ6LT67KWBJXHFLTA',
        'secretAccessKey': '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'
    },
    cielo: {
        MerchantId: '4b4980ba-5ff8-4fbb-8b6c-c9d33dc7569c',
        MerchantKey: '1v9hf9FTJd2uBZsMqOdipRKduIuvPp4BDkCQrKTe',
        sandbox: true,
        url: 'https://api.cieloecommerce.cielo.com.br/'
    },
    pagarme: {
        tester: 'ak_test_o4vrnPT7FYujRTH4bvGO3mXtlDCjJW',
        production: 'ak_live_VVyRkz04cCZn43IALGLkZIq8HAJHXe',
        cardDeliveryPostBacnkUrl: 'https://api.iuvoclub.com.co/api/v1/transaction/card/delivery/pagarme',
        tiketPostbackUrl: 'https://api.iuvoclub.com.co/api/v1/transaction/ticket/pagarme',
        cardPostBackUrl: 'https://api.iuvoclub.com.co/api/v1/transaction/card/pagarme',
        cardTaxiPostBack: 'https://api.iuvoclub.com.co/api/v1/transaction/card/taxi/pagarme',
        transactionCardFinishTaxi: 'https://api.iuvoclub.com.co/api/v1/transaction/card/taxi/finish/pagarme'
    }
}

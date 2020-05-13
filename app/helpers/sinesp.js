
//const sinesp = require('sinesp-nodejs')
request = require('request')

const clearPlate = plate => plate.replace(/[\(\)\.\s-]+/g, '')

const validateResponse = (object, res) => {
    let mainErrorMessage = "Serviço de consulta de placas não disponível";
    try{
        if (object.codigoRetorno === undefined) {
            throw Error;
        }

        if(parseInt(object.codigoRetorno) !== 0){
            let error = object.mensagemRetorno || mainErrorMessage;
            return res.status(400).json([{title: 'Placa', message: error, serviceResponse: object}])
        }

        return res.status(200).json(object)

    } catch(e) {
        res.status(400).json([{title: 'Placa', message: mainErrorMessage, serviceResponse: object}])
    }
}

const tratmentError = (object, res) => {
    try {
        parseInt(object.codigoRetorno)
            ? res.status(400).json([{title: 'Placa', message: 'Placa Invalida!'}])
            : validateResponse(object, res)
    } catch (err) {
        res.status(500).json(err)
    }
}


const queryPlate = (plate, res) => {
    const hash = '490e18d2e7b0a0cda48f1d89a8c0746c' //$$@@iuvo_club|ConsultaDePlacas|iuvo_club!%$
    request(`http://200.98.168.24/?p=${plate}&hash=${hash}`, function (error, response, body) {
        const serverIsUp = (r) => r !== undefined
        const status200 = (r) => r.statusCode == 200
        const reqBodyIsOk = (b) => !JSON.parse(b).error

        if(serverIsUp(response) && status200(response) && reqBodyIsOk(body)){
            tratmentError(JSON.parse(body), res)
        }else{
            res.status(400).json([{title: 'ERRO', message: 'Serviço de placa BR indisponível!'}])
        }

    })
}


module.exports = {
    searchPlate: (object, res) => {
        object.plate = clearPlate(object.plate)
        //sinesp.consultaPlaca(object.plate, plate => tratmentError(plate, res))
        queryPlate(object.plate, res)
    }
}

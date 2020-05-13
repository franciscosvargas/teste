
function returnCreateSuccess (object, res) {
    res.status(201).json(object)
}

function returnCreateSuccessUser (object, res) {
    const User = {
        id: object.id,
        name: object.name,
        email: object.email,
        status: object.status,
        avatar: object.avatar
    }
    res.status(201).json(User)
}

function returnSuccess (object, res) {
    res.status(201).json(object)
}

const returnError = (err, res) => {
    console.log(err)
    res.status(400).json(err)
}

function returnUpdate (object, res) {
    res.status(200).json([{title: 'Alterado com sucesso!', message: 'Conseguimos alterar o seu registro com sucesso!'}])
    // : res.status(400).json([{title: 'Error em alterar!', message: 'Não foi possivel efetuar atualização, tente novamente!'}])
}

function returnUpdateActive (object, res) {
    object[0]
        ? res.status(200).json([{title: 'Reenvio de Código ', message: 'Código de ativação enviado com Sucesso!'}])
        : res.status(400).json([{title: 'Error em Reenvio de Código!', message: 'Não foi possivel reenviar o código, tente novamente!'}])
}

function returnDelete (object, res) {
    object
        ? res.status(200).json([{title: 'Deletado', message: 'Deletado com Sucesso!'}])
        : res.status(400).json([{title: 'Error', message: 'Não contém o registro!'}])
}

function returnListSuccess (object, res) {
    res.status(200).json(object)
}

const returnGoogleAddressTratment = (object, maps) => {
    try {
        object.location = {type: 'Point', coordinates: [maps.json.results[0].geometry.location.lat, maps.json.results[0].geometry.location.lng]}
        return object
    } catch (err) {
        return object
    }
}

module.exports = {
    returnSuccess: returnSuccess,
    returnGoogleAddressTratment: returnGoogleAddressTratment,
    returnCreateSuccessUser: returnCreateSuccessUser,
    returnCreateSuccess: returnCreateSuccess,
    returnListSuccess: returnListSuccess,
    returnUpdate: returnUpdate,
    returnError: returnError,
    returnDelete: returnDelete,
    returnUpdateActive: returnUpdateActive

}

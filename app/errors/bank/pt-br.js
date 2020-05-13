const name = {
    title: 'Nome',
    message: 'Nome é requerido!'
}

const cpf = {
    title: 'Cpf',
    message: 'Cpf é requerido!'
}

const agency = {
    title: 'Agencia',
    message: 'Agencia é requerido!'
}

const my = {
    title: 'Conta Terceiros',
    message: 'Conta Terceiros é requerido!'
}

const agencyDv = {
    title: 'agencyDv',
    message: 'Digito de Agencia é requerido!'
}
const account = {
    title: 'Conta',
    message: 'Conta é requerido!'
}

const accountDv = {
    title: 'Digito da Conta',
    message: 'Digito de conta é requerido!'
}

const userId = {
    title: 'Usuário',
    message: 'Usuário é requerido!'
}

const typesBankId = {
    title: 'Tipo de Banco',
    message: 'Tipo de Banco é requerido!'
}
const cpfInvalid = {
    title: 'Cpf',
    message: 'Cpf invalido!'
}

const bankExist = {
    title: 'Dados Bancários',
    message: 'O CPF do usuário já possui uma conta cadastrada em nossa base de dados!'
}

const userNotExist = {
    title: 'Usuário',
    message: 'Usuário não existe!'
}
const typeBankNotExist = {
    title: 'Tipo de Banco',
    message: 'Tipo de Banco não existe!'
}

module.exports = {
    name: name,
    cpf: cpf,
    typeBankNotExist: typeBankNotExist,
    userNotExist: userNotExist,
    my: my,
    bankExist: bankExist,
    agency: agency,
    agencyDv: agencyDv,
    account: account,
    typesBankId: typesBankId,
    accountDv: accountDv,
    cpfInvalid: cpfInvalid,
    userId: userId
}


const phoneClean = phone => phone.toString().replace(/[^0-9]+/g, '')
const clean = object => object.toString().replace(/[\.-]/g, '')
const ddi = phone => phone.toString().substring(0, 2)
const ddd = phone => phone.toString().substring(2, 4)
const phone = phone => phone.toString().substring(4, 14)
const removeAll = object => object.toString().replace(/[\[\].!'@,><|://\\;&*()_+=]/g, '')
const removeParenthesis = object => object.toString().replace(/ *\([^)]*\) */g, '')

const cep = cep => {
    cep = cep.replace(/\D/g, '')
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2')
    return cep
}

module.exports = {
    phoneClean: phoneClean,
    removeParenthesis: removeParenthesis,
    ddi: ddi,
    ddd: ddd,
    removeAll: removeAll,
    clean: clean,
    phone: phone,
    cep: cep
}

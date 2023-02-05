const oneRandomKey = () => {
    return Math.random()
        .toString(36)
        .toUpperCase()
        .slice(2)
        .replace(/[01IO]/g, '')
}

const randomKeyOfSpecificLength = (len: number) => {
    let str = oneRandomKey()
    while (str.length < len) {
        str += oneRandomKey()
    }
    return str.slice(0, len)
}

const generate = function (length: number = 16, separator: string = '-', blockLength: number = 4) {

    const license = randomKeyOfSpecificLength(length)
    const regexp = new RegExp(`(\\w{${blockLength}})`, 'g')
    return license.replace(regexp, `$1${separator}`).substr(0, (length + Math.round(length / blockLength)) - 1)
}


export default generate;


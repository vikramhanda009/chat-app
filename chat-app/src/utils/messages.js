const generateMessage =(text)=>{
    return {
        text,
        'createdAt':new Date().getTime()
    }
}
const generateLocationMessage =(location)=>{
    return {
        "url":  `https://www.google.com/maps?q=${location.lat},${location.long}`,
        'createdAt':new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
};

module.exports.verify = async function(request, response){
    return response.send("Hello");
}
module.exports.signIn = async function (request, response) {
    return response.send(200);
}
function preventDelete(request, response, next) {

    if (request.method === "DELETE") {
        response.status(401).send("DELETE is not allowed.");
        return;
    }

    next();

}

module.exports = preventDelete;
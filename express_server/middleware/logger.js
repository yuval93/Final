function log(request, response, next) {
    console.log(`Log: ${request.method}, ${request.originalUrl}`);

    next();
}

module.exports = log;
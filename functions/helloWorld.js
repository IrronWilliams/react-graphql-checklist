exports.handler = async (event, context) => { //only using event
    return {
        statusCode: 200,
        body: JSON.stringify({
            msg: 'Hello World!',
        }),
    }

}
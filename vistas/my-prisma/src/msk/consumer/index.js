// Code for test our Kafka consumer (will be triggered by MSK)


// A simple function that receive an event and print it


exports.handler = async (event) => {
    console.log(event)
    // TODO implement
    const response = {
        statusCode: 200,
        body: event
    };
    return response;
};
const {Kafka} = require('kafkajs')
const {  awsIamAuthenticator,  Type} = require('@jm18457/kafkajs-msk-iam-authentication-mechanism')

const  kafka = new Kafka({
        // REPLACE YOUR ENDPOINT BELOW
        clientId: 'my-app',
        brokers: [process.env.BROKERS],//process.env.BROKERS.split(","),
        ssl: true,

        //if serverless (IAM Auth):
        sasl: {
            mechanism: Type,
            authenticationProvider: awsIamAuthenticator("us-west-2",900)//process.env.REGION, process.env.TTL)
        },

        connectionTimeout: 30000,
        authenticationTimeout: 10000,
    })


const createTopic= {
    topic: "create", //process.env.TOPIC
    numPartitions: 1,//-1, 
    replicationFactor: -1,
    replicaAssignment:  [],
    configEntries:  []
}
const updateTopic= {
    topic: "update", //process.env.TOPIC
    numPartitions: 1,//-1, 
    replicationFactor: -1,
    replicaAssignment:  [],
    configEntries:  []
}
const deleteTopic= {
    topic: "delete", //process.env.TOPIC
    numPartitions: 1,//-1, 
    replicationFactor: -1,
    replicaAssignment:  [],
    configEntries:  []
}

async function initMSK() {
    const admin = kafka.admin()
    await admin.connect()
    let topics = await admin.listTopics()
    //console.log(topics)
    
    if (!topics.includes(createTopic.topic)){
        await admin.createTopics({
            topics: [createTopic,updateTopic,deleteTopic],
        })
    }

    // let info=await admin.fetchTopicMetadata({ topics: ["testing"] })
    // console.log(info)
    // console.log(info.topics[0].partitions)
    
    //let info=await admin.describeCluster()
    //console.log(info)

    await admin.disconnect()
    return topics
}
        
async function sendMessage(topico, msg) {
    const message={value:msg};
    console.log("Message: " + message)
    const producer = kafka.producer();
    await producer.connect();
    let res = await producer.send({
            topic: topico,
            messages: [message],
        });
    await producer.disconnect();
    return res
}

module.exports = {
    initMSK: initMSK,
    sendMessage: sendMessage
  }
  
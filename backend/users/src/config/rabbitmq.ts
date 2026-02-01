import amqp from "amqplib";
let channel: amqp.Channel;

export const connectRabbitMQ = async () => {

    try {
         const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672'),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASS || 'guest',
        });

        channel = await connection.createChannel();

        console.log("Connected to RabbitMQ");
         
    } catch (error) {
        console.error("RabbitMQ connection error:", error);
    }
}
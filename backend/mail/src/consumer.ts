import amqp from 'amqplib';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const startSentOtpConsumer = async()=>{

    try{
        console.log('Starting OTP email consumer...');
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672'),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASS || 'guest',
        })

        console.log('Connected to RabbitMQ for OTP email consumer');


        const channel = await connection.createChannel();
        const queue = 'sent-otp';

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
        channel.consume(queue,  async(msg) => {
           if(msg){
            try{
                const { to, subject, body } = JSON.parse(msg.content.toString());
                // Simulate sending email
                console.log(`Sending OTP email to: ${to}`);
                console.log(`Subject: ${subject}`);
                console.log(`Body: ${body}`);


                const transporter =  nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '465'),
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },

                });
                await transporter.sendMail({
                    from: 'chatapp',
                    to,
                    subject,
                    text: body,
                });
                console.log(`OTP email sent to: ${to}`);

                // Acknowledge message after processing
                channel.ack(msg);

            }
            catch(error){
                console.error('Error processing OTP message:', error);
                channel.nack(msg, false, false); // Reject the message without requeue
            }
           }
    });
    }
    catch(error){
        console.error('Error in OTP consumer:', error);
    }
}
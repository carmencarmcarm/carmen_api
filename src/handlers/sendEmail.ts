import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SES } from '@aws-sdk/client-ses';
import responseHandler from '../utils/response';

interface EventBody {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const SOURCE_EMAIL = `Robot <email@carmenleung.me>`;

function buildMessageBody(data: EventBody): string {
    return `
        <html lang="en">
            <body>
                <ul>
                    <li>Name: ${data.name}</li>
                    <li>Email: ${data.email}</li>
                    <li>Subject: ${data.subject}</li>
                    <li>Message: ${data.message}</li>
               </ul>
            </body>
        </html>
    `;
}

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) throw new Error('Invalid Request');

        const eventBody: EventBody = JSON.parse(event.body);
        const sesClient = new SES({ region: 'us-east-1' });

        const sendResponse = await sesClient.sendEmail({
            Destination: {
                ToAddresses: ['carmenleung.pm@gmail.com'],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: buildMessageBody(eventBody),
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `${eventBody.subject} From ${eventBody.name}`,
                },
            },
            Source: SOURCE_EMAIL,
        });
        console.log('Send Response', sendResponse);

        return responseHandler({ statusCode: 201, body: 'Success' });
    } catch (error) {
        console.error('Exception handling request', event);
        return responseHandler({ statusCode: 500, body: 'Internal Server Error' });
    }
}

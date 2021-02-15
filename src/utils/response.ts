import { APIGatewayProxyResult } from 'aws-lambda';

export default function responseHandler(options: { statusCode: number; body: string }): APIGatewayProxyResult {
    return {
        statusCode: options.statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://carmenleung.me',
        },
        body: options.body,
        isBase64Encoded: false,
    };
}

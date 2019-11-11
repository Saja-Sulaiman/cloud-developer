import 'source-map-support/register'

import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const url = getUploadUrl(todoId)

  const attachmentUrl:string = 'https://' + bucketName + '.s3.amazonaws.com/' + todoId

  var params = {
    TableName:todoTable,
    Key:{
      partitionKey: userId,
      sortKey: todoId
    },
    UpdateExpression: "set attachmentUrl = :r",
    ExpressionAttributeValues:{
        ":r":attachmentUrl
    },
    ReturnValues:"UPDATED_NEW"
};

  await docClient.update(params).promise()
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
})
handler.use(
  cors({
    credentials: true
  })
)

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}
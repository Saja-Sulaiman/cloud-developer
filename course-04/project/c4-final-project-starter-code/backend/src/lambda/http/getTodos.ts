import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'



const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE

const logger = createLogger('createTodo')

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  logger.info('Processing event: ', event)

  const result = await docClient.scan({
    TableName: todoTable
  }).promise()

  const items = result.Items

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
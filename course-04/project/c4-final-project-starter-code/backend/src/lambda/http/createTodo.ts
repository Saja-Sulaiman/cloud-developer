import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE
const logger = createLogger('createTodo')

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  logger.info('Processing event: ', event)
  const userId = getUserId(event);
  logger.info('userId: ' + userId)
  const todoId = uuid.v4()
  

  const newItem = {
    partitionKey: userId,
    sortKey: todoId,
    ...newTodo
  }
logger.info('newtodo: ' + JSON.stringify(newItem))
logger.info('userId type: ' + typeof userId + ', todoId type: ' + typeof todoId )
  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
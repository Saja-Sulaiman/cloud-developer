import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'

import { todoExists } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE


export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  const validTodoId = await todoExists(userId, todoId)
  

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  await docClient.delete({
    TableName: todoTable,
    Key: {
      partitionKey: userId,
      sortKey: todoId
    }
  }).promise()
// TODO: Remove a TODO item by id
  return {
    statusCode: 200,
    body: JSON.stringify({
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)

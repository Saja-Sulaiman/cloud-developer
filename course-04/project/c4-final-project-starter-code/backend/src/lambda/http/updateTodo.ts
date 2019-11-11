import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { todoExists } from '../utils'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
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

  var params = {
    TableName:todoTable,
    Key:{
      partitionKey: userId,
      sortKey: todoId
    },
    UpdateExpression: "set #n = :r, dueDate=:p, done=:a",
    ExpressionAttributeValues:{
        ":r":updatedTodo.name,
        ":p":updatedTodo.dueDate,
        ":a":updatedTodo.done
    },
    ExpressionAttributeNames:{
      "#n": "name"
    },
    ReturnValues:"UPDATED_NEW"
};

  await docClient.update(params).promise()

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 201,
    body: JSON.stringify({
      updatedTodo
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
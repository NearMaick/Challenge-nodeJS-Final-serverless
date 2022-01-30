import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDbClient";
import { v4 as uuidV4 } from "uuid";

interface ICreateTodo {
  id: string;
  title: string;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const id = uuidV4();

  await document
    .put({
      TableName: "todos",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).getTime(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};

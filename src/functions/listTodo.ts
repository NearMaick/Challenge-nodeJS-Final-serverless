import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDbClient";
import { v4 as uuidV4 } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "todos",
      FilterExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items),
  };
};

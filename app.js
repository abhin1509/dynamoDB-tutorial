const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const sendResponse = (code, bool, msg, list) => {
  return {
    statusCode: code,
    body: JSON.stringify({
      success: bool,
      message: msg,
      items: list
    })
  }
}

const getData = async (id) => {
  const res = await dynamoDB.get({
    TableName: "todoTable",
    Key: { id },
  }).promise();
  return sendResponse(200, true, 'data fetched successfully', res.Item);
}

const createData = async ({ id, title }) => {
  await dynamoDB.put({
    Item: { id, title },
    TableName: "todoTable",
  }).promise();
  return sendResponse(200, true, 'data created successfully', { id, title });
}

const updateData = async ({id, title}) => {
  const res = await dynamoDB
    .update({
      TableName: "todoTable",
      Key: { id },
      UpdateExpression: `set title = :x`,
      ExpressionAttributeValues: {
        ":x": title,
      },
      ReturnValues: "UPDATED_NEW",
    }).promise();
  console.log("res:: " + res);
  return sendResponse(200, true, 'Updated successfully', res);
}

const deleteData = async (id) => {
  await dynamoDB.delete({
    TableName: "todoTable",
    Key: { id },
  }).promise();
  return sendResponse(200, true, 'deleted successfully', { id });
}

exports.handler = async (event) => {
  let { id, title, } = event.queryStringParameters || {};
  let method = event.httpMethod;
  try {
    switch (true) {
      case method === 'GET' && event.path === '/list':
        return getData(id);
      case method === 'POST' && event.path === '/list':
        return createData(JSON.parse(event.body));
      case method === 'PUT' && event.path === '/list':
        return updateData(JSON.parse(event.body));
      case method === 'DELETE' && event.path === '/list':
        return deleteData(id);
    }
  }
  catch (e) {
    return sendResponse(500, false, 'error', e);
    //console.log(e);
  }
}

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getData = async (id) => {
  return await dynamoDB.get({
    TableName: "todoTable",
    Key: { id },
  }).promise();
}

const createData = async ({ id, newName }) => {
  await dynamoDB.put({
    Item: { id, newName }, //caution:: don't pass obj directly
    TableName: "todoTable",
  }).promise();
}

const updateData = async ({ id, newName }) => {
 const res = await dynamoDB
    .update({
      TableName: "todoTable",
      Key: { id },
      UpdateExpression: `set newName = :x`,
      ExpressionAttributeValues: {
        ":x": newName,
      },
      ReturnValues: "UPDATED_OLD"
    }).promise();
  console.log(res);
  return res;
}

const deleteData = async (id) => {
  await dynamoDB.delete({
      TableName: "todoTable",
      Key: { id },
    }).promise();
}

exports.handler = async (event) => {
  let method = event.method;
  try {
    switch (method) {
      case 1: return getData(event.id);
      case 2: return createData(event);
      case 3: return updateData(event);
      case 4: return deleteData(event.id);
    }
  }
  catch (e) {
    console.log(e);
  }
}
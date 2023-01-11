import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const randomeNumb = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  const number = Math.round(Math.random() * 10);
  console.log(number);

  response.send(number.toString());
});

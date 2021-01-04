const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./LiveShare-8a2aa8e3eedc.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const stripe = require("stripe")(functions.config().stripe.secret);
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors")({ origin: true });
const app = express();
const nodemailer = require("nodemailer");
const Styliner = require("styliner");
const algoliasearch = require("algoliasearch");

const algoliaClient = algoliasearch(
  functions.config().algolia.client,
  functions.config().algolia.secret
);

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: functions.config().email.username,
    pass: functions.config().email.app_password,
  },
  secure: true,
});

const styliner = new Styliner(__dirname, +"/html");

app.use(cors);
app.use(bodyParser.json());
app.use(
  session({
    secret: "Set this to a random string that is kept secure",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/onboard-user", (req, res) => {
  return cors(req, res, async () => {
    const idToken = req.body.idToken;
    if (!idToken) {
      res.send("Must be logged in");
      return;
    }
    // idToken comes from the client app
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      // does this user already have a stripe account with liveshare
      const userStripeRef = admin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("private")
        .doc("private");
      let stripeAccountId = (await userStripeRef.get()).data();
      if (stripeAccountId) {
        stripeAccountId = stripeAccountId.stripeAccountId;
      }
      let accountId;
      if (stripeAccountId) {
        accountId = stripeAccountId;
      } else {
        accountId = (await stripe.accounts.create({ type: "standard" })).id;
        await userStripeRef.set(
          { stripeAccountId: accountId },
          { merge: true }
        );
      }
      req.session.accountID = accountId;
      const accountLinkURL = await generateAccountLink(accountId);
      req.session.userId = uid;
      res.send({ url: accountLinkURL });
    } catch (error) {
      console.log("Error with Stripe account", error);
      res.status(500).send({
        error: error.message,
      });
    }
  });
});

app.post("/onboard-user/valid-user", async (req, res) => {
  const idToken = req.body.idToken;
  if (!idToken) {
    res.status(500).send("Must be logged in");
    return;
  }
  // idToken comes from the client app
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // does this user already have a stripe account with liveshare
    const userStripeRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("private")
      .doc("private");
    let stripeAccountId = (await userStripeRef.get()).data();
    if (stripeAccountId) {
      stripeAccountId = stripeAccountId.stripeAccountId;
    }
    console.log("stripe acc", stripeAccountId);
    if (!stripeAccountId) {
      res.status(200).send({ status: false });
    } else {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      res.status(200).send({ status: account.details_submitted });
    }
  } catch (err) {
    console.log("err with stripe", err);
  }
});

app.get("/onboard-user/refresh", async (req, res) => {
  try {
    const { accountID } = req.session;
    const accountLinkURL = await generateAccountLink(accountID);
    console.log("account url");
    console.log(accountLinkURL);
    res.redirect(accountLinkURL);
  } catch (err) {
    console.log("error in refresh", err.message);
    res.status(500).send({
      error: err.message,
    });
  }
});

async function addMeeting(
  userId,
  instructorName,
  email,
  day,
  timeIndex,
  price,
  transactionId
) {
  const encodedClientIDAndSecret =
    "OFNPRGNUT19UOVUyUm5QNEtqTWhROkVEN3ZwSTd5SDRMWExWTFdRVmlkOFNUNzVGSHptajY0";
  const privateData = await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("private")
    .get();
  if (!privateData.exists) {
    return false;
  }
  const zoomRefreshToken = privateData.data().zoomRefreshToken;
  if (!zoomRefreshToken) {
    return false;
  }
  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${zoomRefreshToken}`,
      null,
      { headers: { Authorization: `Basic ${encodedClientIDAndSecret}` } }
    );
    const { access_token, refresh_token } = response.data;
    console.log("posted zoom");
    console.log(access_token);
    console.log(refresh_token);
    try {
      const offset = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(day);
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + offset);
      const scheduledHours = ~~(timeIndex / 2);
      const scheduledMinutes = timeIndex % 2 === 0 ? 0 : 30;
      scheduledDate.setHours(scheduledHours);
      scheduledDate.setMinutes(scheduledMinutes);
      scheduledDate.setSeconds(0);
      const dateISOString = scheduledDate.toISOString();
      const dateString =
        dateISOString.substring(0, 19) + dateISOString.substring(23);
      console.log("final date string", dateString);
      admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("private")
        .doc("private")
        .set({ zoomRefreshToken: refresh_token }, { merge: true });
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        { start_time: dateString },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      await emailMeeting(
        email,
        instructorName,
        scheduledDate.toLocaleString(),
        price,
        response.data.join_url,
        transactionId
      );
      return true;
    } catch (err) {
      console.log("ERROR AFTER ACCESS TOKEN ACQUIRED: ", err);
      return false;
    }
  } catch (err) {
    console.log("err!", err);
    return false;
  }
}

async function addTransaction() {}

async function emailMeeting(
  receivers,
  name,
  meetingTime,
  price,
  joinURL,
  transactionId
) {
  const originalSource = require("fs").readFileSync(
    __dirname + "/html/lesson-confirmation.html",
    "utf8"
  );
  const priceStr = price + "";
  const formattedPrice =
    priceStr.slice(0, priceStr.length - 2) +
    "." +
    priceStr.slice(priceStr.length - 2, priceStr.length);
  let processedSource = await styliner.processHTML(originalSource);
  processedSource = processedSource.replace(
    "{TRANSACTION_NUMBER}",
    transactionId
  );
  processedSource = processedSource.replace("{LESSON_TIME}", meetingTime);
  processedSource = processedSource.replace("{INSTRUCTOR_NAME}", name);
  for (let i = 0; i < 2; i++)
    processedSource = processedSource.replace("{ORDER_TOTAL}", formattedPrice);
  processedSource = processedSource.replace("{ORDER_TOTAL}", formattedPrice);
  processedSource = processedSource.replace("{ZOOM_LINK}", joinURL);
  const mailData = {
    from: "cbarkachi@gmail.com", // sender address
    to: receivers, // list of receivers
    subject: "Get ready for your LiveShare lesson!",
    // text: `Your lesson with ${name} is confirmed for ${meetingTime}! Use this Zoom link to join your call: ${joinURL}`,
    html: processedSource,
    //   attachments: [
    //     {
    //         filename: 'text notes.txt',
    //         path: 'notes.txt
    //     },
    //  ]
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log("error with mail!", err);
    } else {
      console.log("success with mail!", info);
    }
  });
}

app.post("/zoom-meeting/email", (req, res) => {
  console.log(req.body);
  const { receivers, name, meetingTime, price, joinUrl } = req.body;
  console.log(receivers, name, meetingTime);
  emailMeeting(receivers, name, meetingTime, price, joinUrl);
  res.status(200).send({ status: "sent mail lol" });
});

app.post("/zoom-meeting", (req, res) => {
  return cors(req, res, async () => {
    const { userId, instructorName, email, day, timeIndex, price } = req.body;
    console.log(userId, day, timeIndex);
    if (
      await addMeeting(userId, instructorName, email, day, timeIndex, price)
    ) {
      res.status(200).send({ status: "successfully added meeting" });
    } else {
      res.status(500).send({ status: "failed to add meeting" });
    }
  });
});

app.post("/create-payment-intent", (req, res) => {
  return cors(req, res, async () => {
    // console.log("current api key", functions.config().stripe.secret);
    const { day, timeIndex, userId, listingId } = req.body;
    // make sure that instructor is actually available at said time
    // await admin.firestore().collection('users').doc(userId).set({firstName: ""});
    // console.log("user", userId, timeIndex, listingId, day);
    const userRef = admin.firestore().collection("users").doc(userId);
    const email = "cbarkachi@gmail.com";
    const availableDoc = await userRef
      .collection("availability")
      .doc("availability")
      .get();
    if (!availableDoc.exists) {
      res.status(400).send({ err: "Given user does not exist" });
      return;
    }
    const { times } = availableDoc.data();
    if (!times[day]) {
      res
        .status(400)
        .send({ err: "Instructor not available at the selected time" });
      return;
    }
    const { firstName, lastName } = (await userRef.get()).data();
    // const email = decodedToken.email;
    const instructorName = firstName + " " + lastName;
    console.log("i name: ", instructorName, email);
    const listingDoc = await userRef
      .collection("listings")
      .doc(listingId)
      .get();
    const { price, title, category } = listingDoc.data();
    const { stripeAccountId } = (
      await userRef.collection("private").doc("private").get()
    ).data();
    console.log("yer", stripeAccountId);
    // get price and create PaymentIntent
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      metadata: {
        integration_check: "accept_a_payment",
        timeIndex,
        day,
      },
      application_fee_amount: price * 0.15,
      transfer_data: {
        destination: stripeAccountId,
      },
    });
    // TURN THIS INTO A PAYMENTINTENT.SUCCESS WEBHOOK INSTEAD!
    // refresh instructor's access token

    // add to transactions collection
    const transactionSnapshot = await admin
      .firestore()
      .collection("transactions")
      .add({
        date: admin.firestore.FieldValue.serverTimestamp(),
        amount: price,
        duration: 60,
        title,
        category,
        userId,
        listingId,
      });
    console.log(transactionSnapshot.id);

    let addedMeeting;
    if (
      await addMeeting(
        userId,
        instructorName,
        email,
        day,
        timeIndex,
        price,
        transactionSnapshot.id
      )
    ) {
      console.log("added meeting from create payment!");
      addedMeeting = true;
    } else {
      console.log("did not add meeting from create payment!");
      addedMeeting = false;
    }

    // send
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      addedMeeting,
    });
  });
});

app.get("/zoom", (req, res) => {
  return cors(req, res, async () => {
    const { code, userId } = req.query;
    const encodedClientIDAndSecret =
      "OFNPRGNUT19UOVUyUm5QNEtqTWhROkVEN3ZwSTd5SDRMWExWTFdRVmlkOFNUNzVGSHptajY0";
    const retUrl = "https://liveshare-291722.web.app/account-settings/zoom";
    const fetchUrl = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${retUrl}`;
    let refresh_token = null;
    try {
      refresh_token = await axios.post(fetchUrl, null, {
        headers: {
          Authorization: `Basic ${encodedClientIDAndSecret}`,
        },
      });
      admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("private")
        .doc("private")
        .set(
          { zoomRefreshToken: refresh_token.data.refresh_token },
          { merge: true }
        )
        .then(() => {
          console.log("firebase successful");
        })
        .catch((error) => {
          console.log("error", error);
        });
      res.status(200).send({ suc: "successful!" });
    } catch (err) {
      console.log("error fetching", err);
      res.status(500).send({ err: "rip" });
    }
  });
});

function generateAccountLink(accountID) {
  let mainUrl, retUrl;
  if (process.env.FUNCTIONS_EMULATOR) {
    mainUrl = "http://localhost:5001/liveshare-291722/us-central1/app/";
    retUrl = "http://localhost:3000/account-settings/payment";
  } else {
    mainUrl = "https://us-central1-liveshare-291722.cloudfunctions.net/app/";
    retUrl = "https://liveshare-291722.web.app/account-settings/payment";
  }
  return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${mainUrl}onboard-user/refresh`,
      return_url: retUrl,
    })
    .then((link) => link.url);
}

// Set up Algolia.
// The app id and API key are coming from the cloud functions environment, as we set up in Part 1, Step 3.
// Since I'm using develop and production environments, I'm automatically defining
// the index name according to which environment is running. functions.config().projectId is a default
// property set by Cloud Functions.
async function getImageFromUser(userId, wantProfile) {
  const userPath = "images/users/" + userId + "/";
  const bucket = admin.storage().bucket("liveshare-291722.appspot.com");
  const images = await bucket.getFiles(userPath);
  // console.log("im", images);
  // console.log("images: ", images);
  // console.log("images", images);
  for (let img of images) {
    console.log(img.publicUrl());
  }
  return null;
}
const collectionIndexName = process.env.FUNCTIONS_EMULATOR
  ? "listings"
  : "listings";
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

// Create a HTTP request cloud function.
app.get("/send-to-algolia", async (req, res) => {
  // This array will contain all records to be indexed in Algolia.
  // A record does not need to necessarily contain all properties of the Firestore document,
  // only the relevant ones.
  const algoliaRecords = [];

  // Retrieve all documents from the COLLECTION collection.
  const querySnapshot = await admin
    .firestore()
    .collectionGroup("listings")
    .get();

  querySnapshot.docs.forEach(async (doc) => {
    console.log("yo");
    const document = doc.data();
    console.log(doc.ref.parent.parent.id);
    const userImg = await getImageFromUser(doc.ref.parent.parent.id, true);
    // Essentially, you want your records to contain any information that facilitates search,
    // display, filtering, or relevance. Otherwise, you can leave it out.
    const record = {
      objectID: doc.id,
      title: document.title,
      category: document.category,
      description: document.description,
      price: document.price,
      photo: userImg,
    };

    algoliaRecords.push(record);
  });

  // After all records are created, we save them to
  collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
    res.status(200).send("COLLECTION was indexed to Algolia successfully.");
  });
});

exports.collectionOnCreate = functions.firestore
  .document("users/{userId}/listings/{listingId}")
  .onCreate(async (snapshot, context) => {
    await saveDocumentInAlgolia(snapshot);
  });

exports.collectionOnUpdate = functions.firestore
  .document("users/{userId}/listings/{listingId}")
  .onUpdate(async (change, context) => {
    await updateDocumentInAlgolia(change);
  });

exports.collectionOnDelete = functions.firestore
  .document("users/{userId}/listings/{listingId}")
  .onDelete(async (snapshot, context) => {
    await deleteDocumentFromAlgolia(snapshot);
  });
async function saveDocumentInAlgolia(snapshot) {
  const document = snapshot.data();
  const record = {
    objectID: snapshot.id,
    title: document.title,
    category: document.category,
    description: document.description,
  };
  collectionIndex.saveObject(record); // Adds or replaces a specific object.
}

async function updateDocumentInAlgolia(change) {
  const docBeforeChange = change.before.data();
  const docAfterChange = change.after.data();
  await saveDocumentInAlgolia(change.after);
}

async function deleteDocumentFromAlgolia(snapshot) {
  if (snapshot.exists) {
    const objectID = snapshot.id;
    await collectionIndex.deleteObject(objectID);
  }
}

exports.app = functions.https.onRequest(app);
exports.updateReviewStats = functions.firestore
  .document("/users/{userId}/listings/{listingId}/reviews/{reviewId}")
  .onCreate((snap, context) => {
    const reviewData = snap.data().original;
    const { userId, listingId } = context.params;
    const reviewStatsRef = `/users/${userId}/listings/${listingId}/stats`;
    reviewStatsRef
      .set(
        {
          ratings_count: admin.firestore.FieldValue.increment(1),
          ratings_total: admin.firestore.FieldValue.increment(
            reviewData.rating
          ),
        },
        { merge: true }
      )
      .catch((error) => {
        console.log(error);
      });
  });

exports.test = functions.https.onRequest(async (req, res) => {
  const file = await admin
    .storage()
    .bucket("liveshare-291722.appspot.com")
    .file("images/listings/CbrXOenBdrNiYPz0SVV5/0");
  await file.makePublic();
  const url = await file.publicUrl();
});

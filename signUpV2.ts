import express from "express";
const app = express();
import firebaseAdmin from "firebase-admin";
import { getStorage, ref, uploadBytes } from "firebase/storage";

app.listen(3000, () => {
  console.log("app is listening on port:", 3000);
});

const config: any = {
  type: "service_account",
  project_id: "storefire-nodejs-ts",
  private_key_id: "e267efbaa4b818f6905c27f359e331eead83fa2d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCcYB5bd4jtAog5\no2O7jH2pe5M6gfTlXnfbS8m8n17y2XsmX8yLYxwwgslkemGru7IWBHb5bGo12HKN\nMGoO8LjQDHd1UdfXo8pOVrSjWy1Lf4Ugbm2EGyVxjrnAUfBcpuvWEtUamGBrGIP4\npxi1a3ruTwIDL7GQ57f+khKv+MM0pUyPl6xtJlb5ex/hzXx400HnLwrhDNNQsty3\nXl/4KDfLJqSA6Pv/QZOLPx+Gxjgj7KgLZ1HjZFsM3nDMlTCP1cBQRFQKyXYBclqO\nCHLMUAOm9XCSE2v09RGogPj6WtuapWsluFjp4Bk28JHBNxG96xsE0OXk/Zk+dUMS\nXrmC1nzfAgMBAAECggEAHxbXAj1WKjTOK5Np4SAx3Y+1ejTbIPzynFVJgug2gtat\nLrhuHKo0MQrXilPwdimnYsw5cSZWSWVChQKCm3zNaYOI/niqjnNAZenEGRQoAbIV\nIBkESfbxr01+bZd8z5baHWH6H0L7LF+f4UArX+pB8v4fOs3xIguHn6Of9n9hI+aH\nerlZ8r8ACCA1tYmPLIlQHfjCvwo/Mux6h1DHyL7iu4ND32pVb9YcgPp9GJ84fmzd\nPOW3GFFxWLcK8DiTVAnONM8rZKfRM68goT+3wLFeoPiSUzi/zhiRpNGfBNn8csCT\nzd12DD3v+lxD232KUifZdwrCHr8DcsYhi7bbQV3yfQKBgQDW6/CXRP6E/WeSd3nl\n1yPJYLeWBXq6RaPO+7abJvAmoxMk5UCppPDICjfPgD0QuHKifXCAm2Q0GtX/iCAx\nuchZpwXHwHToMz3QqvcQcYqDjD+WkLuu7I+FzJj2oAdrDGbsXTYUGeRhg5TVPkEF\ny8R8cQLyVn5j8H10cgEodueTAwKBgQC6Q4eN8vrhZVWU8gSrTxYvou3CzdtR+Bhj\nIso9ISwNiJX4rv8jV593seSBVE4XNSTG34hWqL7H6oeb/HetKIfmVu7BL3pAOfdt\nk7k8Ep9lq+StFbTFFOKg+4YqrimkoJMvhoRLUligmU991xM1JLD3bS65GsTqHe2B\nZO7csh6Z9QKBgQCsIdHSxb53syElzK0DqViPK/g9nmvaDnaRC0cIYppKx6dIkJhG\nhsUV4iEq/tFpt+CQRZk6V7pchPXKMDNgwCQ3sa7OelTnuEqU+qjgMZ+3ljdDlu3K\nvsqAZgpI1Ii8cvVn74ulc8tXUnR8idy4EKhw5m5uu1mFH5LLFZfZ2cnFEwKBgQC2\nMOeeyVTss5oKntBCYJFq9wtpyMIGY443Kgh30sKsWjWXklSt1T9+bNr+ReA8gxb+\nEBfj7BrwoU8UHNdS4JpNjCrte+swd4K2BBDj2bNgV8rOIrU3MT6cCGsrxD+ncAmI\nKyOsKVfXfx5qEL4Q9VrEKl/RX4XNGoj+UCP0a6XTIQKBgHmMct94lWPQS/dsFBGx\nYj0BDjWNOm41HRBXE2A74iLHj8MHIpi2YDo48So0t9L67DWMViqJXqqFt8LH/Two\nseQ49pe7ie8UQLaj7mFOQh7SFWQW2EUYCeQTp2DTZ4pFXelPj2zHMLW6fND/vWML\nWdOgSyphBZE92DEu+nWQ/T9+\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-7tvhy@storefire-nodejs-ts.iam.gserviceaccount.com",
  client_id: "104768053281706931316",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7tvhy%40storefire-nodejs-ts.iam.gserviceaccount.com",
  storageBucket: "gs://storefire-nodejs-ts.appspot.com",
  databaseURL: "https://storefire-nodejs-ts-default-rtdb.firebaseio.com/",
};

const init = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config),
  databaseURL: config.databaseURL,
});

const firebaseDB = init.database();


interface UserInterface {
  email: string;
  userId: string;
  mobile: string;
}

interface EmailResltInterface {
  key: unknown;
  value: unknown;
}

class signupFirebaseHelper {
  public userWithUserid = firebaseDB.ref("users");

  async Signup(user: UserInterface) {
    try {
      const { key, value }: any = await this.findUserByEmail(user);
      console.log("key", key);

      if (value) {
        console.log("r", value);
        await this.updateUserInfo(key);
        return;
      }

      const userFoundWithPhone = await this.findUserByPhone(user);
      if (userFoundWithPhone) {
        console.log("p", userFoundWithPhone);
        // await this.updateUserInfo(key); return reponse
        return;
      }

      console.log("createRef");
      const createRef = firebaseDB.ref("users").child(user.userId);
      createRef.set(user);
    } catch (error) {
      console.log(`errr=>${error}`);
    }
  }

  private async findUserByEmail(user: UserInterface) {
    return new Promise((resolve, reject) => {
      const { userId, email } = user;
      this.userWithUserid
        .orderByChild("email")
        .equalTo(email)
        .on("value", async (snapshot) => {
          if (snapshot.val()) {
            console.log("keyValueArray", snapshot.toJSON());
            const keyValueArray = Object.entries(snapshot.val());
            console.log("keyValueArray", keyValueArray);
            keyValueArray.map(([key, value]) => {
              resolve({ key, value });
            });
          }
          reject(false);
        });
    });
  }

  private async findUserByPhone(user: UserInterface) {
    return new Promise((resolve, reject) => {
      const { mobile } = user;
      this.userWithUserid
        .orderByChild("mobile")
        .equalTo(mobile)
        .on("value", async (snapshot) => {
          if (snapshot.val()) {
            const keyValueArray = Object.entries(snapshot.val());            
            keyValueArray.map(([key, value]) => {
              resolve(value);
            });
          }
          reject(false);
        });
    });
  }

  private async updateUserInfo(key: string) {
    const updateInforRef = firebaseDB.ref("users/" + key);
    updateInforRef.update({ mobile: "8839591111" });
  }
}

const user = { userId: "2", mobile: "883959224", email: "wwharpr@ggggg" };
const signupFire = new signupFirebaseHelper();
signupFire.Signup(user);

const functions = require("firebase-functions");
const ALGOLIA_APP_ID = "1O2022Z2Q9";
const ALGOLIA_ADMIN_KEY = "728265b922d6fdc29f6449227075fc3a";
const ALGOLIA_INDEX_NAME = "users";
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch').default;

const client = algoliasearch(ALGOLIA_APP_ID, 
ALGOLIA_ADMIN_KEY);
admin.initializeApp();



// Starts a search query whenever a query is requested (by adding one to the `/search/queries`
// element. Search results are then written under `/search/results`.
exports.searchentry = functions.database.ref('users/{UserId}/username').onCreate(
    async (snap, context) => {
      const index = client.initIndex(ALGOLIA_INDEX_NAME);

      const query = snap.val().query;
      const key = snap.key;

      const content = await index.search(query);
      const updates = {
        'users': Date.parse(context.timestamp),
      };
      updates[`users/{UserId}/${key}`] = content;
      return admin.database().ref().update(updates);
    });


    
    exports.indexentry = functions.database.ref('contacts').onWrite(
    async (data, context) => {
      const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME);
      const firebaseObject = {
        text: data.after.val(),
        objectID: context.params.blogid
      };

      await index.saveObject(firebaseObject);
      return data.after.ref.parent.child('last_index_timestamp').
      set(Date.parse(context.timestamp));
    });
    


# Running locally
You need to setup a config/local.js file with the Firebase service account credentials as well as API credentials.  Instructions for generating the service account credentails can be found [here](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments).

The file shoudl look like this.
```js
// config/local.js

module.exports = {
    googleServiceAccountKey: {
        // contents of service account credentials JSON file
    },
    credentials: {
        instagramAccessToken: '<token val>',
    }
}
```
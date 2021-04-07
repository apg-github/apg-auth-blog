const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// TODO change blaze pay plan in Google Firebase and deploy function
exports.addAdminRoleToUser = functions.https.onCall(async (req, res) => {
  try {
    const user = await admin.auth().getUserByEmail(req.email);
    await user.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
    console.log(`Success - ${req.email} has been promoted to admin role}`);
  } catch (e) {
    console.log(e);
  }
});

module.exports = {
  createNewUser:
    "INSERT INTO users(email, password, firstName, lastName, company, token, startDate) VALUES ($1, $2, $3, $4, $5, $6, $7)",
  createAvatar:
    "INSERT INTO avatars(userid, avatarURL, avatarFilePath, token) VALUES ($1, $2, $3, $4)",
  createNotification:
    "INSERT INTO notifications(userid, icon, message, messageDate) VALUES ((SELECT id FROM users WHERE id=$1), $2, $3, $4)",
  deleteAvatar: "DELETE FROM avatars WHERE userid=$1",
  deleteAccountAvatar: "DELETE FROM avatars WHERE userid=$1 AND token=$2",
  getCurrentAvatarPath: "SELECT avatarFilePath FROM avatars WHERE userid=$1",
  getCurrentAvatarPathByIdAndToken:
    "SELECT avatarFilePath FROM avatars WHERE userid=$1 and token=$2",
  getCurrentAvatarURL: "SELECT avatarURL FROM avatars WHERE userid=$1",
  selectAvatarByKey: "SELECT * FROM avatars WHERE key=$1",
  findUserByEmail: "SELECT * FROM users WHERE email=$1",
  setUserAsAdmin: "UPDATE users SET isGod=true WHERE id=$1",
  updateAvatar:
    "UPDATE avatars SET avatarURL=$2, avatarFilePath=$3, token=$3 WHERE userid=$1",
  verifyEmail: "UPDATE users SET verified=true WHERE email=$1",
};

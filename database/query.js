module.exports = app => ({
	createAvatar: () => ("INSERT INTO avatars(userid, avatarURL, avatarFilePath, token) VALUES ($1, $2, $3, $4)"),
	deleteAvatar: () => ("DELETE FROM avatars WHERE userid=$1"),
	deleteAccountAvatar: () => ("DELETE FROM avatars WHERE userid=$1 AND token=$2"),
	getCurrentAvatarPath: () => ("SELECT avatarFilePath FROM avatars WHERE userid=$1"),
	getCurrentAvatarURL: () => ("SELECT avatarURL FROM avatars WHERE userid=$1"),
	updateAvatar: () => ("UPDATE avatars SET avatarURL=$2, avatarFilePath=$3, token=$3 WHERE userid=$1")
})

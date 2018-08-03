module.exports = app => ({
	getCurrentAvatarPath: () => ("SELECT avatarFilePath FROM users WHERE id=$1"),
	updateAvatar: () => ("UPDATE users SET avatarURL=$2, avatarFilePath=$3 WHERE id=$1")
})

module.exports = app => ({
	getCurrentAvatar: () => ("SELECT avatarURL FROM users WHERE id=$1"),
	deleteAvatar: () => ("DELETE FROM users(avatarURL,avatarFilePath) WHERE id=$1 RETURNING *"),
	updateAvatar: () => ("UPDATE users SET avatarURL=$2, avatarFilePath=$3 WHERE id=$1")
})

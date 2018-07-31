module.exports = app => ({
	createAvatar: () => ("INSERT INTO users(avatarURL,avatarFilePath) VALUES ($2, $3) WHERE userid=$1"),
	getCurrentAvatar: () => ("SELECT avatarURL,avatarFilePath FROM users WHERE userid=$1"),
	deleteAvatar: () => ("DELETE FROM users(avatarURL,avatarFilePath) WHERE userid=$1 RETURNING *"),
	updateAvatar: () => ("UPDATE users SET avatarURL=$2 AND avatarFilePath=$3 WHERE userid=$1")
})

module.exports = app => {
	require('./strategies/localLogin');
	require('./strategies/requireLogin')
}

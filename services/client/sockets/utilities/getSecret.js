const sopsDecode = require('sops-decoder');

const getSecret = async({ path }) => {
	try {
		const data = await sopsDecode.decodeFile(path);
		return data[process.env.NODE_ENV];
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getSecret };

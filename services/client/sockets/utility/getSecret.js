const sopsDecode = require('sops-decoder');

const getSecret = async({ path }) => {
	try {
		const data = await sopsDecode.decodeFile(path);
		const environmentalData = data[process.env.NODE_ENV];
		return environmentalData;
	} catch (err) {
		console.error(err);
	}
};

module.exports = { getSecret };

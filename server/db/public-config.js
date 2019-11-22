// Used to Call Environment Variables for Deployment
require('dotenv').config();
const fs = require('fs');
module.exports = {
	mysql: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		connectionLimit: 4,
		ssl: {
            ca: process.env.DB_CA
        }
	},
	s3: {
		accessKey: process.env.ACCESS_KEY,
		secret: process.env.SECRET_ACCESS_KEY
	},
	mongodb: {
		atlasurl: process.env.ATLAS_URL,
		url: process.env.MONGO_URL
	},
	gmaps: {
		key: process.env.GMAPS_KEY
	}
}
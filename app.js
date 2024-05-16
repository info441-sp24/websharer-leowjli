import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper';

const authConfig = {
	auth: {
		clientId: "fb25cb93-f8c4-41d4-aafc-1039c033aee1",
    authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "_GJ8Q~RPR-9s39N3bN7bPX.eHX55dFukDB2WdcJ7",
    redirectUri: "https://websharer.leowjli.me/redirect"
	},

	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

import models from './models.js';
import apiv1Router from './routes/v1/apiv1.js';
import apiv2Router from './routes/v2/apiv2.js';
import apiv3Router from './routes/v3/apiv3.js';
import usersRouter from './routes/v3/controllers/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up p8kn fwlihftrn3oinyswnwd3in4oin",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/users', usersRouter);

app.get('/signin', (req, res, next) => {
	return req.authContext.login({
			postLoginRedirectUri: "/",
	})(req, res, next);
});

app.get('/signout', (req, res, next) => {
	return req.authContext.logout({
			postLogoutRedirectUri: "/",
	})(req, res, next);
});

app.use(authProvider.interactionErrorHandler());

app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);

export default app;

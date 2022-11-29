import express from 'express';
import { checkSurveys } from '../helpers/checkstorage.mjs';
const router = express.Router();

// Home page
router.get('/', checkSurveys, (request, response) => {
  response.render('index.ejs');
});


export { router as index };
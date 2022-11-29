import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
const router = express.Router();

// Get the results for a survey
router.get('/:topic', checkSurveys, async (request, response) => {
  let topic = request.params.topic;
  if (! await surveyManager.surveyExists(topic)) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let results = await surveyManager.getCounts(topic);
    response.render('displayresults.ejs', results);
  }
});

export { router as displayresults };

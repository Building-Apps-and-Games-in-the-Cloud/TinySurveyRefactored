import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
const router = express.Router();

router.post('/', checkSurveys, async (request, response) => {

  let topic = request.body.topic;

  let surveyOptions = await surveyManager.getOptions(topic);

  if (surveyOptions) {
    // Need to check if the survey has already been filled in
    // by this user
    if (request.cookies.completedSurveys) {
      // Got a completed surveys cookie
      // Parse it into a list of completed surveys
      let completedSurveys = JSON.parse(request.cookies.completedSurveys);
      // Look for the current topic in the list
      if (completedSurveys.includes(topic)) {
        // This survey has already been filled in using this browser
        // Just display the results
        let results = await surveyManager.getCounts(topic);
        response.render('displayresults.ejs', results);
      }
      else {
        // Survey not in the cookie
        // enter scores on an existing survey
        let surveyOptions = await surveyManager.getOptions(topic);
        response.render('selectoption.ejs', surveyOptions);
      }
    }
    else {
      // There is no completed surveys cookie
      // enter scores on an existing survey
      let surveyOptions = await surveyManager.getOptions(topic);
      response.render('selectoption.ejs', surveyOptions);
    }
  }
  else {
    // There is no existing survey - need to make a new one
    // Might need to delete the topic from the completed surveys
    if (request.cookies.completedSurveys) {
      // Get the cookie value and parse it 
      let completedSurveys = JSON.parse(request.cookies.completedSurveys);
      // Check if the topic is in the completed ones
      if (completedSurveys.includes(topic)) {
        // Delete the topic from the completedSurveys array
        let topicIndex = completedSurveys.indexOf(topic);
        completedSurveys.splice(topicIndex, 1);
        // Update the stored cookie
        let completedSurveysJSON = JSON.stringify(completedSurveys);
        response.cookie("completedSurveys", completedSurveysJSON);
      }
    }
    // need to make a new survey
    response.render('enteroptions.ejs',
      { topic: topic, numberOfOptions: 5 });
  }
});

export { router as gottopic };

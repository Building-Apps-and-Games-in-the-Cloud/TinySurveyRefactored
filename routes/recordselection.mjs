import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
const router = express.Router();

// Got the selections for a survey
router.post('/:topic', checkSurveys, async (request, response) => {
    let topic = request.params.topic;
  
    let survey = await surveyManager.surveyExists(topic);
  
    if (!survey) {
      response.status(404).send('<h1>Survey not found</h1>');
    }
    else {
      // Start with an empty completed survey list
      let completedSurveys = [];
      if (request.cookies.completedSurveys) {
        // Got a completed surveys cookie
        completedSurveys = JSON.parse(request.cookies.completedSurveys);
      }
      // Look for the current topic in completedSurveys
      if (completedSurveys.includes(topic) == false) {
        // This survey has not been filled in at this browser
        // Get the text of the selected option
        let optionSelected = request.body.selections;
        // Build an increment description
        let incDetails = { topic: topic, option: optionSelected };
        // Increment the count 
        await surveyManager.incrementCount(incDetails);
        // Add the topic to the completed surveys
        completedSurveys.push(topic);
        // Make a JSON string for storage
        let completedSurveysJSON = JSON.stringify(completedSurveys);
        // store the cookie
        response.cookie("completedSurveys", completedSurveysJSON);
      }
      let results = await surveyManager.getCounts(topic);
      response.render('displayresults.ejs', results);
    }
  });
  

  export { router as recordselection };

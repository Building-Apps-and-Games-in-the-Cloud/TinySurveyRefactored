import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
const router = express.Router();

// Got the options for a new survey
router.post('/:topic', checkSurveys, async (request, response) => {
    let topic = request.params.topic;
    let options = [];
    let optionNo = 1;
    do {
      // construct the option name
      let optionName = "option" + optionNo;
      // fetch the text for this option from the request body
      let optionText = request.body[optionName];
      // If there is no text - no more options
      if (optionText == undefined) {
        break;
      }
      // Make an option value 
      let optionValue = { text: optionText, count: 0 };
      // Store it in the array of options
      options.push(optionValue);
      // Move on to the next option
      optionNo++;
    } while (true);
  
    // Build a survey value
    let newSurvey = { topic: topic, options: options };
  
    // save it
    await surveyManager.storeSurvey(newSurvey);
  
    // Render the survey page
    let surveyOptions = await surveyManager.getOptions(topic);
    response.render('selectoption.ejs', surveyOptions);
  });
  
  export { router as setoptions };

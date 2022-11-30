import { SurveyManager } from '../helpers/surveymanagerdb.mjs';

let newSurveyValues = {
  topic: "robspizza",
  options: [
    { text: "margherita", count: 0 },
    { text: "pepperoni", count: 0 },
    { text: "chicken", count: 0 },
    { text: "ham and pineapple", count: 0 },
    { text: "mushroom", count: 0 }
  ]
};

async function optionsTest() {
  let manager = new SurveyManager();
  await manager.init();
  let error = "";
  await manager.storeSurvey(newSurveyValues);
  let exists = await manager.surveyExists("robspizza");

  if (!exists) {
    error = error + "survey not stored\n";
  }
  else {
    let surveyOptions = await manager.getOptions("robspizza");

    if (surveyOptions.topic != "robspizza") {
      error = error + "topic not stored\n";
    }

    if (surveyOptions.options.length != newSurveyValues.options.length) {
      error = error + "options array wrong length\n";
    }

    newSurveyValues.options.forEach(option => {
      let testOption = surveyOptions.options.find(item => item.text == option.text);
      if (testOption == undefined) {
        error = error + "option missing\n";
      }
    });
  }
  await manager.disconnect();
  return error;
}

async function incrementTest() {
  let manager = new SurveyManager();
  await manager.init();
  let error = "";
  await manager.storeSurvey(newSurveyValues);
  await manager.incrementCount({ topic:"robspizza", option:"pepperoni"});
  let surveyOptions = await manager.getCounts("robspizza");

  newSurveyValues.options.forEach(option => {
    let testOption = surveyOptions.options.find(item => item.text == option.text);
    if (testOption == undefined) {
      error = error + "option missing\n";
    }
    else {
      if (testOption.text == "pepperoni") {
        if (testOption.count != 1) {
          error = error + "count increment failed";
        }
      }
      else {
        if (testOption.count != 0) {
          error = error + "incremented wrong count";
        }
      }
    }
  });
  await manager.disconnect();
  return error;
}

test('Store and retrieve options', async () => {
  const result = await optionsTest();
  expect(result).toBe("");
});

test('Increment a count', async () => {
  const result = await incrementTest();
  expect(result).toBe("");
});

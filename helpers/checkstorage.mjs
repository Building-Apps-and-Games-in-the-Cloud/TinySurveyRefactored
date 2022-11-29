import { surveysLoaded } from '../tinysurvey.mjs';

function checkSurveys(request, response, next) {
    if (surveysLoaded) {
        next();
    }
    else {
        response.statusCode = 500;
        response.render('error.ejs');
    }
}

export { checkSurveys };

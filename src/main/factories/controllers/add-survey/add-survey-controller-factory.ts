import { makeDbAddSurvey } from './../../usecases/db-survey/db-add-survey-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { IController } from '../../../../presentation/protocols';
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): IController => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};

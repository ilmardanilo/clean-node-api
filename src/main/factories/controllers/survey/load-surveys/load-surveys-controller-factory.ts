import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-surveys-factory';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { IController } from '../../../../../presentation/protocols';
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller';

export const makeLoadSurveysController = (): IController => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};

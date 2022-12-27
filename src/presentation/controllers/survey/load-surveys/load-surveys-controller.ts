import { noContent, ok, serverError } from '../../../helpers/http/http-helper';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  ILoadSurveys,
} from './load-survey-controller-protocols';

export class LoadSurveysController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      if (!surveys.length) {
        return noContent();
      }
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
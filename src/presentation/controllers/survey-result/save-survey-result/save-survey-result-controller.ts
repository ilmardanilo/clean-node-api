import { ILoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest, HttpResponse, IController } from '../../../protocols';

export class SaveSurveyResultController implements IController {
  constructor(private readonly loadSurveyById: ILoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return null;
  }
}

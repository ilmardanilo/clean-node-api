import { ILoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id';
import { InvalidParamError } from '../../../errors';
import { forbidden } from '../../../helpers/http/http-helper';
import { HttpRequest, HttpResponse, IController } from '../../../protocols';

export class SaveSurveyResultController implements IController {
  constructor(private readonly loadSurveyById: ILoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId
    );
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return null;
  }
}

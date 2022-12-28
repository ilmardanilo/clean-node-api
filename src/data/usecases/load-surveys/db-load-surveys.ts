import { ILoadSurveys } from './../../../domain/usecases/load-surveys';
import { SurveyModel } from '../../../domain/models/survey';
import { ILoadSurveysRepository } from './../../protocols/db/survey/load-surveys-repository';

export class DbLoadSurveys implements ILoadSurveys {
  constructor(private readonly loadSurveysRepository: ILoadSurveysRepository) {}
  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}

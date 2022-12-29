import { SurveyModel } from '../../../domain/models/survey';
import { ILoadSurveyById } from '../../../domain/usecases/load-survey-by-id';
import { ILoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyById implements ILoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}

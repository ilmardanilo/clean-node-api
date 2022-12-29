import { SurveyModel } from '../models/survey';

export interface ILoadSurveyById {
  loadById(id: string): Promise<SurveyModel>;
}

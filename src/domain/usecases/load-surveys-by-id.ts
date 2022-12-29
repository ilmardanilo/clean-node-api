import { SurveyModel } from '../models/survey';

export interface ILoadSurveysById {
  loadById(id: string): Promise<SurveyModel>;
}

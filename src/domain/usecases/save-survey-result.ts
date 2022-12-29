import { SurveyResultModel } from './../models/survey-result';

export type SaveSurveyResultModel = {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
};

export interface ISaveSurveyResult {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}

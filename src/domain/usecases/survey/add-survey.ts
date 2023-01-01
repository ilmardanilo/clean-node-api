import { SurveyAnswerModel } from '../../models/survey';

export type AddSurveyParams = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};

export interface IAddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}

import { ISaveSurveyResultRepository } from '../../../../data/protocols/db/survey-result/save-survey-result-repository';
import {
  SaveSurveyResultModel,
  SurveyResultModel,
} from '../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository
  implements ISaveSurveyResultRepository
{
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );

    const result: any = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    return result.value && MongoHelper.map(result.value);
  }
}

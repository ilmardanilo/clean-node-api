import { ILoadSurveysRepository } from './../../../../data/protocols/db/survey/load-surveys-repository';
import { IAddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyModel } from '../../../../domain/models/survey';

export class SurveyMongoRepository
  implements IAddSurveyRepository, ILoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const surveys: any = await surveyCollection.find().toArray();

    return surveys;
  }
}

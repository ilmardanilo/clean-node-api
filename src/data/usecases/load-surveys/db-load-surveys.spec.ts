import { DbLoadSurveys } from './db-load-surveys';
import { ISurveyModel } from '../../../domain/models/survey';
import { ILoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';

const makeFakeSurveys = (): ISurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];
};

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: ILoadSurveysRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

const makeLoadSurveysRepository = (): ILoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements ILoadSurveysRepository {
    async loadAll(): Promise<ISurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

describe('DbLoadSurveys Usecase', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});

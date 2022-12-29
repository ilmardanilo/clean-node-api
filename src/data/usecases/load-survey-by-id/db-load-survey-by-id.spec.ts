import { DbLoadSurveyById } from './db-load-survey-by-id';
import { ILoadSurveyByIdRepository } from './../../protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '../../../domain/models/survey';
import MockDate from 'mockdate';

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  };
};

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });
});

import { DbAddSurvey } from './db-add-survey';
import {
  AddSurveyParams,
  IAddSurveyRepository,
} from './db-add-survey-protocols';
import MockDate from 'mockdate';

const mockSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const mockAddSurveyRepository = (): IAddSurveyRepository => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: IAddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = mockSurveyParams();
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.add(mockSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});

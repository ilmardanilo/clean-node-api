import { ISaveSurveyResultRepository } from '../../../protocols/db/survey-result/save-survey-result-repository';
import {
  SaveSurveyResultParams,
  SurveyResultModel,
} from './db-save-survey-result-protocols';
import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';

const makeFakeSaveSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: ISaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = makeFakeSaveSurveyResultData();
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test('Should return survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSaveSurveyResultData());

    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = sut.save(makeFakeSaveSurveyResultData());
    await expect(promise).rejects.toThrow();
  });
});

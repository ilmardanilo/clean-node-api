import { sign } from 'jsonwebtoken';
import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockAccessToken = async (): Promise<string> => {
  const password = await hash('123', 12);
  const { insertedId } = await accountCollection.insertOne({
    name: 'Ilmar',
    email: 'ilmar@mail.com',
    password,
  });
  const id = insertedId.toString();
  const accessToken = sign(id, env.jwtSecret);
  await accountCollection.updateOne(
    { _id: insertedId },
    {
      $set: {
        accessToken,
      },
    }
  );

  return accessToken;
};

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:survey_id/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403);
    });

    test('Should return 200 on save survey result with accessToken', async () => {
      const { insertedId } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'Answer 1',
          },
          {
            answer: 'other_answer',
          },
        ],
        date: new Date(),
      });
      const accessToken = await mockAccessToken();
      await request(app)
        .put(`/api/surveys/${insertedId}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 1' })
        .expect(200);
    });
  });
});

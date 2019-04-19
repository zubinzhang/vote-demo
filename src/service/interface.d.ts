import { ICandidateAttribute, IUserAttribute, IVoteAttribute } from '../model/interface';

export interface ILoginParam {
  email: string;
  password: string;
}

/**
 * @description User-Service abstractions
 */
export interface IUserService {
  getAllUser(): Promise<IUserAttribute[]>;
  createUser(user: IUserAttribute): Promise<number>;
  login(value: ILoginParam): Promise<number>;
  checkUserActive(userId: number): Promise<void>;
  updateUser(values: IUserAttribute, userId: number): Promise<number>;
}

export interface IGetAllVotesResult {
  rows: IVoteAttribute[];
  count: number;
}

/**
 * @description Vote-Service abstractions
 */
export interface IVoteService {
  createVote(vote: IVoteAttribute): Promise<IVoteAttribute>;
  updateVote(vote: IVoteAttribute, voteId: number): Promise<boolean>;
  isStart(voteId: number): Promise<boolean>;
  getAllVotes(limit: number, offset: number): Promise<IGetAllVotesResult>;
  getVoteById(id: number): Promise<IVoteAttribute>;
}

/**
 * @description Vote-Service abstractions
 */
export interface ICandidateService {
  addCandidates(candidateList: ICandidateAttribute[]): Promise<ICandidateAttribute[]>;
  removeCandidate(candidateId: number): Promise<boolean>;
  updateCandidate(values: ICandidateAttribute, candidateId: number): Promise<number>;
  getCandidateById(id: number): Promise<ICandidateAttribute>;
  getCandidatesByVoteId(voteId): Promise<ICandidateAttribute[]>;
  getCandidateCountByVoteId(voteId: number): Promise<number>;
}

export interface IBallotParam {
  ballotTime: Date;
  userId: number;
  voteId: number;
  candidateList: number[];
}

/**
 * @description Ballot-Service abstractions
 */
export interface IBallotService {
  ballot(value: IBallotParam): Promise<void>;
}

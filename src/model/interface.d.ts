// tslint?:disable
import * as Sequelize from 'sequelize';

// table:user
export interface IUserAttribute {
  id?: number;
  name?: string;
  password?: string;
  email?: string;
  status?: number;
}
export interface IUserInstance extends Sequelize.Instance<IUserAttribute>, IUserAttribute {}
export interface IUserModel extends Sequelize.Model<IUserInstance, IUserAttribute> {}

// table:vote
export interface IVoteAttribute {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}
export interface IVoteInstance extends Sequelize.Instance<IVoteAttribute>, IVoteAttribute {}
export interface IVoteModel extends Sequelize.Model<IVoteInstance, IVoteAttribute> {}

// table:candidate
export interface ICandidateAttribute {
  id?: number;
  name?: string;
  votes?: number;
  voteId?: number;
}
export interface ICandidateInstance
  extends Sequelize.Instance<ICandidateAttribute>,
    ICandidateAttribute {}
export interface ICandidateModel extends Sequelize.Model<ICandidateInstance, ICandidateAttribute> {}

// table:ballot
export interface IBallotAttribute {
  id?: number;
  ballotTime?: Date;
  userId?: number;
  voteId?: number;
}
export interface IBallotInstance extends Sequelize.Instance<IBallotAttribute>, IBallotAttribute {}
export interface IBallotModel extends Sequelize.Model<IBallotInstance, IBallotAttribute> {}

// table:ballot_box
export interface IBallotBoxAttribute {
  id?: number;
  ballotId?: number;
  candidateId?: number;
}
export interface IBallotBoxInstance
  extends Sequelize.Instance<IBallotBoxAttribute>,
    IBallotBoxAttribute {}
export interface IBallotBoxModel extends Sequelize.Model<IBallotBoxInstance, IBallotBoxAttribute> {}

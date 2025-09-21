import mongoose from 'mongoose';
export interface IVote {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    voteType: 'up' | 'down';
    createdAt: Date;
}
declare const _default: mongoose.Model<IVote, {}, {}, {}, mongoose.Document<unknown, {}, IVote, {}, {}> & IVote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Vote.d.ts.map
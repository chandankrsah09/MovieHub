import mongoose from 'mongoose';
export interface IMovie {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    genre: string;
    releaseYear: number;
    director: string;
    addedBy: mongoose.Types.ObjectId;
    upvotes: number;
    downvotes: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMovie, {}, {}, {}, mongoose.Document<unknown, {}, IMovie, {}, {}> & IMovie & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Movie.d.ts.map
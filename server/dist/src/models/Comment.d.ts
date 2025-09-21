import mongoose from 'mongoose';
export interface IComment {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, {}> & IComment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Comment.d.ts.map
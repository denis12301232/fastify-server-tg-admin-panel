import type { IToken } from '@/types'
import { Schema, model } from 'mongoose'


const TokenSchema = new Schema<IToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
    }
});

export default model<IToken>('Token', TokenSchema);
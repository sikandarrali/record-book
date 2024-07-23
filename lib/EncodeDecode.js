// Encode to Base64
export const EncodeUserId = (userId) => {
    return Buffer.from(userId.toString()).toString('base64');
};
// Decode from Base64
export const DecodeUserId = (encodedUserId) => {
    return Buffer.from(encodedUserId, 'base64').toString('ascii');
};
import bcrypt from 'bcrypt';
export async function hashPassword(password) {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
}
export async function checkPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}

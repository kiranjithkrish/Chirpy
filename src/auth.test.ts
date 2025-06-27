import { describe, it, expect, beforeAll } from "vitest";
import { extractBearerToken, makeJWT, validateJWT } from "./auth";
import { BadRequest } from "./api/errors";


describe("JWT Token Logic", () => {
    let signedJWTKiran: string;
    let signedJWTManji: string;
    let signedJWTExpiresIn0: string;
    const kiranSecret = "kiran_secret";
    const manjiSecret = "manji_secret";
    const kiranUserdId = 'kiran';
    const manjiUserId = 'manji';
    
  beforeAll(async () => {
    signedJWTKiran = makeJWT(kiranUserdId, 1000, kiranSecret)
    signedJWTExpiresIn0 = makeJWT(kiranUserdId, 0, kiranSecret)
    signedJWTManji = makeJWT(manjiUserId, 1000, manjiSecret )
  });

  it("should return correct user id for the correct signed jwt token", async () => {
    const resultKiran = validateJWT(signedJWTKiran, kiranSecret); 
    const resultManji = validateJWT(signedJWTManji, manjiSecret); 
    expect(resultKiran).toBe(kiranUserdId);
    expect(resultManji).toBe(manjiUserId);
  });

  it("should throw error when the token has expired", async () => {
    expect(() => validateJWT(signedJWTExpiresIn0, kiranSecret)).throw('JWT token has expired');
  })
  it("should throw error when wrong secret key is provided", () => {
    expect(() => validateJWT(signedJWTKiran, "wrong_secret")).throw('Invalid JWT signature')
  })
});

describe('GetBearerToken', () => {
  it("should extract token from a valid authorization header", () => {
    const token = "my_secret_token"
    const header = `Bearer ${token}`
    expect(extractBearerToken(header)).toBe(token)
  })

   it("should extract token from a valid authorization header with extra data", () => {
    const token = "my_secret_token"
    const header = `Bearer ${token} more info`
    expect(extractBearerToken(header)).toBe(token)
  })

   it("should throw error from a invalid authorization header", () => {
    const token = "my_secret_token"
    const header = `Berer ${token}`
    expect(() => extractBearerToken(header)).toThrow(BadRequest)
  })

  it("should throw error for empty header", () => {
    const token = "my_secret_token"
    const header = ``
    expect(() => extractBearerToken(header)).toThrow(BadRequest)
  })
})
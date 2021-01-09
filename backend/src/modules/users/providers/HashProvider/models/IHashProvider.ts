export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  conpareHash(payload: string, hashed: string): Promise<boolean>;
}

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { environment } from '../config/environment';
import { IUser } from '../database/models/interfaces/user.interfaces';

export class UserAuth {
  /**
   * @description hash user password
   * @param  {variable} password The password to be hashed
   * @returns {string} Returns a encrypted password
   */
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static compareHashedPasswords(
    unHashedPassword: string,
    hashedPassword: string,
  ): boolean {
    return bcrypt.compareSync(unHashedPassword, hashedPassword);
  }

  /**
   * @description compare hashed password and entered password
   * @param  {variable} hashedPass The hashed password
   * @param  {variable} enteredPwd The actual user password
   * @returns {boolean} Returns true if password match
   */
  static unhashPassword(enteredPwd: string, hashedPwd: string): boolean {
    return bcrypt.compareSync(enteredPwd, hashedPwd);
  }

  /**
   * @description Take user data and return a token
   * @param {object} user IUser
   * @returns {string} Returns a user token
   */
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      environment.jwtSecretKey,
      { expiresIn: '30d' },
    );
  }
}

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { environment } from '../config/environment';
import { IUser } from '../database/models/interfaces/user.interfaces';
import { UserService } from '../api/user/user.service';

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

  static async generateUsername(firstName: string, lastName: string) {
    let user: IUser;
    let username: string;
    username = firstName.toLowerCase().concat('.', lastName.toLowerCase());

    user = await UserService.findOne({ where: { username } });

    while (user) {
      username = user.username.concat(
        '_',
        `${this.generateRandomNumber(10000)}`,
      );

      user = await UserService.findOne({ where: { username } });
    }

    return username;
  }

  static generateRandomString = () =>
    Math.random().toString(36).substring(2, 15);

  static generateRandomNumber = (max: number = 1000) =>
    Math.floor(Math.random() * max) + 1;
}

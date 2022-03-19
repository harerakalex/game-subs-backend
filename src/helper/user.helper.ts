import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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

  static async generateTemporyPassword() {
    return this.generateRandomString(6);
  }

  static generateRandomString(length: number = 5) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.trim();
  }

  static generateRandomNumber = (max: number = 1000) =>
    Math.floor(Math.random() * max) + 1;

  static async convertBtcToUsd(btc: number) {
    const exchangeRate = await axios.get('https://blockchain.info/ticker');

    const convert = btc * exchangeRate.data.USD.last;
    return parseFloat(convert.toFixed(3));
  }
}

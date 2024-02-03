import {
  Logger,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { addTokenDto } from './dto';
import { EModelName, ETokenType, TTokenModel, TUser } from 'src/shared/types';
import { UserService } from '../user/service';

export interface UserExistence {
  exists: boolean;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(EModelName.TOKEN) private tokenModel: Model<TTokenModel>,
    private readonly userService: UserService,
  ) {}

  async signIn(data: Omit<TUser, 'created'>) {
    // You can aslo check if the user does not already exist
    const toCreate = {
      ...data,
      created: new Date(),
    };

    toCreate.password = await this.encryptPassword(toCreate.password);

    const user = await this.userService.create(toCreate);
    const tokens = await this.generateAuthTokens(user._id);

    // do not send the password
    user.password = '';

    return { user, tokens };
  }

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userService.findByOne({ username });

    if (!user) {
      throw new UnauthorizedException('Login or password incorrect!');
    }

    if (!this.isPasswordMatch(password, user.password)) {
      throw new UnauthorizedException('Login or password incorrect!');
    }

    const tokens = await this.generateAuthTokens(user._id);

    // do not send the password
    user.password = '';

    return { user, tokens };
  }

  private isPasswordMatch(password: string, storedPassword: string) {
    return bcrypt.compareSync(password, storedPassword);
  }

  private async encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);
    return hashedPass;
  }

  /**
   * get a new access and refresh token
   * @param refreshToken a valid refresh token
   * @returns
   */
  async refreshToken(refreshToken: string) {
    try {
      const tokenDoc = await this.verifyToken(refreshToken, ETokenType.REFRESH);
      const tokens = await this.generateAuthTokens(tokenDoc.user);
      return {
        session: tokens.access.token,
        refresh: tokens.refresh.token,
      };
    } catch (error) {
      this.logger.error('from refresh token', error);
      throw new ForbiddenException('Invalid refresh token sent!');
    }
  }

  private async addTokenToDb(data: addTokenDto) {
    const newToken = await new this.tokenModel(data);
    return newToken.save();
  }

  private async removeTokenFromDb(userId: string) {
    await this.tokenModel.deleteMany({ user: userId.toString() });
  }

  private generateToken(
    userId: string,
    expires: moment.Moment,
    type: ETokenType,
  ): string {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  private async storeAndRemoveToken(
    token: string,
    userId: string,
    expires: string,
  ) {
    // TODO - remove all unsed tokens
    // ? maybe create a type which can be 'extension' | "web" | "mobile"
    // await this.removeTokenFromDb(userId);

    await this.addTokenToDb({
      expires,
      token,
      type: ETokenType.REFRESH,
      user: userId,
    });
  }

  private async generateAuthTokens(userId: string) {
    const accessTokenExpires = moment().add(
      process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      'minutes',
    );
    const accessToken = this.generateToken(
      userId,
      accessTokenExpires,
      ETokenType.ACCESS,
    );

    const refreshTokenExpires = moment().add(
      process.env.JWT_REFRESH_EXPIRATION_DAYS,
      'days',
    );
    const refreshToken = this.generateToken(
      userId,
      refreshTokenExpires,
      ETokenType.REFRESH,
    );

    this.storeAndRemoveToken(
      refreshToken,
      userId,
      refreshTokenExpires.toString(),
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  private async verifyToken(token: string, type: ETokenType) {
    let tokenDoc: any = {};
    let payload;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT not provided');
      }
      if (!token) {
        throw new Error('Token not provided');
      }
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error: any) {
      throw new Error('Invalid token');
    }
    if (typeof payload !== 'string' && payload.type !== type) {
      throw new Error('Invalid token');
    }
    if (type === ETokenType.ACCESS) {
      Object.assign(tokenDoc, {
        user: payload.sub,
        token,
        type,
      });
    } else {
      const storedToken = await this.tokenModel.findOne({
        token,
        type,
        user: payload.sub,
      });
      tokenDoc = storedToken;
      if (storedToken && [ETokenType.VERIFY_EMAIL].includes(storedToken.type)) {
        await this.tokenModel.findByIdAndDelete(storedToken._id);
      }
    }
    if (!tokenDoc) {
      if (type !== ETokenType.ACCESS) {
        throw new Error('No Token found');
      }
      throw new Error('Forbidden');
    }
    return tokenDoc;
  }
}

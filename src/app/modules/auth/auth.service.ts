import { randomBytes, scryptSync } from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import appConfigs from "../../configs/app.configs";
import { BaseService } from "../../common/base/service";
import { UserRepository } from "../user/user.repository";
import { EUserGender, EUserRole } from "../user/user.entity";
import { AppError } from "../../common/errors/app.error";
import { HTTPStatuses } from "../../common/constants/httpStatuses";

const [JWT_SECRET, JWT_EXPIRES_IN] = appConfigs.get([
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
]);

class AuthService extends BaseService {
  protected repos: {
    userRepository: UserRepository;
  };

  constructor(userRepository: UserRepository) {
    super();

    this.repos = {
      userRepository,
    };
  }

  public signToken = (data: any, secret: Secret, options: SignOptions = {}) => {
    return jwt.sign(data, secret, options);
  };

  public verifyToken = (
    token: string,
    secret: Secret,
    options: SignOptions = {}
  ) => {
    try {
      jwt.verify(token, secret, options);
    } catch {
      return false;
    }
    return true;
  };

  public decodeToken = (token: string) => {
    return jwt.decode(token, { complete: true });
  };

  public generateRandomToken = (byteLength = 32) => {
    const buffer = randomBytes(byteLength);

    return buffer.toString("hex");
  };

  public hashWithSalt = (
    source: string,
    salt = this.generateRandomToken(8)
  ) => {
    const sourceHash = scryptSync(source, salt, 64);

    return {
      hash: sourceHash.toString("hex"),
      salt,
    };
  };

  public verifyHashWithSalt = (source: string, salt: string, hash: string) => {
    const sourceHash = scryptSync(source, salt, 64);

    return sourceHash.toString("hex") === hash;
  };

  public signIn = async (email: string, password: string) => {
    const wrongCredentialsError = new AppError("Wrong credentials", {
      status: HTTPStatuses.BAD_REQUEST,
    });

    const user = await this.repos.userRepository.getOne({ email });

    if (!user) throw wrongCredentialsError;

    const isPasswordValid = this.verifyHashWithSalt(
      password,
      user.passwordSalt,
      user.password
    );

    if (!isPasswordValid) throw wrongCredentialsError;

    const token = this.signToken(
      {
        uid: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return token;
  };

  public signUp = async (data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: EUserGender;
    birthDate?: Date;
    email: string;
    username: string;
    password: string;
    userAgent: string;
  }) => {
    const {
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
      username,
      email,
      password,
      userAgent,
    } = data;

    const existingUser = await this.repos.userRepository.getOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });

    if (existingUser) {
      throw new AppError("User with email or username already exists", {
        status: HTTPStatuses.CONFLICT,
      });
    }

    const { hash, salt } = this.hashWithSalt(password);
    const user = await this.repos.userRepository.create({
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
      username,
      email,
      password: hash,
      passwordSalt: salt,
      role: EUserRole.USER,
      isBlocked: false,
      balance: 0,
      userAgent,
    });

    const token = this.signToken(
      {
        uid: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return token;
  };
}

export { AuthService };

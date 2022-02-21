import {JwtToken} from "models/jwt-token";
import {TempToken} from "models/temp-token";
import {UserEmail} from "models/user-email";
import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {v4} from "uuid";

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @OneToMany(type => UserEmail, email => email.user, {
    eager: true
  })
  emails: UserEmail[]

  @OneToMany(type => JwtToken, token => token.user, {
    eager: true
  })
  jwtTokens: JwtToken[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date

  lastJwtToken() {
    return this.jwtTokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
  }

  mainEmail(): UserEmail {
    const email = this.emails.filter(email => email.main)[0]

    if (!email) {
      throw new Error(`There is no main email`)
    }

    return email
  }

  tokenById(id: string) {
    return this.mainEmail().tempTokens.filter(token => token.id === id)[0]
  }

  lastTempToken() {
    const mainEmail = this.mainEmail()

    if (!mainEmail) {
      throw new Error("No main email")
    }

    return mainEmail.lastTempToken()
  }

  static async register(email: string) {
    const user = new User()
    user.id = v4()
    user.role = UserRole.USER

    const userEmail = await UserEmail.createByUser(email, user)
    await userEmail.save()

    user.emails.push(userEmail)

    return user
  }

  async createNewToken() {
    await this.mainEmail().createNewToken()
  }

  async logout() {
    const jwtToken = this.lastJwtToken()
    jwtToken.logout()
    await jwtToken.save()
  }

  async loginByTempToken(token: TempToken) {
    if (token.used) {
      throw new Error(``)
    }

    this.mainEmail().activate()
    await this.mainEmail().save()

    const newJwtToken = JwtToken.createNew(this)
    await newJwtToken.save()

    this.jwtTokens.push(newJwtToken)
  }
}

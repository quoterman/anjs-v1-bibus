import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {UserEmail} from "models/user-email";
import {TempToken} from "models/temp-token";
import {JwtToken} from "models/jwt-token";

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

  @OneToMany(type => UserEmail, email => email.user)
  emails: UserEmail[]

  @OneToMany(type => TempToken, token => token.user)
  tempTokens: TempToken[]

  @OneToMany(type => JwtToken, token => token.user)
  jwtTokens: JwtToken[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date
}

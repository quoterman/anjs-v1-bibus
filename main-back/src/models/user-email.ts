import {TempToken} from "models/temp-token";
import {User} from "models/user";
import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
export class UserEmail extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('boolean')
  main: boolean;

  @Column('boolean')
  activated: boolean;

  @Column('text')
  value: string;

  @ManyToOne(type => User, user => user.emails, {
    eager: true
  })
  user: User

  @OneToMany(type => TempToken, token => token.userEmail, {
    eager: true
  })
  tempTokens: TempToken[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date

  lastTempToken(): TempToken | undefined {
    return this.tempTokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
  }

  static async createByUser(email: string, user: User) {
    const userEmail = new UserEmail()
    userEmail.main = true
    userEmail.activated = false
    userEmail.user = user
    userEmail.value = email

    const tempToken = TempToken.createByUser(
      userEmail,
    )
    await tempToken.save()

    userEmail.tempTokens.push(tempToken)

    return userEmail
  }

  static async checkEmailExist(email: string): Promise<boolean> {
    const userEmail = await UserEmail.find({
      value: email
    })

    return !!userEmail.length
  }

  async createNewToken() {
    const token = TempToken.createByUser(this)
    await token.save()
    this.tempTokens.push(token)
  }

  activate() {
    this.activated = true
  }
}

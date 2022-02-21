import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "models/user";


@Entity()
export class JwtToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('boolean')
  used: boolean;

  @ManyToOne(type => User, user => user.jwtTokens)
  user: User

  @Column({ type: 'timestamp', nullable: true })
  logoutDate: Date

  @Column({ type: 'timestamp', nullable: true })
  banDate: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date
}

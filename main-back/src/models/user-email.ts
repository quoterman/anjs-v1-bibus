import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "models/user";

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

  @ManyToOne(type => User, user => user.emails)
  user: User

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date
}

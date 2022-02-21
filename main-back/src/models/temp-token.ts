import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {User} from "models/user";


@Entity()
export class TempToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('boolean')
  used: boolean;

  @ManyToOne(type => User, user => user.email)
  user: User

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date
}

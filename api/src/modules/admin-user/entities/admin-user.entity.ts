// ============================================
// ENTIDADE: USUÁRIOS ADMIN (GESTÃO)
// ============================================
// Representa usuários do sistema de gestão (admin, gerente, etc.)
// Pizzaria Massa Nostra
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // CORRIGIDO: Campo password_hash (não password)
  @Column({ select: false, name: 'password' })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}

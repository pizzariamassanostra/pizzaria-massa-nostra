/**
 * ============================================
 * ENTIDADE: USER_ROLE (USUÁRIO-PAPEL)
 * ============================================
 * Tabela de relacionamento N:N entre usuários e roles
 *
 * Permite:
 * - Um usuário ter múltiplos roles
 * - Controlar quando o role foi atribuído
 * - Rastrear quem atribuiu o role
 *
 * @module RBAC
 * @author Lucas IT Dias
 * @date 2025-11-26
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUser } from '../../admin-user/entities/admin-user.entity';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID do usuário
   */
  @Column({ name: 'user_id' })
  user_id: number;

  /**
   * ID do role
   */
  @Column({ name: 'role_id' })
  role_id: number;

  /**
   * Usuário que recebeu o role
   */
  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: AdminUser;

  /**
   * Role atribuído
   */
  @ManyToOne(() => Role, (role) => role.user_roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  /**
   * Quem atribuiu este role
   */
  @Column({ name: 'assigned_by', nullable: true })
  assigned_by: number;

  /**
   * Data de atribuição
   */
  @CreateDateColumn()
  created_at: Date;
}

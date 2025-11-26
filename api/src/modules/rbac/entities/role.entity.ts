/**
 * ============================================
 * ENTIDADE: ROLE (PAPEL/FUNÇÃO)
 * ============================================
 * Define os papéis que podem ser atribuídos aos usuários
 *
 * Relacionamentos:
 * - N:N com Permission (role_permissions)
 * - 1:N com AdminUser (user_roles)
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
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nome único do role
   * Exemplo: super_admin, manager, cook
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name: RoleEnum;

  /**
   * Nome de exibição
   * Exemplo: "Super Administrador", "Gerente", "Cozinheira"
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  display_name: string;

  /**
   * Descrição do papel
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  /**
   * Nível hierárquico (1 = maior autoridade)
   */
  @Column({
    type: 'int',
    default: 10,
  })
  level: number;

  /**
   * Role ativo?
   */
  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  /**
   * Role protegido (não pode ser deletado)
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  is_protected: boolean;

  /**
   * Permissões associadas ao role
   */
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  /**
   * Usuários com este role
   */
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  user_roles: UserRole[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

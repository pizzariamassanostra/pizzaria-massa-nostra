// ============================================
// ENTIDADE: BORDAS DE PIZZA
// ============================================
// Tipos de borda (Tradicional, Vulcão, Trançada)
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

@Entity('pizza_crusts')
export class PizzaCrust {
  @PrimaryGeneratedColumn()
  id: number;

  // Nome da borda
  @Column({ length: 100 })
  name: string;

  // Slug (tradicional, vulcao, trancada)
  @Column({ length: 100, unique: true })
  slug: string;

  // Descrição
  @Column({ type: 'text', nullable: true })
  description: string;

  // Valor adicional (0 para tradicional)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_modifier: number;

  // Status: active, inactive
  @Column({ length: 20, default: 'active' })
  status: string;

  // Ordem de exibição
  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}



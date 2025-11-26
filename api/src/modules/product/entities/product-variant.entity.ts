// ============================================
// ENTIDADE: VARIAÇÕES DE PRODUTO
// ============================================
// Tamanhos e preços (P/M/G para pizzas)
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  // Produto pai
  @Column()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Tamanho: small, medium, large, unique
  @Column({ length: 50 })
  size: string;

  // Label exibido: "Pequena - 4 pedaços"
  @Column({ length: 100 })
  label: string;

  // Preço desta variação
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Número de pedaços (pizzas)
  @Column({ nullable: true })
  servings: number;

  // Ordem de exibição
  @Column({ default: 0 })
  sort_order: number;

  // Status: active, inactive
  @Column({ length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}

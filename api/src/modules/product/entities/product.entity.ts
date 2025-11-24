// ============================================
// ENTIDADE: PRODUTOS (BASE)
// ============================================
// Produto base do cardápio (pizza, bebida, etc.)
// Pizzaria Massa Nostra
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Categoria do produto (Pizzas Salgadas, Bebidas, etc.)
  @Column()
  category_id: number;

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  // Nome do produto (ex: "Pizza Margherita")
  @Column({ length: 255 })
  name: string;

  // Slug para URL (ex: "pizza-margherita")
  @Column({ length: 255, unique: true })
  slug: string;

  // Descrição completa
  @Column({ type: 'text', nullable: true })
  description: string;

  // URL da imagem (Cloudinary)
  @Column({ type: 'text', nullable: true })
  image_url: string;

  // Tipo: simple (bebida, 1 preço), pizza (vários tamanhos)
  @Column({ length: 50, default: 'simple' })
  type: string;

  // Status: active, inactive, out_of_stock
  @Column({ length: 20, default: 'active' })
  status: string;

  // Ordem de exibição
  @Column({ default: 0 })
  sort_order: number;

  // Variações (tamanhos P/M/G com preços)
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}

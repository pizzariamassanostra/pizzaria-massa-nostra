// ============================================
// SERVIÇO: AVALIAÇÕES DE FORNECEDORES
// ============================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEvaluation } from '../entities/supplier-evaluation.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierEvaluationDto } from '../dtos/supplier-evaluation.dto';

@Injectable()
export class SupplierEvaluationService {
  constructor(
    @InjectRepository(SupplierEvaluation)
    private readonly evaluationRepo: Repository<SupplierEvaluation>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async create(
    dto: SupplierEvaluationDto,
    evaluatedBy: number,
  ): Promise<SupplierEvaluation> {
    const supplier = await this.supplierRepo.findOne({
      where: { id: dto.supplier_id },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor #${dto.supplier_id} não encontrado`,
      );
    }

    const overallRating =
      (dto.quality_rating +
        dto.delivery_rating +
        dto.price_rating +
        dto.service_rating) /
      4;

    const evaluation = this.evaluationRepo.create({
      supplier_id: dto.supplier_id,
      quality_rating: dto.quality_rating,
      delivery_rating: dto.delivery_rating,
      price_rating: dto.price_rating,
      service_rating: dto.service_rating,
      overall_rating: parseFloat(overallRating.toFixed(2)),
      comments: dto.comments,
      evaluated_by: evaluatedBy,
    });

    return this.evaluationRepo.save(evaluation);
  }

  async findBySupplier(supplierId: number): Promise<SupplierEvaluation[]> {
    return this.evaluationRepo.find({
      where: { supplier_id: supplierId },
      order: { created_at: 'DESC' },
    });
  }
}

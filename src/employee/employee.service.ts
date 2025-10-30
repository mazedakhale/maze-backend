import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entitities/employee.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) { }

    async findAll(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    async findOne(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ['category', 'subcategory'],  // Include relations here
        });

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async findByUserId(userId: number): Promise<Employee[]> {
        const assignments = await this.employeeRepository.find({
            where: { user_id: userId },
            relations: ['category', 'subcategory'],  // eager load related data
        });
        return assignments;
    }

    async createList(
        categoryId: number,
        subcategoryIds: number[],
        userId: number,
    ): Promise<Employee[]> {
        try {
            // Insert each assignment with ALL required fields
            for (const subcategoryId of subcategoryIds) {
                await this.employeeRepository.query(
                    'INSERT INTO employees (category_id, subcategory_id, user_id) VALUES (?, ?, ?)',
                    [categoryId, subcategoryId, userId]
                );
            }

            // Fetch the created records WITH relations
            const createdEmployees = await this.employeeRepository.find({
                where: { user_id: userId },
                relations: ['category', 'subcategory'],
                order: { created_at: 'DESC' },
                take: subcategoryIds.length,
            });

            return createdEmployees;
        } catch (error) {
            console.error('Error in create service:', error);
            throw new InternalServerErrorException('Failed to create documents.');
        }
    }

    async updateList(
        id: number,
        categoryId: number,
        subcategoryIds: number[],
        userId: number,
    ): Promise<Employee[]> {
        try {
            // Check if employee exists
            const existingEmployee = await this.employeeRepository.findOne({ where: { id } });
            if (!existingEmployee) {
                throw new NotFoundException(`Employee with ID ${id} not found`);
            }

            // Delete all existing assignments for this user and category using raw SQL
            await this.employeeRepository.query(
                'DELETE FROM employees WHERE user_id = ? AND category_id = ?',
                [userId, categoryId]
            );

            // Insert new assignments with ALL required fields using raw SQL
            for (const subcategoryId of subcategoryIds) {
                await this.employeeRepository.query(
                    'INSERT INTO employees (category_id, subcategory_id, user_id) VALUES (?, ?, ?)',
                    [categoryId, subcategoryId, userId]
                );
            }

            // Fetch the updated records using raw SQL to get IDs, then load with relations
            const updatedIds = await this.employeeRepository.query(
                'SELECT id FROM employees WHERE user_id = ? AND category_id = ? ORDER BY created_at DESC',
                [userId, categoryId]
            );

            // Fetch full employee records with relations
            const updatedEmployees = await this.employeeRepository.find({
                where: updatedIds.map(row => ({ id: row.id })),
                relations: ['category', 'subcategory'],
            });

            return updatedEmployees;
        } catch (error) {
            console.error('Error in update service:', error);
            throw new InternalServerErrorException('Failed to update employee.');
        }
    }

    async remove(id: number): Promise<void> {
        const result = await this.employeeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
    }
}
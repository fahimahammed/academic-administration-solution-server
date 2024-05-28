import { Building, Prisma } from '@prisma/client';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { buildingSearchableFields } from './building.constants';
import { IBuildingFilterRequest } from './building.interfaces';

const insertIntoDB = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data
  });
  return result;
};

const getAllFromDB = async (
  filters: IBuildingFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<Building[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    });
  }

  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc'
        }
  });
  const total = await prisma.building.count({
    where: whereConditions
  });

  return {
    meta: {
      total,
      page,
      limit
    },
    data: result
  };
};

const getByIdFromDB = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id
    },
    include: {
      rooms: true
    }
  });
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<Building>): Promise<Building> => {
  const result = await prisma.building.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Building> => {
  const result = await prisma.building.delete({
    where: {
      id
    }
  });
  return result;
};

export const BuildingService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};

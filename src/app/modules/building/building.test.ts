import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

const buildingId: string = "438272525-kshfs-2342";
const baseApi: string = `${config.test.baseApi}/buildings`;

describe('Building Management', () => {
    testGetApi(
        'should retrive all building',
        baseApi,
        200,
        true,
        "Buildings fetched successfully",
        true
    );

    testGetApi(
        'should retrive building with id',
        `${baseApi}/${buildingId}`,
        200,
        true,
        "Building fetched successfully",
        true
    )

});

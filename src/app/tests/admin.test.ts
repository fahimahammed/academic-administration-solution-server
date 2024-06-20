import config from "../../config";
import { testGetApi } from "../../shared/testUtils";

const adminId: string = "A-00001";
const baseApi: string = `${config.test.baseApi}/admins`;

describe('Admin Management', () => {
    testGetApi(
        'should retrive all admin',
        baseApi,
        200,
        true,
        "Admins fetched successfully",
        true
    );

    testGetApi(
        'should retrive admin with id',
        `${baseApi}/${adminId}`,
        200,
        true,
        "Admin fetched successfully",
        true
    )

});

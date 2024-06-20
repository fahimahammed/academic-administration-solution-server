import { testGetApi } from "./testUtils";
import config from "../src/config";

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/rooms`;

describe('Room Management', () => {

    testGetApi(
        'should retrive all room',
        baseApi,
        200,
        true,
        "Rooms fetched successfully",
        true
    );

    testGetApi(
        'should retrive room with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "Room fetched successfully",
        true
    );

});

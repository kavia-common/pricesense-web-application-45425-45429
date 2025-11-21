import axios from "axios";
import { createApiClient, deleteProduct } from "./client";

jest.mock("axios");

describe("API client deleteProduct", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("throws when productId is null/undefined", async () => {
    await expect(deleteProduct(undefined)).rejects.toThrow("productId is required");
    await expect(deleteProduct(null)).rejects.toThrow("productId is required");
  });

  test("calls DELETE with path parameter and no body", async () => {
    const mockDelete = jest.fn().mockResolvedValue({ status: 204, data: null });
    // mock axios.create to return an instance with delete method
    const instance = { delete: mockDelete, interceptors: { response: { use: jest.fn() } } };
    axios.create.mockReturnValue(instance);

    // Recreate client to ensure mocked instance is used
    createApiClient();

    const id = 123;
    const result = await deleteProduct(id);
    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    const [calledUrl, calledConfig] = mockDelete.mock.calls[0];

    expect(calledUrl).toBe(`/products/${id}`);
    // No data/body should be provided in config for axios.delete
    if (calledConfig) {
      expect(calledConfig.data).toBeUndefined();
    }
  });

  test("treats 200 OK as success", async () => {
    const mockDelete = jest.fn().mockResolvedValue({ status: 200, data: { ok: true } });
    const instance = { delete: mockDelete, interceptors: { response: { use: jest.fn() } } };
    axios.create.mockReturnValue(instance);
    createApiClient();

    await expect(deleteProduct(5)).resolves.toBe(true);
  });
});

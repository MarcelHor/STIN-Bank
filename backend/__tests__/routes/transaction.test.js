const transactionController = require("../../controllers/transactionController");

describe("GET /api/transactions", () => {
    it("returns all transactions for a user with default limit and offset", async () => {
        // Mock request and response objects
        const req = {
            user: { accountNumber: 1234 },
            query: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function with the mock objects
        await transactionController.getAllTransactions(req, res);

        // Check that the response is correct
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it("returns an error if user id is not provided", async () => {
        // Mock request and response objects
        const req = {
            user: {},
            query: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function with the mock objects
        await transactionController.getAllTransactions(req, res);

        // Check that the response is correct
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "User id is required",
        });
    });
});

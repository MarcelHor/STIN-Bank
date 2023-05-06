const transactionController = require("../../repositories/transactionRepository");
const { getAllTransactions } = require("../../controllers/transactionController");

jest.mock("../../repositories/transactionRepository", () => ({
    allTransactions: jest.fn(),
}));

describe("getTransactions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns all transactions for a user with default limit and offset", async () => {
        const mockTransactions = [      {        id: 1,        user_id: "1234567890",        amount: 100,      },      {        id: 2,        user_id: "1234567890",        amount: 200,      },    ];
        transactionController.allTransactions.mockResolvedValue(mockTransactions);

        const req = {
            user: {
                accountNumber: "1234567890",
            },
            query: {},
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTransactions(req, res);

        expect(transactionController.allTransactions).toHaveBeenCalledWith("1234567890", 10, 0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it("returns an error if user id is not provided", async () => {
        const req = {
            user: {},
            query: {},
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllTransactions(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "User id is required" });
    });
});

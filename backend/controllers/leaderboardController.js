const Sales = require("../models/Sales");

// Add Sale Record
exports.addSale = async (req, res) => {
    try {
        const { agentName, amount, numberOfSales } = req.body;

        if (!agentName || !amount || !numberOfSales) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const sale = await Sales.create({
            agentName,
            amount,
            numberOfSales,
        });

        res.status(201).json({
            success: true,
            message: "Sale recorded successfully",
            data: sale,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// fetch Leaderboard
exports.getLeaderboard = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const aggregated = await Sales.aggregate([
            {
                $group: {
                    _id: "$agentName",
                    totalAmount: { $sum: "$amount" },
                    totalDeals: { $sum: "$numberOfSales" }
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        // Ranking with tie handling (Standard Competition Ranking)
        let currentRank = 1;
        let previousAmount = null;

        const ranked = aggregated.map((agent, index) => {

            if (previousAmount !== null && agent.totalAmount < previousAmount) {
                currentRank = index + 1;
            }

            previousAmount = agent.totalAmount;

            return {
                rank: currentRank,
                agentName: agent._id,
                totalAmount: agent.totalAmount,
                totalDeals: agent.totalDeals
            };
        });

        const paginated = ranked.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            page,
            totalAgents: ranked.length,
            data: paginated,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

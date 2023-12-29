const Tweet = require("./tweetSchema");

async function aggregateTweets(matchCondition, dateRange = null) {

    if (dateRange) {
        matchCondition.date = {
            $gte: new Date(dateRange.startDate),
            $lte: new Date(dateRange.endDate)
        };
    }

    return await Tweet.aggregate([
        { $match: matchCondition },
        { $group: { 
            _id: "$date",
            count: { $sum: 1 }
        } },
        { $sort: { _id: 1 } }
    ]);
}

module.exports = async function HandleQuery(req, res) {
    const { queryType } = req.body;
    let tweetsRes = [];

    switch (queryType) {
        case 1:
            const { text } = req.body;
            tweetsRes = await aggregateTweets({ text: { $regex: text, $options: 'i' } });
            break;
        case 2: 
            const { startDate, endDate } = req.body;
            tweetsRes = await aggregateTweets({}, { startDate, endDate });
            break;
        case 3:
            const { username } = req.body;
            tweetsRes = await aggregateTweets({ user: { $regex: username, $options: 'i' } });
            break;
        case 4:
            const { numberRetweets } = req.body;
            tweetsRes = await aggregateTweets({ Retweets: numberRetweets });
            break;
    }

    res.json(tweetsRes);
};

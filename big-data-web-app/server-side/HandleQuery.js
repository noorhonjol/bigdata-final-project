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
        { $project: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
        }},
        { $group: { 
            _id: { year: "$year", month: "$month", day: "$day" },
            count: { $sum: 1 }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
}

async function HandleQuery(req, res) {
    const { queryType,queryText } = req.body;
    let tweetsRes = [];
    switch (parseInt(queryType)) {
        case 1:
            tweetsRes = await aggregateTweets({ text: { $regex: queryText, $options: 'i' } });
            break;
        case 2:
            tweetsRes = await aggregateTweets({ user: { $regex: queryText, $options: 'i' } });
            break;
        case 3:
            tweetsRes = await aggregateTweets({ retweets: parseInt(queryText) });
            break;
    }
    res.json(tweetsRes);
};


module.exports={HandleQuery}
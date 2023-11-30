const {GroupUser} = require('../models');

const groupuserData = [
    {
        group_id: 1,
        user_id: 1,
    },
    {
        group_id: 1,
        user_id: 5,
    },
    {
        group_id: 1,
        user_id: 3,
    },
    {
        group_id: 3,
        user_id: 3,
    },
    {
        group_id: 1,
        user_id: 2,
    },
    {
        group_id: 1,
        user_id: 4,
    },
    {
        group_id: 3,
        user_id: 4,
    }
]

const groupuserSeed = () => GroupUser.bulkCreate(groupuserData);

module.exports = groupuserSeed;
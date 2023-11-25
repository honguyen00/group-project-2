const router = require('express').Router();
const { Group, GroupUser } = require('../../models');
const User  = require('../../models/User');
const withAuth = require('../../utils/auth');

//get all uses
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll();
        // req.session.save(() => {
        //     req.session.user_id = userData.id;
        //     req.session.logged_in = true;

        //     res.status(200).json({user: userData, message: 'Create new user successfully'});
        // });
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json(error)
    }
});

//get a group by id, include all users in that group 
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {include: [{model: Group, through: GroupUser}]});
        if(!userData) {
            res.status(400).json({message: 'Cannot find group in the database'});
            return;
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
})


//create a new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json({user: userData, message: 'Create new user successfully'});
        });
    } catch (error) {
        res.status(400).json(error)
    }
});

//update information for an existing user
router.put('/:id', async (req, res) => {
    try {
        const userData = await User.update(req.body,{
            where: {
                id: req.params.id || req.session.user_id
            }
        });
        res.status(200).json({user: userData, message: 'Update user info successfully'});
    } catch (error) {
        res.status(400).json(error);
    }
});

//deleting existing user
router.delete('/:id', async (req, res) => {
    try {
        const userData = await User.destroy({where: {
            id: req.params.id || req.session.user_id
        }});
        res.status(200).json({user: userData, message: 'Delete user successfully'})
    } catch (error) {
        res.status(400).json(error);
    }
})

//user tries login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({where: {email: req.body.email}});

        if(!userData) {
            res.status(400).json({message: 'Incorrect email or password, please try again!'});
            return;
        }

        const validPassword = await User.checkPassword(req.body.password);
        
        if(!validPassword) {
            res.status(400).json({message: "Incorrect email or password, please try again!"});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({user: userData, message: 'Logged in successfully!'})
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

// user tries logout
router.post('/logout', (req, res) => {
    if (req.session.logged_id) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
})

module.exports = router;

const express = require('express');
//router allows us to attach routes to a router which can then be attached to our app
const router = express.Router();

// I.N.D.U.C.E.S. - Index, New, Delete, Update, Create, Edit, Show

//index - get /fruit - show all fruits
//new - get /fruit/new - show form to create new fruit
//delete - delete /fruit/:id - delete a specific fruit
//update - put /fruit/:id - update a specific fruit
//create - post /fruit - tae data from fruit/new form and add to the data
//edit - get /fruit/:fruitid/edit - edit specific fruit
//show - get /fruit/:fruitid - show specific fruit

//index
router.get('/fruits', async (req, res) => {
    try {
        //find all fruits
        const fruits = await Fruit.find({ isSoftDeleted: { $in: [false, null] } });
        //send back all fruits with index page
        res.render('fruits/index.ejs', { fruits });
    } catch (error) {
        res.render('404.ejs', { message: error.message })
    }
});

//new
router.get('/fruits/new', (req, res) => {
    //send back form to create new fruit
    res.render('fruits/new.ejs', { message: '' });
});

//delete
router.delete('/fruits/:fruitId', async (req, res) => {
    try {
        await Fruit.findByIdAndDelete(req.params.fruitId);
        res.redirect('/fruits');
    } catch (error) {
        res.render('404.ejs', { message: error.message });
    };
});

//soft delete
//tldr; hide from UI but still show in db for our records/for own users
router.delete('/fruits/:fruitId/soft', async (req, res) => {
    try {
        await Fruit.findByIdAndUpdate(req.params.fruitId, { isSoftDeleted: true });
        res.redirect('/fruits');
    } catch (error) {
        res.render('404.ejs', { message: error.message });
    };
});

//confirm delete
router.get('/fruits/:fruitId/confirm_delete', async (req, res) => {
    try {
        //find a fruit using id from url params
        const foundFruit = await Fruit.findById(req.params.fruitId);
        //send error of no fruit found if no fruit found
        if (!foundFruit) throw new Error('That fruit ain\'t in the basket, please try again');
        //send back found fruit
        res.render('fruits/fruit_delete_confirm_cancel.ejs', {
            fruit: foundFruit,
            isReadyToEatMessage: foundFruit.isReadyToEat ? 'This fruit is ready to eat' : 'This fruit is not ready to eat'
        });
    } catch (error) {
        res.render('404.ejs', { message: error.message })
    }
});

//create
router.post('/fruits', async (req, res) => {
    try {
        //check for empty strings
        const { name, color, description } = req.body
        //if we trim name || color and they are falsey aka 'a      '
        if (!name.trim()) {
            return res.render('fruits/new.ejs', { message: 'Name must have a valid field' })
        }
        if (!color.trim()) {
            return res.render('fruits/new.ejs', { message: 'Color must have a valid field' })
        }
        if (description && description.length > 100) {
            return res.render('fruits/new.ejs', { message: 'Description character limit reached' })
        }
        //handle input checkboxes 'on' status
        req.body.isReadyToEat = req.body.isReadyToEat === 'on' ? true : false
        //give form data to model.create to make a new mongo db entry
        await Fruit.create(req.body);
        //redirect to fruits index
        res.redirect('/fruits');
    } catch (error) {
        res.render('404.ejs', { message: error.message })
    }
});

//edit
router.get('/fruits/:fruitId/edit', async (req, res) => {
    try {
        //find a fruit using id from url params
        const foundFruit = await Fruit.findById(req.params.fruitId);
        //send error of no fruit found if no fruit found
        if (!foundFruit) throw new Error('That fruit ain\'t in the basket, please try again');
        //send back found fruit
        res.render('fruits/edit.ejs', {
            fruit: foundFruit,
        });
    } catch (error) {
        res.render('404.ejs', { message: error.message });
    }
});

router.put('/fruits/:fruitId', async (req, res) => {
    try {
        req.body.isReadyToEat = req.body.isReadyToEat === 'on'
        await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
        res.redirect(`/fruits/${req.params.fruitId}`);
    } catch (error) {
        res.render('404.ejs', { message: error.message });
    }
});

//show
router.get('/fruits/:fruitId', async (req, res) => {
    try {
        //find a fruit using id from url params
        const foundFruit = await Fruit.findById(req.params.fruitId);
        //send error of no fruit found if no fruit found
        if (!foundFruit) throw new Error('That fruit ain\'t in the basket, please try again');
        //send back found fruit
        res.render('fruits/show.ejs', {
            fruit: foundFruit,
            isReadyToEatMessage: foundFruit.isReadyToEat ? 'This fruit is ready to eat' : 'This fruit is not ready to eat'
        });
    } catch (error) {
        res.render('404.ejs', { message: error.message })
    }
});


//export router to be used on server
module.exports = router
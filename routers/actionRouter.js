const express = require('express');

const Actions = require('../data/helpers/actionModel');

const Projects = require('../data/helpers/projectModel');

const router = express.Router();
////////////////////////////////////////////
router.post('/', validateAction, validateProjectId, (req, res) => {
    const changes = req.body;

    Actions.insert(changes)
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error creating the action',
            });
        });
});

////////////////////////////////////////////

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Actions.get(id)
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                return res.status(400).json({
                    errorMessage: "The action with ID could not be retrieved."
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The action information could not be retrieved."
            });
        })
});

////////////////////////////////////////////

router.delete('/:id', validateActionId, (req, res) => {
    const id = req.params.id;

    Actions.remove(id)
        .then(deleted => {
            res.status(200).json(deleted);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The action could not be removed"
            });
        });
});
////////////////////////////////////////////

router.put('/:id', validateActionId, validateProjectId, (req, res) => {
    const changes = req.body;
    Actions.update(req.params.id, changes)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'The action information could not be modified.',
            });
        });
});
////////////////////////////////////////////

//custom middleware

function validateActionId(req, res, next) {
    Actions.get(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(400).json({
                    errorMessage: "invalid action id"
                });
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                errorMessage: "The action information could not be retrieved."
            });
        })
    next();
}

function validateAction(req, res, next) {
    const changes = req.body;
    if (!changes || !changes.description || !changes.project_id || !changes.notes ) {
        return res.status(400).json({ errorMessage: 'missing required project_id, notes or description field' });
    }
    next();
}

function validateProjectId(req, res, next) {
    const id = req.body.project_id;
    if (!id) {
        next();
        return;
    }
    Projects.get(id)
        .then(data => {
            if (!data) {
                return res.status(400).json({
                    errorMessage: "invalid project id"
                });
            } else {
                next();
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                errorMessage: "The project information could not be retrieved."
            });
        })
}
module.exports = router;

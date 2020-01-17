const express = require('express');

const Projects = require('../data/helpers/projectModel');

const router = express.Router();
////////////////////////////////////////////
router.post('/', validateProject, (req, res) => {
    const changes = req.body;

    Projects.insert(changes)
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error creating the project',
            });
        });
});

////////////////////////////////////////////

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Projects.get(id)
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                return res.status(400).json({
                    errorMessage: "The project with ID could not be retrieved."
                });
            }   
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The project information could not be retrieved."
            });
        })
});
////////////////////////////////////////////

router.get('/:id/actions', validateProjectId, (req, res) => {
    const { id } = req.params;
    Projects.getProjectActions(id)
        .then(data => {
            if (data.length != 0) {
                res.status(200).json(data);
            } else {
                return res.status(400).json({
                    errorMessage: "The project does not have actions"
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The project information could not be retrieved."
            });
        })
});

////////////////////////////////////////////

router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    console.log("BBB" + id);
    Projects.remove(id)
        .then(deleted => {
            res.status(200).json(deleted);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The project could not be removed"
            });
        });
});
////////////////////////////////////////////

router.put('/:id', validateProjectId, (req, res) => {
    const changes = req.body;
    Projects.update(req.params.id, changes)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'The project information could not be modified.',
            });
        });
});
////////////////////////////////////////////

//custom middleware

function validateProjectId(req, res, next) {
    
    Projects.get(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(400).json({
                    errorMessage: "invalid project id"
                });
            }
        })
        .catch(error => {
            return res.status(500).json({
                errorMessage: "The action information could not be retrieved."
            });
        })
    //next();
}

function validateProject(req, res, next) {
    const changes = req.body;
    if (!changes || !changes.name || !changes.description) {
        return res.status(400).json({ errorMessage: 'missing required name or description field' });
    }
    next();
}

module.exports = router;

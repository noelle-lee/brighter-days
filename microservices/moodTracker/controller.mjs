import 'dotenv/config';
import * as moods from './model.mjs';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT;

const app = express();

function isValidProps(mood, date) {
    if(mood.length > 0 && date) {
        return true;
    }
    else {
        return false;
    }
}

app.use(express.json());

// Allow Requests from localhost:8001 (Noelle's React webapp)
app.use(cors({
    origin: 'http://localhost:8001'
}));

app.post('/mood-tracker', (req, res) => {

    const mood = new Promise((resolve, reject) => {
        if(isValidProps(req.body.mood, req.body.date)) {
            resolve(moods.createMood(req.body.mood, req.body.date));
        }
        else {
            reject(`One of these parameters is invalid: mood: ${req.body.mood}, date: ${req.body.date}`);
        }
    });

    mood.then(moods => {
        res.status(201).json(moods);
        console.log("Mood saved successfully!");
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: 'Invalid request'});
    })

});

app.get('/mood-tracker', (req, res) => {
    let filter = {};
    moods.findMood(filter, '', 0)
        .then(moods => {
            res.send(moods);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        })
});

app.get('/mood-tracker/:_id', (req, res) => {
    const moodID = req.params._id;
    moods.findMoodById(moodID)
        .then(moods => {
            if (moods !== null) {
                res.json(moods)
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        })
});

app.get('/mood-tracker/date/:date', async(req, res) => {
    const { date } = req.params;
    moods.findMood({ date })
        .then(moods => {
            if (moods.length > 0) {
                res.json(moods)
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        })
  });

app.put('/mood-tracker/:_id', (req, res) => {

    const mood = new Promise((resolve, reject) => {
        if(isValidProps(req.body.mood, req.body.date)) {
            resolve(moods.replaceMood(req.params._id, req.body.mood, req.body.date));
        }
        else {
            reject(`One of these parameters is invalid: mood: ${req.body.mood}, date: ${req.body.date}`);
        }
    });

    mood.then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, mood: req.body.mood, date: req.body.date })
                console.log("Mood updated successfully!");
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Invalid request' });
        });
});

// PUT route for updating an existing mood
app.put('/mood-tracker/date/:date', async (req, res) => {
    const { date } = req.params;
    const { mood } = req.body;

    if (!mood) {
        return res.status(400).json({ Error: 'Mood is required' });
    }

    try {
        const updatedMood = await moods.updateMood(date, mood);
        if (updatedMood) {
            res.json(updatedMood);
            console.log("Mood updated successfully!");
        } else {
            res.status(404).json({ Error: 'Mood not found for the specified date' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ Error: 'Request failed' });
    }
});

app.delete('/mood-tracker/:_id', (req, res) => {
    moods.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
                console.log("Mood deleted successfully!");
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.delete('/mood-tracker/date/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const deletedMood = await moods.deleteMood(date);
        if (deletedMood) {
            res.status(204).send(); // Successfully deleted, send 204 No Content
            console.log("Mood deleted successfully!");
        } else {
            res.status(404).json({ Error: 'Mood not found for the specified date' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ Error: 'Request failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


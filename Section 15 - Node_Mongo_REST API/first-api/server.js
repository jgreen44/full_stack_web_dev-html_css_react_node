const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const ingredients = [
    {
        'id': '232kAk',
        'text': 'Eggs',

    },
    {
        'id': 'dkP345',
        'text': 'Milk',
    },
    {
        'id': 'dkcuu7',
        'text': 'Bacon',
    },
    {
        'id': '73hdy',
        'text': 'Frogs Legs',
    }
];

app.get('/ingredients', function (request, response) {
    response.send(ingredients);
});

app.post('/ingredients', function (request, response) {
    const ingredient = request.body;
    if (!ingredient || ingredient.text === '') {
        response.status(500).send({error: 'Your ingredient must have a name'});
    } else {
        ingredients.push(ingredient);
        response.status(200).send(ingredient)
    }
});

app.put('/ingredients/:ingredientId', function (request, response) {
    var ingredientId = request.params.ingredientId;
    var newText = request.body.text;

    if ((!newText || newText === '')) {
        response.status(500).send({error: 'You must provide ingredient text'})
    } else {
        var objectFound = false;
        for (var i = 0; i < ingredients.length; i++) {
            var ing = ingredients[i];

            if (ing.id === request.params.ingredientId) {
                ingredients[i].text = newText;
                objectFound = true;
                break;
            }
        }

        if (!objectFound) {
            response.status(500).send({error: 'Ingredient ID not found'})
        }
        response.send(ingredients);
    }
})

// app.get('/funions', function (request, response){
//     response.send('Giving all the funions!')
// })

app.listen(3000, function () {
    console.log('First API running on port 3000!')
});


const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const favorite = req.body.favorite || 'unknown';
  const leastFavorite = req.body.leastFavorite || 'unknown';

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favorite,
    leastFavorite,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists. ' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ domos: docs });
  });
};

const updateDomo = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body._id) {
    return res.status(400).json({ error: 'Request requires a domoId value.' });
  }

  return Domo.DomoModel.findByID(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    if (docs.owner.toString() !== req.session.account._id) {
      return res.status(403).json({ error: 'You can\'t edit domos you don\'t own!' });
    }
    const tempDomo = docs;
    if (req.body.name) {
      tempDomo.name = req.body.name;
    }

    if (req.body.age) {
      tempDomo.age = req.body.age;
    }

    if (req.body.favorite) {
      tempDomo.favorite = req.body.favorite;
    }

    if (req.body.leastFavorite) {
      tempDomo.leastFavorite = req.body.leastFavorite;
    }

    tempDomo.updatedDate = Date.now();

    const updatePromise = tempDomo.save();

    updatePromise.then(() => res.status(204).send(''));

    updatePromise.catch((e) => {
      console.log(e);

      return res.status(400).json({ error: 'An error occured.' });
    });
    return updatePromise;
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.updateDomo = updateDomo;

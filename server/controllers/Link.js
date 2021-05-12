const models = require('../models');

const { Link } = models;

const makerPage = (req, res) => {
  Link.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), links: docs });
  });
};

const makeLink = (req, res) => {
  if (!req.body.name || !req.body.url) {
    return res.status(400).json({ error: 'RAWR! Both name and url are required' });
  }

  const type = req.body.type || 'unknown';  

  const linkData = {
    name: req.body.name,
    url: req.body.url,
    type,    
    owner: req.session.account._id,
  };

  const newLink = new Link.LinkModel(linkData);

  const linkPromise = newLink.save();

  linkPromise.then(() => res.json({ redirect: '/maker' }));

  linkPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Link already exists. ' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return linkPromise;
};

const getLinks = (request, response) => {
  const req = request;
  const res = response;

  return Link.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ links: docs });
  });
};

const updateLink = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body._id) {
    return res.status(400).json({ error: 'Request requires a linkId value.' });
  }

  return Link.LinkModel.findByID(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    if (docs.owner.toString() !== req.session.account._id) {
      return res.status(403).json({ error: 'You can\'t edit links you don\'t own!' });
    }
    const tempLink = docs;
    if (req.body.name) {
      tempLink.name = req.body.name;
    }

    if (req.body.url) {
      tempLink.url = req.body.url;
    }

    if (req.body.type) {
      tempLink.type = req.body.type;
    }  

    tempLink.updatedDate = Date.now();

    const updatePromise = tempLink.save();

    updatePromise.then(() => res.status(204).send(''));

    updatePromise.catch((e) => {
      console.log(e);

      return res.status(400).json({ error: 'An error occured.' });
    });
    return updatePromise;
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeLink;
module.exports.getLinks = getLinks;
module.exports.updateLink = updateLink;

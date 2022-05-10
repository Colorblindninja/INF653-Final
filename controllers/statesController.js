const data = {
   states: require("../model/states.json"),
   setStates: (data) => {
     this.states = data;
   },
 };

const StateFunFacts = require("../model/states");

function contig(state) {
    if (state['code'] != 'AK' && state['code'] != 'HI') {
        return state;
    }
}

function nonContig(state) {
    if (state['code'] == 'AK' || state['code'] == 'HI') {
        return state;
    }
}

const verifyState = async (req, res, next) => {
    req.params.state = req.params.state.toUpperCase();
    const statesArr = data.states;
    let found = false;
    statesArr.forEach((state) => {
        if (state['code'] == req.params.state) {
            found = true;
        }
    });
    if (!found) {
         return res.status(400).json({ message: `No state has the code ${req.params.state}` });

    }
    next();
};

const getFunFacts = async (req, res, next) => {
        req.params.state = req.params.state.toUpperCase();
        console.log(req.params);
        const state = await StateFunFacts.findOne({ stateCode: req.params.state }).exec();
        req.funfacts = [];

        if (state) {
            if(state.funfacts) {
                req.funfacts = state.funfacts;

            }
        }

        next();
};




const getStates = async (req, res) => {

    let funfacts = [];
    let statesArr = data.states;
    console.log(req.query);
    if (req.query.contig === 'true') {
        statesArr = statesArr.filter(contig);
    } else if (req.query.contig === 'false') {
        statesArr = statesArr.filter(nonContig);
    }
    const statesDB = await StateFunFacts.find({});
    statesArr.forEach((state) => {
        statesDB.forEach((stateDB) => {
            if (state['code'] == stateDB['stateCode']) {
                state['funfacts'] = stateDB['funfacts'];
            }
        });
    });

    res.json(statesArr);
};

const getRandomFunFact = async (req, res) => {
    req.params.state = req.params.state.toUpperCase();
    const state = await StateFunFacts.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
      return res
        .status(404)
        .json({ message: `State does not have any fun facts` });
    }
    req.funfacts = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];

    if (req.funfacts == []) {
        return res
        .status(404)
        .json({ message: `This state does not have any fun facts` });
    }
    res.json(req.funfacts);
};

const createfunFact = async (req, res) => {
req.params.state = req.params.state.toUpperCase();
  if (!req?.body.funfacts) {
    return res.status(400).json({ message: "fun facts must is required and must be an array" });
  }

  const state = await StateFunFacts.findOne({ stateCode: req.params.state }).exec();
  if (!state) {
          try {
            const result = await StateFunFacts.create({
              stateCode: req.params.state,
              funfacts: req.body.funfacts,
            });
            res.status(201).json(result);
          } catch (err) {
            console.log(err);
          }
  } else {
      for (var key in req.body.funfacts) {
          if (req.body.funfacts.hasOwnProperty(key)) {
              state.funfacts.push(req.body.funfacts[key]);
          }
      }
      const result = await state.save();
      res.json(result);
  }

};

const updatefunFact = async (req, res) => {
req.params.state = req.params.state.toUpperCase();
  if (!req?.body.index || !req?.body.funfact) {
    return res.status(400).json({ message: "index and funfact parameters are required. " });
  }
  const state = await StateFunFacts.findOne({ stateCode: req.params.state }).exec();
  if (!state) {
    return res
      .status(404)
      .json({ message: `This state does not have any fun facts to update` });
  }
  if(state.funfacts) {
      if (state.funfacts.length >= req.body.index) {
          state.funfacts[req.body.index-1] = req.body.funfact;
      } else {
          return res
            .status(404)
            .json({ message: `There is no funfact with index of  ${req.body.index}` });
      }
  } else {
      console.log(state.funfacts);
      return res
        .status(404)
        .json({ message: `There is no funfact with index of  ${req.body.index}` });
 }

  const result = await state.save();
  res.json(result);

};

const deletefunFact = async (req, res) => {
req.params.state = req.params.state.toUpperCase();
  if (!req?.body.index) {
    return res.status(400).json({ message: "Index of fun fact to delete is required. " });
  }

  const state = await StateFunFacts.findOne({ stateCode: req.params.state }).exec();

  if (!state) {
    return res
      .status(404)
      .json({ message: `This state does not have any fun facts to delete` });
  }
  if(state.funfacts) {
      if (state.funfacts.length >= req.body.index) {
          state.funfacts.splice(req.body.index-1, 1);
      } else {
          return res
            .status(404)
            .json({ message: `There is no funfact with index of  ${req.body.index}` });
      }
  } else {
      return res
        .status(404)
        .json({ message: `There is no funfact with index of  ${req.body.index}` });
 }
  const result = await state.save();
  res.json(result);
};

const getState = async (req, res) => {
  req.params.state = req.params.state.toUpperCase();
  if (!req?.params?.state) {
    return res.status(400).json({ message: "State code is required. " });
  }
  console.log(req.params.state);
  let state = data.states.find(
    (state) => state.code == req.params.state
  );
  state['funfacts'] = req.funfacts;
  if (!state) {
    return res
      .status(404)
      .json({ message: `No state has the code  ${req.params.state}` });
  }
  res.json(state);
};

const getCapital = async (req, res) => {
  req.params.state = req.params.state.toUpperCase();
  let state = data.states.find(
    (state) => state.code == req.params.state
  );
  if (!state) {
    return res
      .status(404)
      .json({ message: `No state has the code  ${req.params.state}` });
  }
  res.json({'state': state.state, 'capital': state.capital_city});
};

const getNickname = async (req, res) => {
  req.params.state = req.params.state.toUpperCase();
  let state = data.states.find(
    (state) => state.code == req.params.state
  );
  if (!state) {
    return res
      .status(404)
      .json({ message: `No state has the code  ${req.params.state}` });
  }
  res.json({'state': state.state, 'nickname': state.nickname});
};

const getPopulation = async (req, res) => {
  req.params.state = req.params.state.toUpperCase();
  let state = data.states.find(
    (state) => state.code == req.params.state
  );
  if (!state) {
    return res
      .status(404)
      .json({ message: `No state has the code  ${req.params.state}` });
  }
  res.json({'state': state.state, 'population': state.population});
};

const getAdmission = async (req, res) => {
  req.params.state = req.params.state.toUpperCase();
  let state = data.states.find(
    (state) => state.code == req.params.state
  );
  if (!state) {
    return res
      .status(404)
      .json({ message: `No state has the code  ${req.params.state}` });
  }
  res.json({'state': state.state, 'admitted': state.admission_date});
};

module.exports = {
    verifyState,
    getStates,
    getRandomFunFact,
    createfunFact,
    updatefunFact,
    deletefunFact,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunFacts,
};

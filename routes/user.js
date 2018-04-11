const Router = require('express-promise-router');
const router = new Router();
const logger = require('../system/logger');
const Authenticator = require('../system/authenticator');
const MSG = require('../config/message/system-messages.json');

/* Models */
const memberModel = require('../accessor/model/member');

module.exports = (accessor) => {
  const authenticator = new Authenticator(accessor);

  /** メンバ登録 */
  router.post('/', async (req, res) => {
    const body = req.body;
    if (!body) {
      logger.error.error(MSG.BODY_PARAMS_REQUIRED);
      res.send({error: true, message: MSG.BODY_PARAMS_REQUIRED});
      throw new Error(MSG.BODY_PARAMS_REQUIRED);
    }

    await authenticator.register(body.id, body.password, false)
    .catch((err) => {
      logger.error.error(err);
      res.send({error: true, message: err.message});
      throw err;
    });
    return res.send({data: {}});
  });

  /** メンバ情報変更（パスワード変更） */
  router.put('/', async (req, res) => {
    const body = req.body;
    if (!body) {
      logger.error.error(MSG.BODY_PARAMS_REQUIRED);
      res.send({error: '', message: MSG.BODY_PARAMS_REQUIRED});
      throw new Error(MSG.BODY_PARAMS_REQUIRED);
    }

    await authenticator.change(body.id, body.oldInfo, body.newInfo)
    .catch((err) => {
      logger.error.error(err);
      res.send({error: err.name, message: err.message});
      throw err;
    });

    return res.send({data: {}});
  });

  /** ログイン */
  router.post('/login', async (req, res) => {
    const body = req.body;
    if (!body) return res.send({error: true, message: 'Who are you?'});

    const client = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const token = await authenticator.login(body.id, body.password, client)
      .catch((err) => {
        logger.error.error(err);
        res.send({error: err.name, message: err.message});
        throw err;
      });

    return res.send({data: {token: token}});
  });

  /** ログアウト */
  router.post('/logout', async (req, res) => {
    const body = req.body;
    if (!body) res.send({error: true, message: 'Who are you?'});

    const result = await authenticator.logout(body.id)
      .catch((err) => {
        logger.error.error(err);
        res.send({error: true, message: err.message});
        throw err;
      });
    if (!result) {
      res.send({error: true, message: MSG.LOGOUT_FAILED});
      throw new Error(MSG.LOGOUT_FAILED);
    }
    return res.send({data: {}});
  });

  return router;
};

import { authWithHeaders } from '../../middlewares/api-v3/auth';
import cron from '../../middlewares/api-v3/cron';
import { model as Group } from '../../models/group';
import {
  NotFound,
} from '../../libs/api-v3/errors';

let api = {};

/**
 * @api {get} /groups/:groupId Get group
 * @apiVersion 3.0.0
 * @apiName GetGroup
 * @apiGroup Group
 *
 * @apiParam {UUID} groupId The group _id
 *
 * @apiSuccess {Object} group The group object
 */
api.getGroup = {
  method: 'GET',
  url: '/groups/:groupId',
  middlewares: [authWithHeaders(), cron],
  handler (req, res, next) {
    let user = res.locals.user;

    req.checkParams('groupId', res.t('groupIdRequired')).notEmpty();

    let validationErrors = req.validationErrors();
    if (validationErrors) return next(validationErrors);

    Group.getGroup(user, req.params.groupId)
    .then(group => {
      if (!group) throw new NotFound(res.t('groupNotFound'));

      res.respond(200, group);
    })
    .catch(next);
  },
};

export default api;

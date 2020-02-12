var assert = require('assert')
  , Hapi = require('hapi')
  , Joi = require('joi')
  , failAction = require('../').failAction
  , schema =
    { name: Joi.string().required()
    , details: Joi.object(
      { city: Joi.string().required()
      , created: Joi.date().required()
      }).required()
    , email: Joi.string().email().required()
    , houseNumber: Joi.number().optional()
    }
  , server

describe('Fail Action', function () {

  before(function () {
    server = new Hapi.Server().connection(
      { routes:
        { validate:
          { options:
            { abortEarly: false }
          }
        }

      })

    server.route(
    { method: 'POST'
    , path: '/'
    , handler: function (request, reply) { reply() }
    , config:
      { validate:
        { payload: schema
        , failAction: failAction
        }
      }
    })
  })

  it('should respond with jsonapi errors', function (done) {
    server.inject(
    { method: 'POST'
    , url: '/'
    , payload: {}
    }, function (res) {
      assert.equal(res.statusCode, 400)
      assert(Array.isArray(res.result.errors))
      assert.equal(res.result.errors.length, 3)

      var error = res.result.errors[0]

      assert.equal(error.detail, '"name" is required')
      assert.equal(error.title, 'required')
      assert.equal(error.source.pointer, 'name')

      done()
    })
  })

})

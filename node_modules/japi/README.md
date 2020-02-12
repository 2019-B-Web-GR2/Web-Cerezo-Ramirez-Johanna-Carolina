# japi

[![Build Status](https://travis-ci.org/confuser/japi.png?branch=master)](https://travis-ci.org/confuser/japi)
[![Coverage Status](https://coveralls.io/repos/confuser/japi/badge.png?branch=master)](https://coveralls.io/r/confuser/japi?branch=master)

Provides a Hapi `failAction` to return Joi validation errors in jsonapi format

## Installation
```
npm install japi --save
```

## Usage
```js
var Hapi = require('hapi')
  , Joi = require('joi')
  , failAction = require('japi').failAction
  , server = new Hapi.Server().connection(
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
      { payload: { name: Joi.string().required() }
      , failAction: failAction
      }
    }
  })

/*
Example response:
{ errors:
  [ { source: { pointer: 'name' }
    , detail: '"name" is required'
    , title: 'required'
    }
  ]
}
*/
```

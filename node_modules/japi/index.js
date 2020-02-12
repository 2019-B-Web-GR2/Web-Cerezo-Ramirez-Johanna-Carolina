'use strict'

module.exports.failAction = function (req, reply, source, error) {
  return reply(format(error))
}

function format(error) {
  error.output =
    { payload:
      { errors: parse(error)
      }
    , statusCode: error.output.statusCode
    , headers: error.output.headers
    }

  return error
}

function parse(error) {
  return error.data.details.map(function (detail) {
    var err =
      { source: { pointer: detail.path.replace(/\./g, '/') }
      , detail: detail.message
      , title: detail.type.split('.').pop()
      }

    return err
  })
}

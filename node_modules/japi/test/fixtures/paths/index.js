var module = require('./module')
  , module2 = require('/module')
  , module3 = require(__dirname + '/module')

return module === module2 && module2 === module3

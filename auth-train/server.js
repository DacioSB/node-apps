const app = require('./app');
const port = 3000;
require("./redis/blacklist-access-token");
require("./redis/whitelist-refresh-token");
const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));

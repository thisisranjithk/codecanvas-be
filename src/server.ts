import { env } from './config/index.js';
import app from './app.js';

app.listen(env.PORT, () => {
  console.log(`Portfolio CMS API running on port ${env.PORT}`);
});

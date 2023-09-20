import { Server } from 'http';
import app from './app';

async function bootstrap() {

  const server: Server = app.listen(3000, () => {
    console.log("server listening")
  });

}

bootstrap();

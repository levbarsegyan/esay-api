import pino from 'pino';
import path from 'path';
const __dirname = path.resolve();
const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};
let logger;
if(process.env.LOGGER === 'file'){
    logger = pino(
        {
            customLevels: levels,        
            useOnlyCustomLevels: true,   
            level: 'http',               
            prettyPrint: {
                colorize: true,          
                levelFirst: true,
                translateTime: 'yyyy-dd-mm, h:MM:ss TT',           
            },                
        },
        pino.destination(`${__dirname}/error.log`)
    );
} else{
    logger = pino(
        {
            customLevels: levels,        
            useOnlyCustomLevels: true,   
            level: 'http',               
            prettyPrint: {
                colorize: true,          
                levelFirst: true,
                translateTime: 'yyyy-dd-mm, h:MM:ss TT',           
            },                
        }
    );
}
export default logger;

import fs from 'fs';
let c = fs.readFileSync('src/pages/IncomingOrders.tsx', 'utf-8');
c = c.replace(/\\`/g, "`").replace(/\\\$/g, "$");
fs.writeFileSync('src/pages/IncomingOrders.tsx', c);

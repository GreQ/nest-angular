import { Socket } from 'net';
import { getRandomToken } from '../utils';
import { ActionType, PanelType } from '../../../shared/models/tador/enum';
const uId = 'admin@admin.com';
const port = 4000;
let pId;
const host = 'localhost';
describe('tador', async () => {
    beforeAll(async () => {
        pId = await getRandomToken();
    });
    const write = (str: string) => {
        console.log(str);
        return new Promise(resolve => {
            const client = new Socket();
            client.setMaxListeners(100);

            client.connect(port, host, function() {
                console.log('Connected');
                client.write(str);
                client.on('data', data => {
                    client.end();
                    client.on('close', () => {
                        console.log(data.toString());
                        return resolve(data.toString());
                    });
                });
            });
        });
    };

    describe('register', () => {
        it('should register new panel', async () => {
            const result = '1';
            const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uId, pId } };
            const registerActionString = JSON.stringify(registerAction);
            //{"type":1,"data":{"type":"MP","uId":"admin@admin.com","pId":"04a03035fea7c827"}}
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should not register old panel', async () => {
            const result = '0';
            const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uId, pId } };
            const registerActionString = JSON.stringify(registerAction);
            //{"type":1,"data":{"type":"MP","uId":"admin@admin.com","pId":"04a03035fea7c827"}}
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should not register panel for unknown user ', async () => {
            const result = '0';
            const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uId: '-', pId } };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
    });
});

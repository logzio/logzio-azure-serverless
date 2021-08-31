// const nock = require('nock');
// const testLogs = require('./test-logs');
// const logsFunction = require('../logzioLogsFunction/index.js');
//
// const dummyHost = 'mocked-listener.logz.io';
// const nockHttpAddress = `https://${dummyHost}:8071`;
// const dummyToken = '123456789';
//
//
// const context = {
//     log: () => {},
//     done: () => {},
//     err: () => {},
// };
//
// describe('Azure eventHub functions - unittest', () => {
//     beforeEach(() => {
//         process.env.LogzioMetricsToken = dummyToken;
//         process.env.LogzioLogsToken = dummyToken;
//         process.env.LogzioMetricsHost = dummyHost;
//         process.env.LogzioLogsHost = dummyHost;
//     });
//         it('audit logs', (done) => {
//             nock(nockHttpAddress)
//                 .post('/')
//                 .query({
//                     token: dummyToken,
//                 })
//                 .reply(200, () => {
//                     done();
//                 });
//             logsFunction(context, [testLogs.auditLogs]);
//             expect(1).toBe(1)
//         });
//
//     it('networkSecurityGroupRuleCounterLogs', (done) => {
//         nock(nockHttpAddress)
//             .post('/')
//             .query({
//                 token: dummyToken,
//             })
//             .reply(200, () => {
//                 done();
//             });
//         logsFunction(context, [testLogs.networkSecurityGroupRuleCounterLogs]);
//         expect(1).toBe(1)
//     });
//
//     it('singleLog', (done) => {
//         nock(nockHttpAddress)
//             .post('/')
//             .query({
//                 token: dummyToken,
//             })
//             .reply(200, () => {
//                 done();
//             });
//         logsFunction(context, [testLogs.singleLog]);
//         expect(1).toBe(1)
//     });
//
//     it('logArray', (done) => {
//         nock(nockHttpAddress)
//             .post('/')
//             .query({
//                 token: dummyToken,
//             })
//             .reply(200, () => {
//                 done();
//             });
//         logsFunction(context, [testLogs.logArray]);
//         expect(1).toBe(1)
//     });
//
//     it('multipleLogs', (done) => {
//         nock(nockHttpAddress)
//             .post('/')
//             .query({
//                 token: dummyToken,
//             })
//             .reply(200, () => {
//                 done();
//             });
//         logsFunction(context, [testLogs.singleLog,testLogs.singleLog]);
//         expect(1).toBe(1)
//     });
//     it('nested', (done) => {
//         nock(nockHttpAddress)
//             .post('/')
//             .query({
//                 token: dummyToken,
//             })
//             .reply(200, () => {
//                 done();
//             });
//         logsFunction(context, [testLogs.nested]);
//         expect(1).toBe(1)
//     });
// });

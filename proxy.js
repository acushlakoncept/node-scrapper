const request = require('request-promise').defaults({
    // proxy: 'http://user:password@ip:port'
    proxy: 'http://185.10.166.130:8080'
});

(async () =>{
    let response = await request('https://httpbin.org/ip');

    console.log(response);
})();
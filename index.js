const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const request = require('request')

const URLS = [
    { url: 'https://www.imdb.com/title/tt6468322/?ref_=hm_fanfav_tt_2_pd_fp1',
      id: 'money_heist'
    },
    { url: 'https://www.imdb.com/title/tt0903747/?ref_=tt_sims_tti',
      id: 'breaking_bad'
    }
    ];
const URL_QUOTE = 'https://branham.org/QuoteOfTheDay';

(async () => {
    let moviesData = [];
    for(let movie of URLS) {
    const response = await requestPromise({
        uri: movie.url,
        headers: {
            'host': 'www.imdb.com',
            'method': 'GET',
            'scheme': 'https',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en,en-US;q=0.9,af;q=0.8',
            'cache-control': 'max-age=0',
            'referer': 'https://www.imdb.com/',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
        },
        gzip: true
    });
    // const response2 = await request(URL_QUOTE);
    
    let $ = cheerio.load(response);
    // let $$ = cheerio.load(response2);
    let title = $('div[class="title_wrapper"]>h1').text().trim();
    let rating= $('span[itemprop="ratingValue"]').text();
    let poster= $('div[class="poster"]>a>img').attr('src');
    let totalRating = $('div[class="imdbRating"]>a').text();
    let genres = [];
    $('div[class="subtext"] a[href^="/search/title?genres" ]').each((i, elm) => {let genre = $(elm).text();  genres.push(genre) })

    moviesData.push({
        title,
        rating,
        poster,
        totalRating,
        genres
    })

    let file = fs.createWriteStream(`${movie.id}.jpg`);
    // let stream = request(poster).pipe(file);

    await new Promise((resolve, reject) => {
        let stream = request(poster).pipe(file)
        .on('finish', ()=> {
            console.log(`${movie.id} image finished downloading successfully`);
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`${movie.id} has error on download. ${error}`);
    });

    // let stream = request({
    //     url: poster,
    //     headers: {
    //         'host': 'www.imdb.com',
    //         'method': 'GET',
    //         'path': '/title/tt6468322/?ref_=hm_fanfav_tt_2_pd_fp1',
    //         'scheme': 'https',
    //         'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    //         'accept-encoding': 'gzip, deflate, br',
    //         'accept-language': 'en,en-US;q=0.9,af;q=0.8',
    //         'cache-control': 'max-age=0',
    //         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
    //     },
    //     gzip: true
    // })
    // .pipe(file);

    // let quoteDate = $$('span[id="title"]').text();
    // let quoteTitle = $$('span[id="summary"]>p').text();
    // let quoteText = $$('span[id="content"]>p').text();

    // console.log(quoteDate);
    // console.log(quoteTitle);
    // console.log(quoteText);

    // const fields = ['title', 'rating'];

    // const json2csvParser = new Json2csvParser({ fields });
    // const csv = json2csvParser.parse(moviesData);

    // fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
    // fs.writeFileSync('./data.csv', csv, 'utf-8');
    // console.log(csv);   
    
    

}

})()
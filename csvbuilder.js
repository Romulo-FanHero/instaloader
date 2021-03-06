// csvbuilder.js

const fs = require('fs');
const promise = require('bluebird');
const json2csv = require('json2csv');
const instaService = require('./insta.js');

const OUTPUT_FILEPATH = 'output.csv';

const MAX_DAYS = 90;
const MAX_POSTS = 2000;

const PROFILES = [
    /*
    'vascodagama',
    'therealbigsmo',
    'ludmilla',
    'comunidade_agua_viva',
    'comunidadeservir',
    'pretagil',
    'filipetoledo',
    'zsuzsubell',
    'swimmac_1977',
    'heliocastroneves',
    'florida_cup',
    'bruninhoedavi',
    'theblurbarbosa',
    'ccrestauracao',
    'jeniffer_nascimento',
    'orlandocitysc'
    */
    'abdevilliers17',
    'djfreshsa',
    'noeliaofficial',
    'alinebarreto_oficial',
    'jessekriel15',
    'corinthians'
];

const csvBuild = () => {
    return promise.mapSeries(PROFILES, profile => {
        return instaService.measure({
                profile: profile,
                digits: 4,
                maxDays: MAX_DAYS,
                maxPosts: MAX_POSTS,
                timeoutPerRequest: 60000
            })
            .then(result => {
                console.log(profile, 'finished');
                return {
                    profile: result.profileInfo.username,
                    is_verified: result.profileInfo.isVerified,
                    followers: result.profileInfo.followersCount,
                    /*
                    insta_posts_last_90d: result.postStats.totalSamples,
                    insta_avg_posts_per_week: result.postStats.avgPostsPerWeek,
                    insta_avg_likes_per_week: result.postStats.avgLikesPerWeek,
                    insta_avg_comments_per_week: result.postStats.avgCommentsPerWeek,
                    insta_likes_per_post_q1: result.postStats.likesPerPost.q1,
                    insta_likes_per_post_q2: result.postStats.likesPerPost.median,
                    insta_likes_per_post_q3: result.postStats.likesPerPost.q3,
                    insta_likes_per_follower_q1: Math.round(result.postStats.percentLikesPerFollower.q1 * 10000),
                    */
                    insta_likes_per_follower_q2: /*Math.round(*/result.postStats.percentLikesPerFollower.median/* * 10000)*/,
                    /*
                    insta_likes_per_follower_q3: Math.round(result.postStats.percentLikesPerFollower.q3 * 10000),
                    insta_comments_per_post_q1: result.postStats.commentsPerPost.q1,
                    insta_comments_per_post_q2: result.postStats.commentsPerPost.median,
                    insta_comments_per_post_q3: result.postStats.commentsPerPost.q3,
                    insta_comments_per_follower_q1: Math.round(result.postStats.percentCommentsPerFollower.q1 * 10000),
                    insta_comments_per_follower_q2: Math.round(result.postStats.percentCommentsPerFollower.median * 10000),
                    insta_comments_per_follower_q3: Math.round(result.postStats.percentCommentsPerFollower.q3 * 10000),
                    insta_hours_between_posts_q1: Math.round(result.postStats.hoursBetweenPosts.q1 * 10000),
                    */
                    insta_hours_between_posts_q2: /*Math.round(*/result.postStats.hoursBetweenPosts.median/* * 10000)*/,
                    /*
                    insta_hours_between_posts_q3: Math.round(result.postStats.hoursBetweenPosts.q3 * 10000),
                    */
                    lpf: result.predictions.lpf,
                    hbp: result.predictions.hbp,
                    r30d: result.predictions.r30d,
                    d30d: result.predictions.d30d
                };
            });
    })
    .then(results => {
        fs.writeFile(OUTPUT_FILEPATH, json2csv({ data: results}));
    })
    .then(() => {
        console.log('csv file written succesfully');
    })
    .catch(err => {
        console.error(err);
        console.log('csv file could not be written');
    });
};

csvBuild();

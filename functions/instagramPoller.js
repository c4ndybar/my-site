const db = require('./database');
const axios = require('axios');
const { credentials } = require('config');

async function getPosts() {
    const response = await axios({
        method: 'get',
        url: `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${credentials.instagramAccessToken}`,
    });

    return response.data.data.map((post) => {
            return {
                id: post.id,
                caption: post.caption || '',
                mediaType: post.media_type,
                url: post.permalink,
                date: new Date(post.timestamp)
            };
        });
}

exports.pollInstagram = async () => {
    const posts = await getPosts();
    await db.updateInstagramHistory(posts);

    return posts;
};
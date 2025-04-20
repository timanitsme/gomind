export default function getAccessToken() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});
    console.log(`cookies: ${JSON.stringify(document.cookie)}`)
    console.log(`access-token: ${cookies["jwt-cookie"]}`)
    return cookies["jwt-cookie"] || null;
};


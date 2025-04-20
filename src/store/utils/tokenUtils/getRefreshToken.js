export default function getRefreshToken() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});
    console.log(`refresh token: ${cookies["refresh-jwt-cookie"]}`)
    return cookies["refresh-jwt-cookie"] || null;
};
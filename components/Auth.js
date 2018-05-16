import { Config } from "../config.js";
const authUrl = `${Config.apiUrl}/wp-json/jwt-auth/v1`;

export default class Auth {
  authenticate(username, password) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

       return fetch(`${authUrl}/token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({username, password})
        }).then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
                console.log(res);
            }

            return res.json();
        });
    }
}

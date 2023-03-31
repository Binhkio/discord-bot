export const casesPrice = async (steamId) => {
    const inventoryUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english`
    try {
        const response = await fetch(inventoryUrl, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en,vi;q=0.9,vi-VN;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "steamCountry=VN%7C4548f908b97ace0a08f9c789cc41a068; steamLoginSecure=76561199087566508%7C%7CeyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MTc3RV8yMjRGN0MxQV8yNUExMyIsICJzdWIiOiAiNzY1NjExOTkwODc1NjY1MDgiLCAiYXVkIjogWyAid2ViIiBdLCAiZXhwIjogMTY4MDMyODkxNCwgIm5iZiI6IDE2NzE2MDEyNTMsICJpYXQiOiAxNjgwMjQxMjUzLCAianRpIjogIjE4OUVfMjI0RjdDRDRfQTNGNTAiLCAib2F0IjogMTY4MDI0MTI1MywgInJ0X2V4cCI6IDE2OTgyMTYxODMsICJwZXIiOiAwLCAiaXBfc3ViamVjdCI6ICIxMTMuMTg1LjQ2LjQiLCAiaXBfY29uZmlybWVyIjogIjExMy4xODUuNDYuNCIgfQ.m7kFZMgqb3OaW3gh0zp1BnWPBH5u5BnrXfUyzPhGStL8Px3Sdf2ZedLlCWxrVWGx94OE1lRnQKRF4U-rhHP_CA; sessionid=fca1ecc06cc9bbeba420455c; browserid=2904299293281541793; webTradeEligibility=%7B%22allowed%22%3A1%2C%22allowed_at_time%22%3A0%2C%22steamguard_required_days%22%3A15%2C%22new_device_cooldown_days%22%3A0%2C%22time_checked%22%3A1680241270%7D; timezoneOffset=25200,0; strInventoryLastContext=730_2; _ga=GA1.2.2096739159.1680241281; _gid=GA1.2.2128413412.1680241281; Steam_Language=english",
                "Referer": `https://steamcommunity.com/profiles/${steamId}/inventory/`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        })
    
        const resData = await response.json()
        const inventoryData = resData.descriptions
        const caseData = inventoryData
            .filter(data => data.market_hash_name.toLowerCase().includes("case"))
            .map(data => data.market_hash_name)
        const priceObj = await Promise.all(caseData.map(async (caseName) => {
            const historyPriceUrl = `https://steamcommunity.com/market/pricehistory/?appid=730&market_hash_name=${encodeURIComponent(caseName)}`
            const data = await fetch(historyPriceUrl, {
                "headers": {
                    "accept": "text/javascript, text/html, application/xml, text/xml, */*",
                    "accept-language": "en,vi;q=0.9,vi-VN;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5",
                    "if-modified-since": "Fri, 31 Mar 2023 06:13:15 GMT",
                    "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-prototype-version": "1.7",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": "steamCountry=VN%7C4548f908b97ace0a08f9c789cc41a068; steamLoginSecure=76561199087566508%7C%7CeyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MTc3RV8yMjRGN0MxQV8yNUExMyIsICJzdWIiOiAiNzY1NjExOTkwODc1NjY1MDgiLCAiYXVkIjogWyAid2ViIiBdLCAiZXhwIjogMTY4MDMyODkxNCwgIm5iZiI6IDE2NzE2MDEyNTMsICJpYXQiOiAxNjgwMjQxMjUzLCAianRpIjogIjE4OUVfMjI0RjdDRDRfQTNGNTAiLCAib2F0IjogMTY4MDI0MTI1MywgInJ0X2V4cCI6IDE2OTgyMTYxODMsICJwZXIiOiAwLCAiaXBfc3ViamVjdCI6ICIxMTMuMTg1LjQ2LjQiLCAiaXBfY29uZmlybWVyIjogIjExMy4xODUuNDYuNCIgfQ.m7kFZMgqb3OaW3gh0zp1BnWPBH5u5BnrXfUyzPhGStL8Px3Sdf2ZedLlCWxrVWGx94OE1lRnQKRF4U-rhHP_CA; sessionid=fca1ecc06cc9bbeba420455c; browserid=2904299293281541793; webTradeEligibility=%7B%22allowed%22%3A1%2C%22allowed_at_time%22%3A0%2C%22steamguard_required_days%22%3A15%2C%22new_device_cooldown_days%22%3A0%2C%22time_checked%22%3A1680241270%7D; timezoneOffset=25200,0; strInventoryLastContext=730_2; _ga=GA1.2.2096739159.1680241281; _gid=GA1.2.2128413412.1680241281; Steam_Language=english",
                    "Referer": `https://steamcommunity.com/profiles/${steamId}/inventory/`,
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
            })
            const { prices } = await data.json()
            const [,currentPrice,] = prices.pop()
            const [,prevPrice,] = prices.pop()
            return {
                name: caseName,
                price: currentPrice,
                increase: currentPrice > prevPrice
            }
        }))
        return priceObj
    } catch (error) {
        console.log(error);
    }
}